import { chromium } from 'playwright';
async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  // Login
  await page.goto('http://localhost:3001/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'Admin@123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('http://localhost:3001');
  
  // Go to billing
  await page.click('text=Billing');
  await page.waitForURL('http://localhost:3001/billing');
  
  // Reload
  await page.reload();
  await page.waitForTimeout(2000);
  
  console.log("Current URL after reload:", page.url());
  await browser.close();
}
run();
