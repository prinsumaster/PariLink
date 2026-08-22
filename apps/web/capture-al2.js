const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  // Handle unhandled errors
  page.on('pageerror', err => console.log('Page error: ' + err.message));
  page.on('console', msg => console.log('Browser log: ' + msg.text()));

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
  // Wait for the map to load
  await page.waitForTimeout(4000);
  
  console.log('Capturing base AL2 screen...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/al2_dispatch_base.png' });

  console.log('Clicking a marker...');
  try {
    await page.click('.maplibregl-marker', { timeout: 3000 });
  } catch (e) {
    console.log('Could not find marker by class, clicking center...');
    await page.mouse.click(720, 450);
  }
  
  await page.waitForTimeout(2000); // Wait for slide in animation

  console.log('Capturing panel AL2 screen...');
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/al2_dispatch_panel.png' });

  await browser.close();
  console.log('Done.');
})();
