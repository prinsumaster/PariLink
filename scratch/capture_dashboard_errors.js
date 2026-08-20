const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('PAGE ERROR:', msg.text());
  });
  page.on('response', response => {
    if (response.status() >= 400) {
      console.log('API ERROR:', response.status(), response.url());
    }
  });

  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForTimeout(2000);
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(3000);
  
  const exceptionText = await page.evaluate(() => document.body.innerText.includes('System Exception'));
  console.log('System Exception visible:', exceptionText);
  await page.screenshot({ path: 'scratch/dashboard_debug.png' });
  
  await browser.close();
})();
