// E3 real deterministic proof
// PASS criteria (both required from one real run):
//   1. A URL containing callbackUrl=%2Fdashboard%2Fadmin%2Faudit
//   2. Final URL /dashboard/admin/audit after re-login

const { chromium } = require('playwright-core');

(async () => {
  const navLog = [];
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('framenavigated', frame => {
    if (frame === page.mainFrame()) {
      const url = frame.url();
      navLog.push(url);
      console.log('NAV:', url);
    }
  });

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  // Step 1: Login
  console.log('--- Step 1: Login ---');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**', { timeout: 30000 });
  console.log('--- Login succeeded ---');

  // Step 2: Install route interceptor BEFORE navigating to audit page
  // Setup request logging
  page.on('request', request => {
    console.log(`REQ: ${request.method()} ${request.url()}`);
  });

  console.log('--- Step 2: Installing 401 interceptor on API routes ---');
  await page.route('**/api/v1/admin/audit/**', async (route) => {
    console.log(`[INTERCEPTED] Returning 401 for: ${route.request().url()}`);
    await route.fulfill({
      status: 401,
      contentType: 'application/json',
      body: JSON.stringify({ message: 'Unauthorized (Testing Interceptor)' }),
    });
  });

  // Step 3: Navigating to /dashboard/admin/audit
  console.log('--- Step 3: Navigating to /dashboard/admin/audit ---');
  // Clear Workspace tabs so that children (AuditLogsPage) is rendered instead of active tab
  await page.evaluate(() => {
    localStorage.removeItem('parilink-workspace-kernel');
  });
  await page.goto('http://localhost:3000/dashboard/admin/audit');

  // Observe for up to 15 seconds
  await page.waitForTimeout(5000);
  const html = await page.content();
  require('fs').writeFileSync('scratch/e3-proof-html.html', html);
  console.log('--- PAGE HTML SAVED TO scratch/e3-proof-html.html ---');
  await page.waitForTimeout(10000);

  const currentUrl = page.url();
  console.log('--- Current URL after 15s:', currentUrl, '---');

  const hasCallbackUrl = navLog.some(u => u.includes('callbackUrl=%2Fdashboard%2Fadmin%2Faudit'));
  console.log('--- hasCallbackUrl:', hasCallbackUrl, '---');

  if (!hasCallbackUrl) {
    console.log('RESULT: BLOCKED — no callbackUrl in any nav URL');
    console.log('All nav URLs:', JSON.stringify(navLog, null, 2));
    await browser.close();
    process.exit(1);
  }

  // Step 5: Re-login
  console.log('--- Step 5: Re-logging in ---');
  try {
    await page.waitForSelector('input[name="email"]', { timeout: 15000 });
    await page.fill('input[name="email"]', 'admin@parilink.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard/admin/audit**', { timeout: 30000 });
    console.log('--- FINAL URL:', page.url(), '---');
    console.log('RESULT: PASS');
  } catch (e) {
    console.log('RESULT: BLOCKED —', e.message);
    console.log('All nav URLs:', JSON.stringify(navLog, null, 2));
  }

  await browser.close();
})().catch(e => {
  console.error('FATAL:', e.message);
  process.exit(1);
});
