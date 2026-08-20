const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const allResponses = [];

  page.on('response', async response => {
    const entry = { status: response.status(), url: response.url() };
    if (response.status() >= 400) {
      try { entry.body = (await response.text()).slice(0, 400); } catch(e) { entry.body = 'could not read'; }
    }
    allResponses.push(entry);
  });

  page.on('pageerror', err => {
    console.log('PAGE_ERROR:', err.message);
    console.log('PAGE_ERROR_STACK:', (err.stack || '').slice(0, 600));
  });

  // ============ LOGIN ============
  console.log('STEP 1: Navigate to login');
  await page.goto('http://localhost:3000/auth/login');
  console.log('  URL after goto:', page.url());

  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  console.log('STEP 2: Submitting login form');
  await page.click('button[type="submit"]');

  try {
    await page.waitForURL('**/dashboard**', { timeout: 15000 });
    console.log('  LOGIN SUCCESS — redirected to:', page.url());
  } catch (e) {
    console.log('  LOGIN FAILED — still at:', page.url());
    const bodyText = await page.evaluate(() => document.body.innerText.slice(0, 800));
    console.log('  Body text:', bodyText);
    await browser.close();
    process.exit(1);
  }

  // ============ DASHBOARD ============
  console.log('\n====== LOADING /dashboard ======');
  allResponses.length = 0;
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(6000);
  console.log('  URL:', page.url());

  const dashBody = await page.evaluate(() => document.body.innerText.slice(0, 1200));
  console.log('  Body text (first 1200 chars):\n---\n' + dashBody + '\n---');

  const dashErrors = allResponses.filter(r => r.status >= 400);
  console.log('  4xx/5xx responses (' + dashErrors.length + '):');
  dashErrors.forEach(r => console.log('    ' + r.status + ' ' + r.url + ' | ' + (r.body || '').slice(0, 200)));

  const hasDashException = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('  System Exception visible:', hasDashException);
  await page.screenshot({ path: '/Users/vishalvirda/Desktop/PariLink/scratch/task1_dashboard.png', fullPage: true });

  // ============ ADMIN ============
  console.log('\n====== LOADING /admin ======');
  allResponses.length = 0;
  await page.goto('http://localhost:3000/admin');
  await page.waitForTimeout(6000);
  console.log('  URL:', page.url());

  const adminBody = await page.evaluate(() => document.body.innerText.slice(0, 1200));
  console.log('  Body text (first 1200 chars):\n---\n' + adminBody + '\n---');

  const adminErrors = allResponses.filter(r => r.status >= 400);
  console.log('  4xx/5xx responses (' + adminErrors.length + '):');
  adminErrors.forEach(r => console.log('    ' + r.status + ' ' + r.url + ' | ' + (r.body || '').slice(0, 200)));

  const hasAdminException = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('  System Exception visible:', hasAdminException);
  await page.screenshot({ path: '/Users/vishalvirda/Desktop/PariLink/scratch/task1_admin.png', fullPage: true });

  await browser.close();
  console.log('\nDONE');
})();
