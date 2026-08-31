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
  await page.waitForTimeout(2000); // wait for render
  
  const innerText = await page.evaluate(() => document.body.innerText);
  console.log("Does innerText contain undefined?", innerText.includes('undefined'));
  
  if (innerText.includes('undefined')) {
    console.log("Context:");
    const idx = innerText.indexOf('undefined');
    console.log(innerText.substring(Math.max(0, idx - 50), idx + 50));
  }
  
  await browser.close();
})();
