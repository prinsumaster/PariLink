const { chromium } = require('playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const consoleErrors = [];
  const networkErrors = [];

  page.on('console', msg => {
    if (msg.type() === 'error') consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => {
    consoleErrors.push('PAGE_ERROR: ' + err.message + '\n' + (err.stack || '').slice(0, 500));
  });
  page.on('response', async response => {
    if (response.status() >= 400) {
      let body = '';
      try { body = await response.text(); } catch(e) {}
      networkErrors.push({ status: response.status(), url: response.url(), body: body.slice(0, 400) });
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
  console.log('Dashboard console errors:', JSON.stringify(consoleErrors));
  console.log('Dashboard network errors:', JSON.stringify(networkErrors));
  const hasDashException = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('Dashboard has System Exception:', hasDashException);
  await page.screenshot({ path: path.resolve('/Users/vishalvirda/Desktop/PariLink/scratch/dash_before.png') });

  // -- ADMIN --
  console.log('\n====== ADMIN LOAD ======');
  consoleErrors.length = 0; networkErrors.length = 0;
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(5000);
  console.log('Admin console errors:', JSON.stringify(consoleErrors));
  console.log('Admin network errors:', JSON.stringify(networkErrors));
  const hasAdminException = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('Admin has System Exception:', hasAdminException);
  await page.screenshot({ path: path.resolve('/Users/vishalvirda/Desktop/PariLink/scratch/admin_before.png') });

  await browser.close();
})();
