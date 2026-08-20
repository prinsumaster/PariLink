const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  try {
    const context = await browser.newContext();
    const page = await context.newPage();
    let fingerprint = null;

    page.on('console', msg => {
      if (msg.text().includes('[WEB] GitSHA=')) {
        fingerprint = msg.text();
      }
    });

    await page.goto('http://localhost:3000/login');
    await page.waitForTimeout(2000);
    console.log(fingerprint || 'No GitSHA fingerprint found in console');

    await context.close();
  } catch (e) {
    console.error('Test Failed:', e.message);
  } finally {
    await browser.close();
  }
})();
