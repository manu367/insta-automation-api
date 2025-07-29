const express = require('express');
const puppeteer = require('puppeteer');

const app = express();
app.use(express.json());

app.post('/run-instagram', async (req, res) => {
    const { username, password } = req.body;

    try {
        // const browser = await puppeteer.launch({ headless: "new" });
        const browser = await puppeteer.launch({
            headless: false,
            defaultViewport: null,
            args: ["--start-maximized"]
        });

        const page = await browser.newPage();

        await page.goto('https://www.instagram.com/accounts/login/', {
            waitUntil: 'networkidle2',
        });

        // Fill login form
        await page.waitForSelector('input[name="username"]');
        await page.type('input[name="username"]', username, { delay: 50 });
        await page.type('input[name="password"]', password, { delay: 50 });

        await Promise.all([
            page.click('button[type="submit"]'),
            page.waitForNavigation({ waitUntil: 'networkidle2' }),
        ]);

        // Profile navigation example
        await page.goto('https://www.instagram.com/manu.life01', {
            waitUntil: 'networkidle2',
        });

        //await page.waitForTimeout(5000); // 5 seconds delay
        // await page.waitForTimeout(5000);
        await new Promise(resolve => setTimeout(resolve, 5000));


        await browser.close();
        res.send({ status: 'success', message: 'Automation completed' });
    } catch (error) {
        console.error('Automation Error:', error);
        res.status(500).send({ status: 'error', message: error.message });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
