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
  
  const innerText = await page.evaluate(() => document.body.innerText);
  console.log("Found undefined in operations innerText?", innerText.includes('undefined'));
  if (innerText.includes('undefined')) {
    const idx = innerText.indexOf('undefined');
    console.log("Operations overview:", innerText.substring(Math.max(0, idx - 50), idx + 50));
  }
  
  const buttons = await page.$$('button, a[role="button"], div[role="tab"], [role="tab"]');
  for (const btn of buttons) {
    const text = await btn.innerText().catch(() => '');
    if (text.includes('Health') || text.includes('Metrics') || text.includes('Incidents') || text.includes('Backup')) {
      await btn.click();
      await page.waitForTimeout(1000);
      const textAfter = await page.evaluate(() => document.body.innerText);
      console.log(`Found undefined in tab ${text}?`, textAfter.includes('undefined'));
      if (textAfter.includes('undefined')) {
        const idx = textAfter.indexOf('undefined');
        console.log(`Tab ${text}:`, textAfter.substring(Math.max(0, idx - 50), idx + 50));
      }
    }
  }
  await browser.close();
})();
