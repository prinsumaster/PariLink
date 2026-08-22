const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  await context.addCookies([
    { name: 'parilink_session', value: 'dummy_token', domain: 'localhost', path: '/' }
  ]);
  
  await context.addInitScript(() => {
    window.localStorage.setItem('auth-store', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: { id: '1', email: 'admin@parilink.com', role: 'ADMIN', onboardingCompleted: true },
        token: 'dummy_token'
      },
      version: 0
    }));
  });

  await page.goto('http://localhost:3000/dispatch');
  await page.waitForTimeout(4000);
  
  const content = await page.content();
  fs.writeFileSync('dom-dump.html', content);

  await browser.close();
})();
