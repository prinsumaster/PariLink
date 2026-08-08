import { test, expect } from '@playwright/test';

test('Customer CRUD Workflow', async ({ page }) => {
  // 1. Log in
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for dashboard to load
  await page.waitForURL('**/dashboard');
  
  // 2. Navigate to Customers
  const res = await page.goto('http://localhost:3000/customers');
  await page.waitForLoadState('networkidle');

  console.log('Status code for /customers:', res?.status());
  
  // Check for React rendering errors in console
  page.on('console', msg => {
    if (msg.type() === 'error') {
      console.log('BROWSER ERROR:', msg.text());
    }
  });

  const title = await page.locator('h1').textContent().catch(() => null);
  console.log('Page Title:', title);

  await page.screenshot({ path: '/tmp/customers_page.png' });
});
