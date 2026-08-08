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
  
  console.log('Navigating to /loads...');
  await page.goto('http://localhost:3000/loads');
  await page.waitForLoadState('networkidle');

  console.log('Clicking New Load button...');
  await page.click('button:has-text("New Load")');
  await page.waitForTimeout(500);

  console.log('Step 1...');
  // select customerId
  const select = await page.$('select[name="customerId"]');
  if (select) {
    // get the first valid option
    const options = await page.$$eval('select[name="customerId"] option', opts => opts.map(o => o.value).filter(v => v !== ''));
    if (options.length > 0) {
      await page.selectOption('select[name="customerId"]', options[0]);
    } else {
      console.log('No customers found in select dropdown');
    }
  }
  await page.fill('input[name="referenceNumber"]', 'LD-TEST-001');
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  console.log('Step 2...');
  await page.fill('input[name="originAddress"]', '123 Origin St');
  await page.fill('input[name="originCity"]', 'Atlanta');
  await page.fill('input[name="originState"]', 'GA');
  
  await page.fill('input[name="destinationAddress"]', '456 Dest Ave');
  await page.fill('input[name="destinationCity"]', 'Dallas');
  await page.fill('input[name="destinationState"]', 'TX');
  
  await page.click('button:has-text("Continue")');
  await page.waitForTimeout(500);

  console.log('Step 3...');
  // datetime-local inputs require YYYY-MM-DDTHH:mm format
  await page.fill('input[name="pickupDate"]', '2026-08-10T10:00');
  await page.fill('input[name="deliveryDate"]', '2026-08-15T15:00');
  await page.fill('input[name="rate"]', '2500');
  
  await page.screenshot({ path: '/tmp/loads_step3.png' });
  
  console.log('Clicking Create Load...');
  await page.click('button:has-text("Create Load")');
  
  console.log('Waiting for response...');
  await page.waitForTimeout(2000);
  console.log('Final URL after submit:', page.url());
  
  const toastMsg = await page.locator('[data-sonner-toast]').textContent().catch(() => null);
  console.log('Toast:', toastMsg);
  
  await page.screenshot({ path: '/tmp/loads_created.png' });
  await browser.close();
})();
