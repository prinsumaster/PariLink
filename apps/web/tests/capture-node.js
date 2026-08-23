const { chromium } = require('@playwright/test');

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("Capturing Login...");
  await page.goto('http://localhost:3000/login');
  
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/login-frame1.png' });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/login-frame2.png' });
  await page.waitForTimeout(1500);
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/login-frame3.png' });
  
  console.log("Login captured.");
  
  console.log("Capturing Dispatch...");
  // Login first
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**'); // wait for dashboard

  await page.goto('http://localhost:3000/dispatch');
  await page.waitForTimeout(1000);

  // Find REPLAY button and click it
  try {
    await page.click('text=REPLAY', { timeout: 2000 });
  } catch(e) {
    console.log("No REPLAY text found. Trying uppercase or class.");
  }
  
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/dispatch-frame1.png' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/dispatch-frame2.png' });
  await page.waitForTimeout(2000);
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/dispatch-frame3.png' });
  
  console.log("Dispatch captured.");

  await browser.close();
}

run();
