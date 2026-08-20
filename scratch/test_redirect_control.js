const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  try {
    // Test A: Positive Control
    console.log('--- Test A: Positive Control ---');
    const context1 = await browser.newContext();
    const page1 = await context1.newPage();
    const response1 = await page1.goto('http://localhost:3000/login?callbackUrl=/dashboard/admin/audit');
    console.log(`Visited /login with valid callbackUrl, landed on: ${page1.url()}`);
    
    await page1.fill('input[type="email"]', 'admin@parilink.com');
    await page1.fill('input[type="password"]', 'password123');
    await page1.click('button[type="submit"]');
    await page1.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 10000 });
    console.log(`After login, final URL: ${page1.url()}`);
    await context1.close();

    // Test B: Negative Control (Absolute URL)
    console.log('\n--- Test B: Negative Control (Absolute URL) ---');
    const context2 = await browser.newContext();
    const page2 = await context2.newPage();
    await page2.goto('http://localhost:3000/login?callbackUrl=https://example.com');
    console.log(`Visited /login with external callbackUrl, landed on: ${page2.url()}`);
    
    await page2.fill('input[type="email"]', 'admin@parilink.com');
    await page2.fill('input[type="password"]', 'password123');
    await page2.click('button[type="submit"]');
    await page2.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 10000 });
    console.log(`After login, final URL: ${page2.url()}`);
    await context2.close();

  } catch (e) {
    console.error('Test Failed:', e.message);
  } finally {
    await browser.close();
  }
})();
