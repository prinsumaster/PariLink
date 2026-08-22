const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Block any requests to tile servers
  await page.route('**/*basemaps*', route => {
    console.log('Blocked request to basemaps:', route.request().url());
    route.abort();
  });

  console.log('Navigating to login with tiles blocked...');
  await page.goto('http://localhost:3000/login');
  
  // Wait for it to finish (2500ms total duration)
  await page.waitForTimeout(3000);
  
  console.log('Capturing end frame...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/am0_login_blocked_tiles.png' });

  await browser.close();
  console.log('Done AM0 capture.');
})();
