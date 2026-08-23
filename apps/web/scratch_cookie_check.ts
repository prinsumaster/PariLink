import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'Password123!');
  
  await Promise.all([
    page.waitForURL(/dashboard/),
    page.click('button[type="submit"]')
  ]);
  
  const clientCookies = await page.evaluate(() => document.cookie);
  console.log("Client-side document.cookie:", clientCookies || "(empty)");
  console.log("Is access_token present in document.cookie?", clientCookies.includes('access_token'));
  
  await browser.close();
}
main().catch(console.error);
