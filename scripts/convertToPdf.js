const puppeteer = require('puppeteer');
const fs = require('fs');

async function convertHtmlToPdf(htmlPath, pdfPath) {
    const browser = await puppeteer.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    
    // Read HTML content from file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');
    
    // Set HTML content and wait for page to load
    await page.setContent(htmlContent, {
        waitUntil: 'networkidle0'
    });
    
    // Generate PDF with proper print layout
    await page.pdf({
        path: `${pdfPath}.pdf`,
        format: 'A4',
        printBackground: true,
        margin: {
            top: '0mm',
            right: '0mm',
            bottom: '0mm',
            left: '0mm'
        },
        scale: 0.97
    });

    await page.screenshot({ 
        path: `${pdfPath}.png`,
        fullPage: true
    });

    await browser.close();
}

// Get input and output paths from command line arguments
const [,, inputPath, outputPath] = process.argv;

if (!inputPath || !outputPath) {
    console.error('Usage: node convertToPdf.js <input.html> <output>');
    process.exit(1);
}

convertHtmlToPdf(inputPath, outputPath)
    .then(() => console.log(`PDF and PNG generated at: ${outputPath}`))
    .catch(err => {
        console.error('Error generating PDF and PNG:', err);
        process.exit(1);
    });
