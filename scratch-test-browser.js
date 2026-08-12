const { chromium } = require('playwright');

(async () => {
  console.log('Starting Playwright Full Browser War Test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  let errors = 0;
  const ignoredUrls = [
    '_next/static/chunks/', 
    'favicon',
  ];

  page.on('request', request => {
    request.startTime = Date.now();
  });

  page.on('response', response => {
    const request = response.request();
    const duration = Date.now() - request.startTime;
    const status = response.status();
    const url = response.url();
    
    if (url.includes('localhost')) {
      if (duration > 500 && url.includes('/api/')) {
        console.log(`[SLOW REQUEST] ${duration}ms ${url}`);
      }
      
      if (!response.ok() && status >= 400) {
        if (!ignoredUrls.some(ignored => url.includes(ignored))) {
          console.log(`[NETWORK ERROR] ${status} ${url}`);
          errors++;
        }
      }
    }
  });

  page.on('console', msg => {
    if (msg.type() === 'error') {
      if (!ignoredUrls.some(ignored => msg.text().includes(ignored))) {
        console.log(`[CONSOLE ERROR] ${msg.text()}`);
        errors++;
      }
    }
  });

  page.on('pageerror', exception => {
    console.log(`[PAGE CRASH] ${exception}`);
    errors++;
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3001/login');
  
  console.log('Logging in...');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForTimeout(4000);
  
  // A comprehensive list of routes to test based on Phase 4 requirements
  const routes = [
    '/dashboard',
    '/customers',
    '/drivers',
    '/vehicles/permits',
    '/fleet',
    '/trips',
    '/loads',
    '/orders',
    '/vendors',
    '/warehouse',
    '/wms',
    '/finance/invoices',
    '/finance/settlements',
    '/finance/payroll',
    '/reports',
    '/analytics/command-center',
    '/operations/incidents',
    '/fleet/maintenance',
    '/vehicles/fuel/transactions',
    '/finance/fastag',
    '/admin/users',
    '/admin/roles',
    '/settings',
    '/integrations',
    '/notifications',
    '/workflows',
    '/ai/copilot',
    '/admin/marketplace',
    '/chat',
    '/admin'
  ];

  for (const route of routes) {
      console.log(`Navigating to ${route}...`);
      await page.goto(`http://localhost:3001${route}`);
      // Wait for network idle or timeout to catch all fetches
      await page.waitForLoadState('networkidle', { timeout: 3000 }).catch(() => {});
      await page.waitForTimeout(500); // Small buffer for React Query renders
  }

  // Phase 15: Memory / Leak Audit navigation
  console.log('Performing memory leak repeated navigation cycle...');
  for(let i=0; i<3; i++) {
    console.log(`Cycle ${i+1}...`);
    await page.goto('http://localhost:3001/dashboard');
    await page.waitForTimeout(500);
    await page.goto('http://localhost:3001/customers');
    await page.waitForTimeout(500);
    await page.goto('http://localhost:3001/drivers');
    await page.waitForTimeout(500);
    await page.goto('http://localhost:3001/trips');
    await page.waitForTimeout(500);
  }
  await page.goto('http://localhost:3001/dashboard');
  await page.waitForTimeout(1000);

  await browser.close();
  
  if (errors > 0) {
    console.log(`\nTEST FAILED WITH ${errors} ERRORS`);
    process.exit(1);
  } else {
    console.log('\nTEST PASSED ZERO ERRORS');
    process.exit(0);
  }
})();
