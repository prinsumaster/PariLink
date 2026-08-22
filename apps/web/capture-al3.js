const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  // Wait a tiny bit for the page to render (progress = 0)
  await page.waitForTimeout(500);
  console.log('Capturing start frame...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/al3_login_frame1.png' });

  // Wait for the route to draw partially
  await page.waitForTimeout(1000);
  console.log('Capturing mid frame...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/al3_login_frame2.png' });

  // Wait for it to finish (2500ms total duration)
  await page.waitForTimeout(1500);
  console.log('Capturing end frame...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/al3_login_frame3.png' });

  await browser.close();
  console.log('Done.');
})();
