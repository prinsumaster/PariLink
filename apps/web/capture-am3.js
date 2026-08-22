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

  const routes = [
    { name: 'dashboard', path: '/' },
    { name: 'fleet', path: '/fleet' },
    { name: 'finance', path: '/finance' },
    { name: 'admin', path: '/admin/users' },
    { name: 'tracking', path: '/dispatch' }
  ];

  for (const route of routes) {
    console.log(`Navigating to ${route.name}...`);
    try {
      await page.goto(`http://localhost:3000${route.path}`, { timeout: 10000 });
      await page.waitForTimeout(2000);
      await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/am3_${route.name}.png` });
    } catch (e) {
      console.log(`Failed to capture ${route.name}: ${e.message}`);
    }
  }

  await browser.close();
  console.log('Done AM3 capture.');
})();
