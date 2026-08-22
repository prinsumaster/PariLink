const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log('Setting auth cookie and local storage...');
  await context.addCookies([
    { name: 'parilink_session', value: 'dummy_token', domain: 'localhost', path: '/' },
    { name: 'logged_in', value: 'true', domain: 'localhost', path: '/' }
  ]);
  
  await context.addInitScript(() => {
    window.localStorage.setItem('parilink-auth', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: { id: '1', email: 'admin@parilink.com', role: 'ADMIN', onboardingCompleted: true },
        token: 'dummy_token'
      },
      version: 0
    }));
  });

  console.log('Navigating to dispatch...');
  await page.goto('http://localhost:3000/dispatch');
  
  await page.waitForTimeout(1000); // Wait for map load

  console.log('Capturing frame 1...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/am1_dispatch_frame1.png' });

  await page.waitForTimeout(2000);
  console.log('Capturing frame 2...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/am1_dispatch_frame2.png' });

  await page.waitForTimeout(2000);
  console.log('Capturing frame 3...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/am1_dispatch_frame3.png' });

  console.log('Clicking a marker to show selection...');
  try {
    await page.click('.maplibregl-marker', { timeout: 3000 });
  } catch (e) {
    console.log('Could not find marker, clicking center...');
    await page.mouse.click(720, 450);
  }
  
  await page.waitForTimeout(2000); // Wait for slide in animation
  console.log('Capturing selection frame...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/am1_dispatch_selection.png' });

  await browser.close();
  console.log('Done AM1 capture.');
})();
