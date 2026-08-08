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
  
  console.log('Navigating to /drivers/new...');
  await page.goto('http://localhost:3000/drivers/new');
  await page.waitForLoadState('networkidle');

  console.log('Filling Driver form...');
  await page.fill('input[name="firstName"]', 'John');
  await page.fill('input[name="lastName"]', 'Driver');
  await page.fill('input[name="phone"]', '+15555551234');
  await page.fill('input[name="email"]', 'johndriver@test.com');
  await page.fill('input[name="licenseNumber"]', 'CDL-TEST-001');
  await page.fill('input[name="licenseState"]', 'TX');
  
  await page.screenshot({ path: '/tmp/drivers_filled.png' });
  
  console.log('Clicking Save Driver...');
  await page.click('button:has-text("Save Driver")');
  
  console.log('Waiting for response...');
  await page.waitForTimeout(2000);
  console.log('Final URL after submit:', page.url());
  
  const toastMsg = await page.locator('[data-sonner-toast]').textContent().catch(() => null);
  console.log('Toast:', toastMsg);
  
  await page.screenshot({ path: '/tmp/drivers_created.png' });
  await browser.close();
})();
