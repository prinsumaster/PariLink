const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  page.on('response', async response => {
    if (response.status() >= 400) {
      let body = '';
      try { body = (await response.text()).slice(0, 300); } catch(e) {}
      errors.push({ status: response.status(), url: response.url(), body });
    }
  });
  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.message.slice(0, 300));
  });

  // Login
  await page.goto('http://localhost:3000/auth/login');
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 15000 });

  // Go to admin
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(2000);

  // Click "Internal Users" tab
  console.log('\n=== CLICKING "Internal Users" TAB ===');
  errors.length = 0;
  await page.click('button:has-text("Internal Users")');
  await page.waitForTimeout(3000);
  console.log('Errors after "Internal Users":', JSON.stringify(errors, null, 2));
  const hasExceptionUsers = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('System Exception after users tab:', hasExceptionUsers);

  // Click "Audit Logs" tab
  console.log('\n=== CLICKING "Audit Logs" TAB ===');
  errors.length = 0;
  await page.click('button:has-text("Audit Logs")');
  await page.waitForTimeout(3000);
  console.log('Errors after "Audit Logs":', JSON.stringify(errors, null, 2));
  const hasExceptionAudit = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('System Exception after audit tab:', hasExceptionAudit);

  // Click "Production Health" tab
  console.log('\n=== CLICKING "Production Health" TAB ===');
  errors.length = 0;
  await page.click('button:has-text("Production Health")');
  await page.waitForTimeout(3000);
  console.log('Errors after "Production Health":', JSON.stringify(errors, null, 2));
  const hasExceptionHealth = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('System Exception after health tab:', hasExceptionHealth);

  await page.screenshot({ path: '/Users/vishalvirda/Desktop/PariLink/scratch/admin_tabs_test.png', fullPage: true });
  await browser.close();
  console.log('\nDONE');
})();
