import { chromium } from 'playwright';

(async () => {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });

  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  console.log('Navigating to /vendors...');
  await page.goto('http://localhost:3000/vendors');
  await page.waitForLoadState('networkidle');

  console.log('Clicking Add Vendor button...');
  await page.click('text=Add Vendor');
  await page.waitForLoadState('networkidle');

  console.log('Filling Vendor form...');
  await page.fill('input[name="name"]', 'Phase 3 Vendor');
  await page.fill('input[name="code"]', 'V-003');
  await page.fill('input[name="email"]', 'vendor3@example.com');
  await page.fill('input[name="phone"]', '+19999999999');
  await page.fill('input[name="billingAddress"]', '123 Vendor Ave');
  await page.fill('input[name="taxId"]', '99-9999999');
  
  await page.screenshot({ path: '/tmp/vendors_filled.png' });
  
  console.log('Clicking Save Vendor...');
  await page.click('button:has-text("Save Vendor")');
  
  console.log('Waiting for response...');
  await page.waitForTimeout(2000);
  console.log('Final URL after submit:', page.url());
  
  const toastMsg = await page.locator('[data-sonner-toast]').textContent().catch(() => null);
  console.log('Toast:', toastMsg);
  
  await page.screenshot({ path: '/tmp/vendors_created.png' });
  await browser.close();
})();
