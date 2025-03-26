import puppeteer from 'puppeteer';
import fs from 'fs';

const fontData = fs.readFileSync('./DIN-Condensed-Bold.ttf');

const generatePdf = async (htmlString: string): Promise<Buffer> => {
    const browser = await puppeteer.launch({
        args: [
            "--disable-setuid-sandbox",
            "--no-sandbox",
            "--single-process",
            "--no-zygote"
        ],
        executablePath: process.env.PUPPETEER_EXECUTABLE_PATH
    });
    const page = await browser.newPage();

	await page.setRequestInterception(true);
	page.on('request', interceptedRequest => {
		if (interceptedRequest.url() === 'https://yaavaay.com/static/media/DIN-Condensed-Bold.b4245a6a96ce6bf9c4bf.ttf') {
			interceptedRequest.respond({
				body: fontData
			});
		} else {
			interceptedRequest.continue();
		}
	});
    await page.setContent(htmlString);

    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
    });

    await browser.close();

    return pdfBuffer;
};

export default generatePdf;
