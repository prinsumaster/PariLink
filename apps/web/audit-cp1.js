const { chromium } = require('playwright');
const fs = require('fs');

const ROUTES = [
  '/customers',
  '/vendors',
  '/trips',
  '/loads',
  '/finance',
  '/finance/invoices',
  '/finance/payroll',
  '/fleet',
  '/fleet/maintenance',
  '/drivers',
  '/admin/users',
  '/reports',
  '/settings',
  '/integrations',
  '/ai/copilot',
  '/wms',
  '/documents',
  '/dispatch',
  '/analytics/command-center',
  '/driver/expenses'
];

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();
  
  const results = [];
  
  // Login first
  console.log('Navigating to login...');
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'admin@parilink.com');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  console.log('| Route | HTTP Status | Title | Body Length | 404/Error Text | JS Error |');
  console.log('|---|---|---|---|---|---|');

  for (const route of ROUTES) {
    let jsError = 'None';
    let boundaryError = false;
    
    const handlePageError = (err) => { jsError = 'Yes (Exception)'; };
    const handleConsole = (msg) => {
      if (msg.type() === 'error' && msg.text().includes('[BOUNDARY]')) {
        boundaryError = true;
      }
    };
    
    page.on('pageerror', handlePageError);
    page.on('console', handleConsole);

    const response = await page.goto(`http://localhost:3000${route}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1000); // Wait for potential boundaries to render
    
    const status = response.status();
    const title = await page.title();
    
    const bodyText = await page.evaluate(() => document.body.innerText);
    const hasBoundaryAttr = await page.evaluate(() => !!document.querySelector('[data-error-boundary="true"]'));
    const lowerBody = bodyText.toLowerCase();
    
    let errorText = 'None';
    if (status === 404 || lowerBody.includes('404') || lowerBody.includes('not found')) errorText = '404 Detected';
    else if (boundaryError || hasBoundaryAttr) errorText = 'FAILED (Error Boundary)';
    else if (lowerBody.includes('application error') || lowerBody.includes('something went wrong')) errorText = 'Error Text Found';

    console.log(`| \`${route}\` | ${status} | ${title} | ${bodyText.length} | ${errorText} | ${jsError} |`);
    
    results.push({ route, status, title, bodyLength: bodyText.length, errorText, jsError });

    page.removeListener('pageerror', handlePageError);
    page.removeListener('console', handleConsole);
  }

  await browser.close();
})();
