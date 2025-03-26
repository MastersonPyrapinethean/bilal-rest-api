import React from 'react';
import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import bodyParser from 'body-parser';
import cors from 'cors';
import { Pool } from 'pg';
import { body, query, validationResult } from "express-validator";
import multer from 'multer';
import path from 'path';
import * as fs from 'fs';
import Stripe from 'stripe';
import mime from 'mime';
import nodemailer from 'nodemailer';

//import background from './images/pdfbackground.png';

import ReactDOMServer from 'react-dom/server';
import ComponentToPrint from './utils/ComponentToPrint';
import generatePDF from './utils/generatePdf';
import sendEmail from './utils/sendEmail';

// For env File
dotenv.config({ path: path.resolve(__dirname, '/etc/secrets/.env') });

function determineLevel(amount: number) {
    if (amount <= 10000) return 0;
    else if (amount <= 100000) return 1;
    else if (amount <= 1000000) return 2;
    else if (amount <= 10000000) return 3;
    else if (amount > 10000000) return 4;
    else return 0;
}

// Initialize Database Connection (PostgreSQL)
const pool = new Pool({
    connectionString: process.env.DB_CON_URL,
    ssl: {
        rejectUnauthorized: false
    }
});

// Initialize stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
    apiVersion: '2023-08-16',
});

const app: Application = express();
app.use(cors());

// Webhook handler for asynchronous events.
app.post('/webhook', express.raw({ type: 'application/json' }), async (request: Request, response: Response) => {
    const signature: string | undefined = request.headers['stripe-signature'] as string | undefined;
    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(request.body, signature!, process.env.STRIPE_WEBHOOK_SECRET as string);
    } catch (err) {
        // @ts-ignore
        response.status(400).send(`Webhook Error: ${err.message}`);
        return;
    }

    // Handle the event
    switch (event.type) {
        case 'checkout.session.completed':
            const checkoutSession = event.data.object as Stripe.Checkout.Session;
            console.log(checkoutSession)
            const userId = checkoutSession.metadata?.user_id;

            // Fetch line items for the session
            const lineItems = await stripe.checkout.sessions.listLineItems(checkoutSession.id);
            const priceId = lineItems.data[0].price?.id;
            const totalAmountPaid = lineItems.data[0].amount_total;

            // Generated unique code
            const uniqueCodeGenerated: string = generateUniqueCode();

            try {
                await pool.query(`INSERT INTO checkout_sessions (user_id, stripe_session_id, price_id, payment_status, payment_code, amount) VALUES ($1, $2, $3, 'completed', $4, $5)`, [userId, checkoutSession.id, priceId, uniqueCodeGenerated, totalAmountPaid]);

                const userQuery = await pool.query(`SELECT * FROM users WHERE id = $1`, [userId]);
                const user = userQuery.rows[0];

                // Define path to the user's avatar
                const avatarPath = path.join(process.env.MOUNT_PATH ?? '', user.avatar);

                // Check if the avatar exists, and if so, convert it to base64
                let base64ImageString: string | undefined;
                if (fs.existsSync(avatarPath)) {
                    const fileData = fs.readFileSync(avatarPath);
                    const mimeType = mime.getType(avatarPath) || 'image/jpeg'; // Default to JPEG if unable to determine type
                    base64ImageString = `data:${mimeType};base64,${fileData.toString('base64')}`;
                }

                // Generate receipt and send it through user email
                const htmlString = ReactDOMServer.renderToStaticMarkup(
                    <ComponentToPrint level={determineLevel(user.amount)} name={`${user.first_name} ${user.last_name}`} code={uniqueCodeGenerated} image={base64ImageString} />
                );

                const pdfBuffer = await generatePDF('<html style="margin: 0; padding: 0"><body style="margin: 0; padding: 0">' + htmlString + '</body></html>');
                console.log("Sending mail")
                await sendEmail(user.email, pdfBuffer);

            } catch (dbError) {
                console.error("Database error:", dbError);
            }

            break;
        default:
            console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    return response.send();
});

app.use(bodyParser.json());

const port = process.env.PORT || 8001;

