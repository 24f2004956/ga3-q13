const { chromium } = require('playwright');

(async () => {
    const browser = await chromium.launch();
    const seeds = [72, 73, 74, 75, 76, 77, 78, 79, 80, 81];
    let total = 0;

    for (const seed of seeds) {
        const page = await browser.newPage();
        const url = `https://sanand0.github.io/tdsdata/js_table/?seed=${seed}`;
        console.log(`Visiting: ${url}`);

        await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
        // Wait a bit more for JS tables to render
        await page.waitForTimeout(3000);

        const nums = await page.evaluate(() => {
            const cells = Array.from(document.querySelectorAll('table td, table th'));
            return cells
                .map(c => c.innerText.replace(/,/g, '').trim())
                .filter(t => t !== '' && !isNaN(t) && t !== '0' || (t !== '' && /^-?\d+(\.\d+)?$/.test(t)))
                .map(Number)
                .filter(n => !isNaN(n));
        });

        const seedSum = nums.reduce((a, b) => a + b, 0);
        console.log(`Seed ${seed}: ${nums.length} numbers, sum = ${seedSum}`);
        total += seedSum;

        await page.close();
    }

    await browser.close();
    console.log('');
    console.log(`TOTAL SUM ACROSS ALL SEEDS (72-81): ${total}`);
})();
