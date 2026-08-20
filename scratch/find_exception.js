const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push('PAGE_ERROR: ' + err.message + '\n' + err.stack);
  });

  page.on('response', async response => {
    if (response.status() >= 400) {
      let body = '';
      try { body = await response.text(); } catch(e) {}
      networkErrors.push({ status: response.status(), url: response.url(), body: body.slice(0, 300) });
    }
  });

  // Login
  await page.goto('http://localhost:3000/auth/login');
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForTimeout(3000);

  // -- DASHBOARD --
  console.log('\n====== DASHBOARD LOAD ======');
  consoleErrors.length = 0; networkErrors.length = 0;
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(5000);
  console.log('Console errors:', JSON.stringify(consoleErrors, null, 2));
  console.log('Network errors:', JSON.stringify(networkErrors, null, 2));
  const dashHtml = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('Page text:', dashHtml);
  await page.screenshot({ path: 'scratch/dash_before.png' });

  // -- ADMIN --
  console.log('\n====== ADMIN LOAD ======');
  consoleErrors.length = 0; networkErrors.length = 0;
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(5000);
  console.log('Console errors:', JSON.stringify(consoleErrors, null, 2));
  console.log('Network errors:', JSON.stringify(networkErrors, null, 2));
  const adminHtml = await page.evaluate(() => document.body.innerText.slice(0, 500));
  console.log('Page text:', adminHtml);
  await page.screenshot({ path: 'scratch/admin_before.png' });

  await browser.close();
})();