// Used to make health checks
app.get('/', (req: Request, res: Response) => {
    res.send('YAAVAAY - REST-API');
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, process.env.MOUNT_PATH ?? ''); // Your Render disk mount path
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

function generateUniqueCode(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    const segments = [2, 4, 4, 4, 4];
    return segments.map(segment => {
        return Array.from({ length: segment }).map(() => chars[Math.floor(Math.random() * chars.length)]).join('');
    }).join('-');
}

// Fetch the Checkout Session to display the JSON result on the success page
app.get('/checkout-session', [
    query("sessionId").notEmpty().withMessage("SessionId is required")
], async (req: Request, res: Response) => {
    const { session_id } = req.query;
    console.log(req.query)
    const session = await stripe.checkout.sessions.retrieve(session_id as string);

    res.send({
        status: session.status,
        customer_email: session.customer_details?.email
    });
});

app.get('/donations', async (req: Request, res: Response) => {
    try {
        const result = await pool.query('SELECT SUM(amount) AS total FROM checkout_sessions WHERE payment_status = $1', ['completed']);
        const totalAmount = result.rows[0].total || 0;

        res.status(200).json({ totalAmount: totalAmount });
    } catch (error) {
        // If there's an error, send an error message
        console.error('Error getting total amount', error);
        res.status(500).json({ error: 'Error getting total amount' });
    }
});

// POST endpoint for contact form
app.post('/contact',
    [
        body("email").isEmail().withMessage("Invalid email address"),
        body("name").notEmpty().withMessage("Name is required"),
    ],
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { email, name } = req.body;

        try {
            const transporter = nodemailer.createTransport({
                host: process.env.SMTP_HOST,
                port: 465,
                secure: true,
                auth: {
                    user: process.env.SMTP_USER,
                    pass: process.env.SMTP_PASSWORD,
                },
            });

            const mailOptions = {
                from: '"YAAVAAY" <contact@yaavaay.com>',
                to: '"YAAVAAY" <contact@yaavaay.com>',
                subject: 'YAAVAAY - New contact',
                text: `Email: ${email}\nMesssage: ${name}`,
            };

            await transporter.sendMail(mailOptions);
            return res.status(201).json({ message: 'Contact sent successfully' });
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Internal Server Error' });
        }
    }
);

// POST endpoint for creating a new user
app.post('/v1/users',
    upload.single('image'),
    [
      body("email").isEmail().withMessage("Valid email required"),
      body("firstName").notEmpty().trim().withMessage("First name required"),
      body("lastName").notEmpty().trim().withMessage("Last name required"),
      body("priceId").notEmpty().withMessage("Price ID required")
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ 
          success: false,
          errors: errors.array() 
        });
      }
  
      const { firstName, lastName, email, priceId } = req.body;
      const imageName = req.file?.filename;
  
      try {
        const emailCheck = await pool.query(
          'SELECT id FROM users WHERE email = $1', 
          [email.toLowerCase()]
        );
        
        if (emailCheck.rows.length > 0) {
          return res.status(409).json({
            success: false,
            error: "Email already registered"
          });
        }
  
        await pool.query('BEGIN');
  
        const { rows } = await pool.query(
          `INSERT INTO users (first_name, last_name, email, avatar) 
           VALUES ($1, $2, $3, $4) 
           RETURNING id, first_name, last_name, email, avatar`,
          [firstName.trim(), lastName.trim(), email.toLowerCase(), imageName]
        );
        const user = rows[0];
  
        const domainURL = process.env.FRONTEND_URL || "https://www.yaavaay.com";
        const session = await stripe.checkout.sessions.create({
          ui_mode: 'embedded',
          line_items: [{ price: priceId, quantity: 1 }],
          mode: 'payment',
          return_url: `${domainURL}/return?session_id={CHECKOUT_SESSION_ID}`,
          metadata: { user_id: user.id }
        });
  
        await pool.query('COMMIT');
  
        const receiptHtml = ReactDOMServer.renderToStaticMarkup(
          <ComponentToPrint 
            level={0} 
            name={`${user.first_name} ${user.last_name}`} 
            code={generateUniqueCode()}
            image={imageName ? await getBase64Image(imageName) : undefined}
          />
        );
        const pdfBuffer = await generatePDF(receiptHtml);
  
        await sendEmail(user.email, pdfBuffer);
        
        await sendEmail('contact@yaavaay.com', pdfBuffer);
  
        return res.status(201).json({
          success: true,
          message: 'User created successfully',
          user: user,
          checkoutUrl: session.url,
          sessionId: session.id
        });
  
      } catch (error) {
        await pool.query('ROLLBACK');
        console.error('Registration failed:', error);
        
        return res.status(500).json({
          success: false,
          error: 'Registration failed',
          details: error instanceof Error ? error.message : String(error)
        });
      }
    }
  );
  
  // Helper function to convert image to base64 (unchanged from your setup)
  async function getBase64Image(filename: string): Promise<string> {
    const imagePath = path.join(process.env.MOUNT_PATH || '', filename);
    const fileData = fs.readFileSync(imagePath);
    const mimeType = mime.getType(imagePath) || 'image/jpeg';
    return `data:${mimeType};base64,${fileData.toString('base64')}`;
  }

