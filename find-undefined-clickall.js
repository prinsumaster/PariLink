const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  await page.goto('http://localhost:3000/operations', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(2000);
  
  const buttons = await page.$$('button, a[role="button"]');
  console.log("Found buttons:", buttons.length);
  for (const btn of buttons) {
    try {
      await btn.click({ timeout: 1000 });
      await page.waitForTimeout(500);
      const innerText = await page.evaluate(() => document.body.innerText);
      if (innerText.includes('undefined')) {
         console.log("Found undefined after clicking button");
         let idx = innerText.indexOf('undefined');
         while (idx !== -1) {
             const snippet = innerText.substring(Math.max(0, idx - 80), Math.min(innerText.length, idx + 80));
             console.log(`Snippet TEXT: ...${snippet}...`);
             idx = innerText.indexOf('undefined', idx + 1);
         }
      }
    } catch(e) {}
  }
  await browser.close();
})();
