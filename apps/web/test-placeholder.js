const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.goto('http://localhost:3000/automation');
  await page.waitForTimeout(3000);
  
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/placeholder_view.png' });
  
  await browser.close();
})();
