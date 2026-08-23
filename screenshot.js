const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'login-screenshot.png' });
  const html = await page.content();
  console.log(html.substring(0, 500));
  await browser.close();
})();
