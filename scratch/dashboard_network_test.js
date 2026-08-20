const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let apiErrors = [];
  page.on('response', response => {
    if (response.url().includes('/api/') && response.status() >= 400) {
      apiErrors.push(`${response.status()} ${response.url()}`);
    }
  });

  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);
  
  await page.waitForTimeout(2000);
  console.log("Navigating to dashboard...");
  await page.goto('http://localhost:3000/dashboard', { waitUntil: 'networkidle' });
  
  console.log("Errors captured:", apiErrors);
  await browser.close();
})();
