const { chromium, devices } = require('playwright');
const iPhone = devices['iPhone 12'];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    ...iPhone,
  });
  
  // 1. Login
  const page1 = await context.newPage();
  await page1.goto('http://localhost:3000/login');
  await page1.waitForTimeout(2000);
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/mobile_login.png', fullPage: true });
  
  await page1.fill('input[name="email"]', 'admin@parilink.com');
  await page1.fill('input[name="password"]', 'password123');
  await page1.click('button[type="submit"]');
  await page1.waitForURL('**/dashboard', { timeout: 10000 });
  
  // 2. Dispatch
  await page1.goto('http://localhost:3000/dispatch');
  await page1.waitForTimeout(4000);
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/mobile_dispatch.png' });
  
  // 3. Fleet
  await page1.goto('http://localhost:3000/fleet');
  await page1.waitForTimeout(3000);
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/mobile_fleet.png', fullPage: true });
  
  // 4. Finance
  await page1.goto('http://localhost:3000/finance');
  await page1.waitForTimeout(3000);
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/mobile_finance.png', fullPage: true });

  await browser.close();
})();
