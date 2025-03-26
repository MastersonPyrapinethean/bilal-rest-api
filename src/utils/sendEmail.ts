import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';

// For env File
dotenv.config({ path: path.resolve(__dirname, '/etc/secrets/.env') });

interface EmailOptions {
    from: string;
    to: string;
    subject: string;
    text?: string;
    html?: string;
    attachments?: { filename: string; content: Buffer }[];
}

const sendEmail = async (to: string, pdfBuffer: Buffer) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: 465,
        secure: true,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASSWORD,
        },
    });

    const mailOptions: EmailOptions = {
        from: '"YAAVAAY" <contact@yaavaay.com>', // sender address
        to: to,
        subject: 'YAAVAAY - Your Receipt',
        text: 'Please find attached your receipt.',
        attachments: [
            {
                filename: 'receipt.pdf',
                content: pdfBuffer,
            },
        ],
    };

    const info = await transporter.sendMail(mailOptions);
    console.log(`Message sent: ${info.messageId}`);
};

export default sendEmail;
