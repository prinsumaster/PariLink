const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const errors = [];
  page.on('pageerror', e => {
    errors.push({ url: page.url(), error: e.message });
  });

  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 10000 });
  await page.waitForTimeout(2000);

  const routes = [
    '/operations/loads',
    '/operations/trips',
    '/operations/documents',
    '/finance/invoices',
    '/finance/expenses',
    '/crm/customers',
    '/crm/vendors',
    '/fleet/vehicles',
    '/fleet/maintenance',
    '/workforce/drivers',
    '/workforce/payroll',
    '/reports',
    '/ai-copilot',
    '/settings',
    '/integrations'
  ];

  console.log('| Route | Renders | Issue |');
  console.log('|---|---|---|');

  for (const route of routes) {
    try {
      await page.goto(`http://localhost:3000${route}`);
      await page.waitForTimeout(2500); // Wait for potential crashes/loads

      const routeErrors = errors.filter(e => e.url.includes(route));
      
      const screenshotName = route.replace(/\//g, '_').substring(1);
      const screenshotPath = `/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/scratch/an2_${screenshotName}.png`;
      await page.screenshot({ path: screenshotPath });

      // check if it's a 404 or visible error
      const is404 = await page.locator('text="404"').count() > 0 || await page.locator('text="Not Found"').count() > 0;
      const isError = await page.locator('text="Application Error"').count() > 0 || await page.locator('text="Something went wrong"').count() > 0;
      
      if (routeErrors.length > 0) {
        console.log(`| \`${route}\` | ❌ No | JS Error: ${routeErrors[0].error.substring(0, 50)} |`);
      } else if (is404) {
        console.log(`| \`${route}\` | ❌ No | 404 Not Found (Route missing) |`);
      } else if (isError) {
        console.log(`| \`${route}\` | ❌ No | Error Boundary triggered |`);
      } else {
        console.log(`| \`${route}\` | ✅ Yes | None |`);
      }
    } catch (e) {
      console.log(`| \`${route}\` | ❌ No | Failed to navigate: ${e.message} |`);
    }
  }

  await browser.close();
  console.log('Done AN2 audit.');
})();
