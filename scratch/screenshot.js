const { chromium } = require('playwright');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    const { execSync } = require('child_process');
    console.log('[Step 1] Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    console.log('[Step 2] Stopping API container...');
    execSync('docker compose stop api');
    
    console.log('[Step 3] Loading /admin with API stopped...');
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(4000);
    const p1 = path.join(__dirname, 'admin_error_card.png');
    await page.screenshot({ path: p1, fullPage: true });
    console.log(`Screenshot saved to: ${p1}`);

    console.log('[Step 4] Starting API container...');
    execSync('docker compose start api');
    await page.waitForTimeout(5000); // wait for api to be ready

    console.log('[Step 5] Loading /admin with API running...');
    await page.goto('http://localhost:3000/admin');
    await page.waitForTimeout(4000);
    const p2 = path.join(__dirname, 'admin_data.png');
    await page.screenshot({ path: p2, fullPage: true });
    console.log(`Screenshot saved to: ${p2}`);
  } catch (e) {
    console.error('Test Failed:', e.message);
  } finally {
    await browser.close();
  }
})();
