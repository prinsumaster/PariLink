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
  
  console.log('Navigating to /fleet/new...');
  await page.goto('http://localhost:3000/fleet/new');
  await page.waitForLoadState('networkidle');

  console.log('Filling Vehicle form...');
  await page.fill('input[name="registrationNumber"]', 'TX-789-ABC');
  await page.fill('input[name="make"]', 'Volvo');
  await page.fill('input[name="model"]', 'VNL 860');
  
  // default year is current year, we can leave it
  await page.fill('input[name="capacity"]', '40000');
  await page.fill('input[name="axles"]', '5');
  await page.fill('input[name="odometer"]', '125000');
  
  await page.screenshot({ path: '/tmp/vehicles_filled.png' });
  
  console.log('Clicking Save Vehicle...');
  await page.click('button:has-text("Save Vehicle")');
  
  console.log('Waiting for response...');
  await page.waitForTimeout(2000);
  console.log('Final URL after submit:', page.url());
  
  const toastMsg = await page.locator('[data-sonner-toast]').textContent().catch(() => null);
  console.log('Toast:', toastMsg);
  
  await page.screenshot({ path: '/tmp/vehicles_created.png' });
  await browser.close();
})();
