const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  // Fill in login form
  console.log('Logging in...');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for dashboard to load
  await page.waitForURL('**/dashboard**');
  console.log('On dashboard, taking screenshot...');
  // Wait a bit for data to load
  await page.waitForTimeout(3000);
  await page.screenshot({ path: 'demo-screenshots/dashboard.png', fullPage: true });

  // Navigate to Customers
  console.log('Navigating to Customers...');
  await page.goto('http://localhost:3000/customers');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/customers.png', fullPage: true });

  // Navigate to Fleet/Drivers
  console.log('Navigating to Drivers...');
  await page.goto('http://localhost:3000/fleet/drivers');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/drivers.png', fullPage: true });

  // Navigate to Fleet/Vehicles
  console.log('Navigating to Vehicles...');
  await page.goto('http://localhost:3000/fleet/vehicles');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/vehicles.png', fullPage: true });

  // Navigate to Trips
  console.log('Navigating to Trips...');
  await page.goto('http://localhost:3000/trips');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/trips.png', fullPage: true });

  // Navigate to Invoices
  console.log('Navigating to Invoices...');
  await page.goto('http://localhost:3000/finance/invoices');
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'demo-screenshots/invoices.png', fullPage: true });

  await browser.close();
  console.log('Done capturing screenshots.');
})();
