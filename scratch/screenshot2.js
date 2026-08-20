const { chromium } = require('playwright');
const path = require('path');
const { execSync } = require('child_process');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  try {
    console.log('[Phase 1] Login & Normal State');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/dashboard', { timeout: 10000 });
    
    await page.goto('http://localhost:3000/dashboard/admin/audit');
    await page.waitForTimeout(4000);
    const pData = path.join(__dirname, 'admin_data.png');
    await page.screenshot({ path: pData, fullPage: true });
    console.log(`[Phase 1] Data Screenshot saved to: ${pData}`);

    console.log('[Phase 2] Stop API & Error State');
    execSync('docker compose stop api');
    await page.reload();
    console.log('Waiting 20s for API timeout/failure...');
    await page.waitForTimeout(20000); // wait for load and error state to trigger
    
    const pError = path.join(__dirname, 'admin_error_card.png');
    await page.screenshot({ path: pError, fullPage: true });
    console.log(`[Phase 2] Error Screenshot saved to: ${pError}`);

    console.log('[Phase 3] Start API & Recovered State');
    execSync('docker compose start api');
    console.log('Waiting for API to be healthy...');
    await page.waitForTimeout(8000); // Wait enough time for healthy state
    
    await page.reload();
    await page.waitForTimeout(4000);
    const pRecover = path.join(__dirname, 'admin_recovered.png');
    await page.screenshot({ path: pRecover, fullPage: true });
    console.log(`[Phase 3] Recovered Screenshot saved to: ${pRecover}`);

  } catch (e) {
    console.error('Test Failed:', e.message);
  } finally {
    await browser.close();
  }
})();
