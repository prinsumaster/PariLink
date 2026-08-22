const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  page.on('pageerror', e => console.log('PAGEERROR:', e.message));

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  console.log('Logging in with real credentials...');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  console.log('Waiting for navigation...');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(3000);

  console.log('Asserting real session...');
  const token = await page.evaluate(() => {
    const auth = JSON.parse(localStorage.getItem('parilink-auth') || '{}');
    return auth?.state?.token;
  });
  
  if (!token) {
    throw new Error('No token found in localStorage!');
  }
  
  const me = await page.request.get('http://localhost:8080/api/v1/auth/me', {
    headers: { Authorization: `Bearer ${token}` }
  });
  
  if (me.status() !== 200) {
    throw new Error(`API auth failed with status: ${me.status()}`);
  }
  console.log('✅ Real session established (200 OK)');

  const routes = [
    { url: '/dashboard', name: 'dashboard' },
    { url: '/fleet', name: 'fleet' },
    { url: '/finance', name: 'finance' },
    { url: '/admin/users', name: 'admin_users' },
    { url: '/dispatch', name: 'dispatch' }
  ];

  for (const route of routes) {
    console.log(`Navigating to ${route.url}...`);
    await page.goto(`http://localhost:3000${route.url}`);
    await page.waitForTimeout(3000); // Wait for network requests
    
    const screenshotPath = `/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/an1_${route.name}.png`;
    await page.screenshot({ path: screenshotPath });
    console.log(`Captured ${route.name}`);
  }

  await browser.close();
  console.log('Done AN1 captures.');
})();
