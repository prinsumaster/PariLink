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
  await page.goto('http://localhost:3000/customers/new');
  await page.waitForLoadState('networkidle');

  console.log('Filling form...');
  await page.fill('input[name="companyName"]', 'Phase 3 Audit Corp');
  await page.fill('input[name="primaryEmail"]', 'audit3@example.com');
  await page.fill('input[name="primaryPhone"]', '+15555555555');
  
  await page.fill('input[name="address.street"]', '123 Audit Way');
  await page.fill('input[name="address.city"]', 'Audittown');
  await page.fill('input[name="address.state"]', 'NY');
  await page.fill('input[name="address.postalCode"]', '10001');
  await page.fill('input[name="address.country"]', 'USA');
  
  await page.fill('input[name="billing.creditLimit"]', '10000');
  
  await page.fill('input[name="contacts.0.name"]', 'John Audit');
  await page.fill('input[name="contacts.0.role"]', 'Manager');
  await page.fill('input[name="contacts.0.email"]', 'john@audit3.com');
  await page.fill('input[name="contacts.0.phone"]', '+15555555555');
  
  await page.screenshot({ path: '/tmp/customers_filled.png' });
  console.log('Clicking save...');
  await page.click('button[type="submit"]');
  
  console.log('Waiting for response...');
  // Wait for redirect to /customers/[id]
  await page.waitForTimeout(3000);
  console.log('Final URL after submit:', page.url());
  
  // check if toast is visible
  const toastMsg = await page.locator('[data-sonner-toast]').textContent().catch(() => null);
  console.log('Toast:', toastMsg);
  
  await page.screenshot({ path: '/tmp/customers_saved.png' });
  await browser.close();
})();
