const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  console.log('Logging in with real credentials...');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  console.log('Waiting for navigation...');
  try {
    await page.waitForURL('**/dispatch', { timeout: 10000 });
  } catch (e) {
    console.log('Failed to navigate to dispatch. Current URL:', page.url());
    console.log('Taking screenshot of login page...');
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/an0_login_failure.png' });
    // Try navigating to dispatch manually if it ended up somewhere else
    if (page.url() !== 'http://localhost:3000/login') {
      await page.goto('http://localhost:3000/dispatch');
    } else {
      throw e;
    }
  }
  await page.waitForTimeout(4000); // Wait for map and locations to load

  console.log('Capturing REPLAY MODE screenshot...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/an0_dispatch_replay.png' });

  const marker = page.locator('[data-vehicle-id="v1"]');
  
  console.log('Measuring bounding boxes at t=0, t=2s, t=4s...');
  
  const box1 = await marker.boundingBox();
  console.log('t=0:', box1 ? { x: box1.x, y: box1.y } : 'Not found');
  
  await page.waitForTimeout(2000);
  const box2 = await marker.boundingBox();
  console.log('t=2s:', box2 ? { x: box2.x, y: box2.y } : 'Not found');
  
  await page.waitForTimeout(2000);
  const box3 = await marker.boundingBox();
  console.log('t=4s:', box3 ? { x: box3.x, y: box3.y } : 'Not found');

  await browser.close();
  console.log('Done.');
})();
