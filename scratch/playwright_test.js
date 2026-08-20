const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const errors = [];
  const badResponses = [];

  page.on('console', msg => {
    if (msg.type() === 'error') errors.push(`[Console Error] ${msg.text()}`);
  });
  page.on('pageerror', err => errors.push(`[Page Error] ${err.message}`));
  page.on('response', response => {
    if (response.status() >= 400) {
      badResponses.push(`[${response.status()}] ${response.url()}`);
    }
  });

  try {
    console.log(`[Step 1] Navigating to /auth/login`);
    await page.goto('http://localhost:3000/auth/login');
    console.log(`Current URL: ${page.url()}`);

    console.log(`[Step 2] Filling login form`);
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    console.log(`[Step 3] Waiting for /dashboard`);
    try {
      await page.waitForURL('**/dashboard', { timeout: 10000 });
      console.log(`Successfully reached dashboard. Current URL: ${page.url()}`);
    } catch (e) {
      throw new Error(`Failed to reach dashboard! Current URL is still: ${page.url()}`);
    }

    console.log(`[Step 4] Visiting /admin`);
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(3000);
    console.log(`Current URL: ${page.url()}`);
    
    // Wait for the audit-logs tab content to load by clicking on it
    try {
      await page.click('button:has-text("Audit Logs")');
      await page.waitForTimeout(2000);
    } catch(e) {
      console.log('Could not find/click Audit Logs tab', e.message);
    }

    const innerText = await page.evaluate(() => document.body.innerText);
    const hasException = innerText.includes('System Exception');
    
    console.log('\n--- FINAL RESULTS ---');
    console.log(`Final URL: ${page.url()}`);
    console.log(`Assertion 'document.body.innerText does NOT contain \"System Exception\"': ${!hasException}`);
    
    console.log('\n--- ERRORS AND FAILED RESPONSES ---');
    if (errors.length === 0) console.log('No console/page errors captured.');
    else errors.forEach(e => console.log(e));
    
    if (badResponses.length === 0) console.log('No 4xx/5xx responses captured.');
    else badResponses.forEach(r => console.log(r));

  } catch (e) {
    console.error('Test Failed:', e.message);
  } finally {
    await browser.close();
  }
})();
