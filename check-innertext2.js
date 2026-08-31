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
  await page.waitForTimeout(1000);
  
  const buttons = await page.$$('button, a[role="button"]');
  for (const btn of buttons) {
    const text = await btn.innerText().catch(() => '');
    const lowerText = text.toLowerCase();
    if (lowerText.includes('delete') || lowerText.includes('remove') || lowerText.includes('confirm')) continue;
    
    try {
      await btn.click({ timeout: 1000 });
      await page.waitForTimeout(500);
      const innerText = await page.evaluate(() => document.body.innerText);
      if (innerText.includes('undefined')) {
        console.log("Found undefined after clicking:", text);
        const idx = innerText.indexOf('undefined');
        console.log(innerText.substring(Math.max(0, idx - 50), idx + 50));
      }
    } catch(e) {}
  }
  
  await browser.close();
})();