// GET endpoint to serve images
app.get('/v1/images/:imageName', (req: Request, res: Response) => {
    const imageName = req.params.imageName;
    const imagePath = path.join(process.env.MOUNT_PATH ?? '', imageName); // Your Render disk mount path

    res.sendFile(imagePath, (err) => {
        if (err) {
            res.status(404).json({ error: "Image not found" });
        }
    });
});

app.get('/requestpdf/:checkoutSessionId', async (req: Request, res: Response) => {
    const checkoutSessionId = req.params.checkoutSessionId;

    const userQuery = await pool.query(`SELECT * FROM users LEFT JOIN checkout_sessions ON users.id = checkout_sessions.user_id WHERE checkout_sessions.stripe_session_id = $1`, [checkoutSessionId.replace('.pdf', '')]);
    const user = userQuery.rows[0];
    const uniqueCodeGenerated = user.payment_code;

    // Define path to the user's avatar
    const avatarPath = path.join(process.env.MOUNT_PATH ?? '', user.avatar);

    // Check if the avatar exists, and if so, convert it to base64
    let base64ImageString: string | undefined;
    if (fs.existsSync(avatarPath)) {
        const fileData = fs.readFileSync(avatarPath);
        const mimeType = mime.getType(avatarPath) || 'image/jpeg'; // Default to JPEG if unable to determine type
        base64ImageString = `data:${mimeType};base64,${fileData.toString('base64')}`;
    }

    // Generate receipt and send it through user email
    const htmlString = ReactDOMServer.renderToStaticMarkup(
        <ComponentToPrint level={determineLevel(user.amount)} name={`${user.first_name} ${user.last_name}`} code={uniqueCodeGenerated} image={base64ImageString} />
    );
    const pdfBuffer = await generatePDF('<html style="margin: 0; padding: 0"><body style="margin: 0; padding: 0">' + htmlString + '</body></html>');

    res.send(pdfBuffer);
});

app.get('/requestpdfashtml/:checkoutSessionId', async (req: Request, res: Response) => {
    const checkoutSessionId = req.params.checkoutSessionId;

    const userQuery = await pool.query(`SELECT * FROM users LEFT JOIN checkout_sessions ON users.id = checkout_sessions.user_id WHERE checkout_sessions.stripe_session_id = $1`, [checkoutSessionId]);
    const user = userQuery.rows[0];
    const uniqueCodeGenerated = user.payment_code;

    // Define path to the user's avatar
    const avatarPath = path.join(process.env.MOUNT_PATH ?? '', user.avatar);

    // Check if the avatar exists, and if so, convert it to base64
    let base64ImageString: string | undefined;
    if (fs.existsSync(avatarPath)) {
        const fileData = fs.readFileSync(avatarPath);
        const mimeType = mime.getType(avatarPath) || 'image/jpeg'; // Default to JPEG if unable to determine type
        base64ImageString = `data:${mimeType};base64,${fileData.toString('base64')}`;
    }

    // Generate receipt and send it through user email
    const htmlString = ReactDOMServer.renderToStaticMarkup(
        <ComponentToPrint level={determineLevel(user.amount)} name={`${user.first_name} ${user.last_name}`} code={uniqueCodeGenerated} image={base64ImageString} />
    );

    res.send('<html style="margin: 0; padding: 0"><body style="margin: 0; padding: 0">' + htmlString + '</body></html>');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
