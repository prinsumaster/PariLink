const { chromium } = require('playwright');

const ROUTES = [
  '/dashboard',
  '/dispatch',
  '/fleet',
  '/loads',
  '/trips',
  '/finance',
  '/finance/invoices',
  '/drivers',
  '/customers',
  '/admin/users',
  '/reports',
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  // Login first
  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1000);
  await page.fill('input[name="email"]', 'admin@vanguard.com');
  await page.fill('input[name="password"]', 'password123');
  
  await Promise.all([
    page.waitForNavigation({ waitUntil: 'networkidle' }),
    page.click('button[type="submit"]')
  ]);
  
  await page.goto('http://localhost:3000/dashboard');
  await page.waitForTimeout(2000);
  
  console.log('| Route | Body Length | Table Rows | Error Boundary? |');
  console.log('|---|---|---|---|');

  for (const route of ROUTES) {
    let boundaryError = false;
    
    const handleConsole = (msg) => {
      if (msg.type() === 'error' && msg.text().includes('[BOUNDARY]')) {
        boundaryError = true;
      }
    };
    
    page.on('console', handleConsole);

    await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(3000); // Wait for API calls and render
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasBoundaryAttr = await page.evaluate(() => !!document.querySelector('[data-error-boundary="true"]'));
    const boundary = (boundaryError || hasBoundaryAttr) ? 'YES (FAIL)' : 'No';
    
    // Take screenshot
    const safeRoute = route === '/' ? 'home' : route.replace(/[^a-zA-Z0-9]/g, '_');
    const screenshotPath = `/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/preview_${safeRoute}.png`;
    await page.screenshot({ path: screenshotPath, fullPage: true });

    // Try to count items roughly
    const itemCount = await page.evaluate(() => {
      if (window.location.pathname === '/dispatch') {
        return document.querySelectorAll('.leaflet-marker-icon, .dispatch-load-card').length;
      }
      if (window.location.pathname === '/loads') {
        return document.querySelectorAll('a[href^="/loads/LD-"]').length;
      }
      return document.querySelectorAll('tbody tr').length;
    });

    console.log(`| \`${route}\` | ${bodyText.length} | ${itemCount} | ${boundary} |`);
    
    page.removeListener('console', handleConsole);
  }

  // Motion moments: Login route-draw animation
  // (We skip this via script since login is already done, I'll do it separately or mention it)
  // Motion moments: Dispatch marker moving
  // I will capture this via another script.

  await browser.close();
})();
