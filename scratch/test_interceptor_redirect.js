const { chromium } = require('playwright-core');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Visit login to get session
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'P@r1L1nk_Admin_2024');
  await page.click('button:has-text("Sign in")');
  await page.waitForURL('**/dashboard');

  // Navigate to an internal page
  await page.goto('http://localhost:3000/dashboard/fleet/drivers');

  // Intercept all API calls and force 401
  await context.route('**/api/v1/**', route => route.fulfill({ status: 401, contentType: 'application/json', body: '{"statusCode":401,"message":"Unauthorized"}' }));
  
  // Click a link that fetches data (e.g., invoices)
  await page.click('a[href="/dashboard/finance/invoices"]');
  
  // Wait for the redirect to login page
  await page.waitForURL('**/login*');
  
  console.log(`Final URL after 401 Interceptor: ${page.url()}`);
  
  await browser.close();
})();
