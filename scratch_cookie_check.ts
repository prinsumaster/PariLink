import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  
  await page.waitForURL(/.*dashboard.*/, { timeout: 30000 });
  
  const docCookie = await page.evaluate(() => document.cookie);
  console.log('document.cookie:', docCookie);
  
  const state = await context.storageState();
  const accToken = state.cookies.find(c => c.name === 'access_token');
  console.log('access_token in Playwright context exists?', !!accToken);
  console.log('access_token httpOnly?', accToken?.httpOnly);
  
  await browser.close();
})();
