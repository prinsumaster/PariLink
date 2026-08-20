const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.route(/.*\/dashboard\/alerts/, async route => {
    console.log('Intercepting and aborting request:', route.request().url());
    await route.abort('failed');
  });

  console.log('Logging in...');
  await page.goto('http://localhost:3000/auth/login');
  await page.waitForSelector('input[name="email"]', { timeout: 15000 });
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard**', { timeout: 15000 });
  console.log('Login successful. Now at:', page.url());

  await page.waitForTimeout(5000);
  
  const hasException = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('System Exception visible?', hasException);
  
  const hasLocalizedError = await page.evaluate(() => document.body.innerText.includes('Failed to load alerts') || document.body.innerText.includes('Failed to load'));
  console.log('Localized Error visible?', hasLocalizedError);
  
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/dashboard_killed_api.png', fullPage: true });

  await browser.close();
  console.log('Done.');
})();
