const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/auth/login');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await Promise.all([
    page.waitForNavigation(),
    page.click('button[type="submit"]')
  ]);
  
  await page.goto('http://localhost:3000/documents', { waitUntil: 'networkidle' });
  
  // Wait for the upload button and click it
  await page.waitForSelector('button:has-text("Upload")');
  await page.click('button:has-text("Upload")');
  
  // Set the file input (we use any file we have, like scratch/dashboard_debug.png)
  await page.setInputFiles('input[type="file"]', 'scratch/dashboard_debug.png');
  
  // Fill in any required fields like category if present
  // the file uploader might just auto upload or require a submit button
  // We'll see if there is an Upload Document button
  await page.waitForTimeout(1000);
  const uploadBtn = await page.$('button:has-text("Upload Document")');
  if (uploadBtn) {
    await uploadBtn.click();
  }
  
  await page.waitForTimeout(2000);
  await page.screenshot({ path: 'scratch/upload_debug.png' });
  
  await browser.close();
})();
