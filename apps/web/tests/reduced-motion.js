const { chromium } = require('@playwright/test');

async function run() {
  const browser = await chromium.launch({
    args: ['--force-prefers-reduced-motion']
  });
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login cleanly
  await page.goto('http://localhost:3000/login');
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  } catch(e) {}
  await page.waitForURL('**/dashboard**');

  // Go to Invoice to see CountUp instantly render
  await page.goto('http://localhost:3000/finance');
  await page.waitForSelector('tbody tr', { state: 'visible' });
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/reduced-motion-finance.png' });

  // Go to trips to see dispatch instantly render
  await page.goto('http://localhost:3000/trips');
  await page.waitForSelector('tbody tr', { state: 'visible' });
  await page.click('tbody tr:first-child');
  await page.waitForSelector('text=Dispatch Trip');
  await page.click('text=Dispatch Trip');
  // Wait a tiny bit (not full animation time)
  await page.waitForTimeout(10);
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/reduced-motion-dispatch-instant.png' });
  
  await browser.close();
}

run().catch(console.error);
