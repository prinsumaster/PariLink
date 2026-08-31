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
    const arr = data.data || data;
    if (!Array.isArray(arr)) return [];
    return arr.slice(0, 3).map((item: any) => item.id);
  } catch (e) {
    console.error(`Failed fetching IDs from ${endpoint}`, e);
    return [];
  }
}

async function runCrawler() {
  console.log('Starting crawler...');
  const token = await getAuthToken();
  if (!token) throw new Error('Could not get auth token for crawler.');

  const [loads, trips, invoices, customers, vehicles, drivers, warehouses, orders, lorryReceipts] = await Promise.all([
    fetchIds(token, 'loads'),
    fetchIds(token, 'trips'),
    fetchIds(token, 'invoices'), // invoices
    fetchIds(token, 'customers'),
    fetchIds(token, 'vehicles'),
    fetchIds(token, 'drivers'),
    fetchIds(token, 'warehouses'),
    fetchIds(token, 'orders'),
    fetchIds(token, 'lorry-receipts')
  ]);

  const routesToCrawl: string[] = [
    '/dashboard',
    '/customers',
    '/fleet',
    '/drivers',
    '/loads',
    '/trips',
    '/vendors',
    '/billing',
    '/analytics/command-center',
    '/finance',
    '/finance/bank-statements',
    '/finance/payroll',
    '/wms',
    '/orders',
    '/reports',
    '/notifications',
    '/operations'
  ];
  loads.forEach(id => routesToCrawl.push(`/loads/${id}`));
  trips.forEach(id => routesToCrawl.push(`/trips/${id}`));
  invoices.forEach(id => routesToCrawl.push(`/finance/${id}`));
  customers.forEach(id => routesToCrawl.push(`/customers/${id}`));
  vehicles.forEach(id => routesToCrawl.push(`/fleet/${id}`));
  drivers.forEach(id => routesToCrawl.push(`/drivers/${id}`));
  warehouses.forEach(id => routesToCrawl.push(`/wms/${id}`));
  orders.forEach(id => routesToCrawl.push(`/orders/${id}`));
  lorryReceipts.forEach(id => routesToCrawl.push(`/lorry-receipts/${id}`));

  console.log(`Prepared ${routesToCrawl.length} routes to crawl.`);

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3000); // Give React time to hydrate
  await page.fill('input[type="email"]', 'admin@parilink.com', { timeout: 120000 });
  await page.fill('input[type="password"]', 'password123', { timeout: 120000 });
  await page.waitForLoadState('networkidle');
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 120000 });

  for (const route of routesToCrawl) {
    console.log(`\nCrawling: ${route}`);
    let routeFailures = 0;
    
    // Attach listeners
    const pageErrorFn = (err: any) => {
      failures.push({ route, kind: 'pageerror', message: err.message || err.toString() });
      routeFailures++;
    };
    const consoleFn = (msg: any) => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (text.includes('Unhandled Runtime Error') || text.includes('ErrorBoundary')) {
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
      
      await page.waitForTimeout(1000); // Wait for rendering

      // Text scan
      const bodyText = await page.evaluate(() => document.body.innerText);
      const textMatches = ['Dashboard View Error', 'Permission Denied', 'Invalid Date', 'NaN', 'undefined'];
      for (const match of textMatches) {
        if (bodyText.includes(match)) {
          failures.push({ route, kind: 'text-match', message: match });
          routeFailures++;
          if (match === 'undefined') {
            const idx = bodyText.indexOf(match);
            console.log(`[DEBUG] 'undefined' context in ${route}: ${bodyText.substring(Math.max(0, idx - 40), idx + 40)}`);
          }
        }
      }

      // Click all safe buttons
      // Skip destructive buttons (Delete, Remove, Confirm)
      const buttons = await page.$$('button, a[role="button"]');
      for (const btn of buttons) {
        const text = await btn.innerText().catch(() => '');
        const lowerText = text.toLowerCase();
        if (!lowerText) continue;
        if (lowerText.includes('delete') || lowerText.includes('remove') || lowerText.includes('confirm') || lowerText.includes('discard')) {
          continue;
        }

        try {
          await btn.click({ timeout: 1000 });
          await page.waitForTimeout(500); // let UI react
        } catch (e) {
          // ignore click errors (element not interactable)
        }
      }

      // Re-scan text after clicks
      const bodyTextAfter = await page.evaluate(() => document.body.innerText);
      for (const match of textMatches) {
        if (bodyTextAfter.includes(match) && !bodyText.includes(match)) {
          failures.push({ route, kind: 'text-match-after-click', message: match });
          routeFailures++;
        }
      }

    } catch (e: any) {
      failures.push({ route, kind: 'navigation-error', message: e.message });
      routeFailures++;
    } finally {
      // Remove listeners for next route
      page.off('pageerror', pageErrorFn);
      page.off('console', consoleFn);
      page.off('response', responseFn);
    }
    
    if (routeFailures === 0) {
      console.log(`[PASS] ${route}`);
    } else {
      console.log(`[FAIL] ${route} (${routeFailures} errors)`);
      const routeFails = failures.filter(f => f.route === route);
      routeFails.forEach(f => console.log(`  -> [${f.kind}] ${f.message}`));
    }
  }

  await browser.close();

  fs.writeFileSync('crawl-report.json', JSON.stringify(failures, null, 2));
  console.log(`\nCrawl finished. Found ${failures.length} total failures.`);
  if (failures.length > 0) {
    process.exit(1);
  }
}

runCrawler().catch(console.error);
