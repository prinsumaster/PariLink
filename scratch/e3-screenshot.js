const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Navigate to audit page which fetches the API
  await page.goto('http://localhost:3000/login?session_expired=true');

  await page.waitForTimeout(2000);
  
  await page.screenshot({ path: 'interceptor_callbackurl_proof_1787223798914.png' });
  await browser.close();
})();
