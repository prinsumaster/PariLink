import { chromium } from 'playwright';
import * as fs from 'fs';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:8080';

const failures: Array<{ route: string, kind: string, message: string }> = [];

async function getAuthToken() {
  const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  const data = await loginRes.json();
  return data.access_token;
}

async function fetchIds(token: string, endpoint: string) {
  try {
    const res = await fetch(`${API_URL}/api/v1/${endpoint}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const data = await res.json();
    return (data.data || data).slice(0, 3).map((item: any) => item.id);
  } catch (e) {
    console.error(`Failed fetching IDs from ${endpoint}`, e);
    return [];
  }
}

async function runCrawler() {
  console.log('Starting crawler...');
  const token = await getAuthToken();
  if (!token) throw new Error('Could not get auth token for crawler.');

  const [loads, trips, invoices, customers, vehicles, drivers, warehouses, orders] = await Promise.all([
    fetchIds(token, 'loads'),
    fetchIds(token, 'trips'),
    fetchIds(token, 'invoices'),
    fetchIds(token, 'customers'),
    fetchIds(token, 'vehicles'),
    fetchIds(token, 'drivers'),
    fetchIds(token, 'warehouses'),
    fetchIds(token, 'orders'),
  ]);

  const staticRoutes = [
    '/dashboard', '/customers', '/fleet', '/drivers', '/loads', '/trips', '/vendors',
    '/billing', '/analytics/command-center', '/finance', '/finance/bank-statements',
    '/finance/payroll', '/wms', '/orders', '/reports', '/notifications', '/operations'
  ];

  const routesToCrawl: string[] = [...staticRoutes];
  loads.forEach(id => routesToCrawl.push(`/loads/${id}`));
  trips.forEach(id => routesToCrawl.push(`/trips/${id}`));
  invoices.forEach(id => routesToCrawl.push(`/billing/${id}`));
  customers.forEach(id => routesToCrawl.push(`/customers/${id}`));
  vehicles.forEach(id => routesToCrawl.push(`/fleet/${id}`));
  drivers.forEach(id => routesToCrawl.push(`/drivers/${id}`));
  warehouses.forEach(id => routesToCrawl.push(`/wms/${id}`));
  orders.forEach(id => routesToCrawl.push(`/orders/${id}`));

  console.log(`Prepared ${routesToCrawl.length} routes to crawl.`);

  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Login
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  for (const route of routesToCrawl) {
    let routeFailures = 0;
    
    // Attach listeners
    const pageErrorFn = (err: any) => {
      failures.push({ route, kind: 'pageerror', message: err.message || err.toString() });
      routeFailures++;
    };
    const consoleFn = (msg: any) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('Unhandled Runtime Error') || text.includes('ErrorBoundary') || text.includes('MenuGroupContext')) {
          failures.push({ route, kind: 'console-error', message: text });
          routeFailures++;
        }
      }
    };
    const responseFn = (res: any) => {
      if (res.status() >= 500 && res.url().includes('/api/')) {
        failures.push({ route, kind: 'api-500', message: `${res.status()} on ${res.url()}` });
        routeFailures++;
      }
    };

    page.on('pageerror', pageErrorFn);
    page.on('console', consoleFn);
    page.on('response', responseFn);

    try {
      const response = await page.goto(`${BASE_URL}${route}`, { waitUntil: 'domcontentloaded' });
      if (response && response.status() >= 400 && response.status() !== 404) {
         failures.push({ route, kind: 'http-error', message: `Returned ${response.status()}` });
         routeFailures++;
      }
      
      await page.waitForTimeout(800); // Wait for rendering

      // Text scan for fatal strings
      const bodyText = await page.evaluate(() => document.body.innerText);
      const textMatches = ['Dashboard View Error', 'Permission Denied', 'Invalid Date'];
      for (const match of textMatches) {
        if (bodyText.includes(match)) {
          failures.push({ route, kind: 'text-match', message: match });
          routeFailures++;
        }
      }

    } catch (e: any) {
      failures.push({ route, kind: 'navigation-error', message: e.message });
      routeFailures++;
    } finally {
      page.off('pageerror', pageErrorFn);
      page.off('console', consoleFn);
      page.off('response', responseFn);
    }
    
    if (routeFailures === 0) {
      console.log(`[PASS] ${route}`);
    } else {
      const routeFails = failures.filter(f => f.route === route);
      console.log(`[FAIL] ${route} (${routeFailures} errors: ${routeFails.map(f => `${f.kind}: ${f.message}`).join(', ')})`);
    }
  }

  await browser.close();

  fs.writeFileSync('crawl-report.json', JSON.stringify(failures, null, 2));
  console.log(`\nCrawl finished. Found ${failures.length} total failures.`);
  if (failures.length > 0) {
    console.error('Failures detail:', JSON.stringify(failures, null, 2));
    process.exit(1);
  }
}

runCrawler().catch((e) => {
  console.error(e);
  process.exit(1);
});
