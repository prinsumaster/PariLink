import { test, expect } from '@playwright/test';

const ROUTES = [
  '/admin',
  '/admin/audit',
  '/admin/demo',
  '/admin/developer',
  '/admin/enterprise',
  '/admin/marketplace',
  '/admin/marketplace/installed',
  '/admin/roles',
  '/admin/subscriptions',
  '/admin/users',
  '/admin/users/new',
  '/ai',
  '/ai/agents',
  '/ai/analytics',
  '/ai/command-center',
  '/ai/copilot',
  '/ai/cost',
  '/ai/evaluations',
  '/ai/knowledge',
  '/ai/models',
  '/ai/prompt-studio',
  '/alip',
  '/analytics/builder',
  '/analytics/command-center',
  '/announcements',
  '/automation',
  '/automation/history',
  '/billing',
  '/branches',
  '/branches/new',
  '/chat',
  '/command-center',
  '/control-tower',
  '/control-tower/risk',
  '/crm/leads',
  '/customers',
  '/customers/new',
  '/dashboard',
  '/dispatch',
  '/dispatch-workspace',
  '/documents',
  '/downloads',
  '/driver-intelligence',
  '/drivers',
  '/drivers/attendance',
  '/drivers/new',
  '/executive-ai',
  '/fastag/accounts',
  '/finance',
  '/finance/bank-statements',
  '/finance/new',
  '/finance/payroll',
  '/fleet',
  '/fleet-health',
  '/fleet/new',
  '/gst/rules',
  '/inbox',
  '/integrations',
  '/ledger',
  '/loads',
  '/notifications',
  '/notifications/preferences',
  '/operations',
  '/operations/backup',
  '/operations/incidents',
  '/operations/logs',
  '/operations/traces',
  '/orders',
  '/orders/new',
  '/payments',
  '/predictions',
  '/reports',
  '/settings',
  '/settings/billing',
  '/settings/notifications',
  '/settings/onboarding',
  '/settings/organization',
  '/settings/security',
  '/tracking',
  '/trailers',
  '/trailers/new',
  '/trips',
  '/trips/new',
  '/vehicles/permits',
  '/vendors',
  '/vendors/new',
  '/wms',
  '/wms/new',
  '/workflows'
];

test('Smoke test all core routes', async ({ page }) => {
  test.setTimeout(300000); // 5 minutes timeout for dev mode
  
  // Catch page errors and data error boundaries
  const errors: Error[] = [];
  page.on('pageerror', (err) => {
    errors.push(err);
  });
  
  page.on('console', msg => {
    if (msg.type() === 'error' && msg.text().includes('Unhandled Runtime Error')) {
      errors.push(new Error(`Runtime error: ${msg.text()}`));
    }
  });

  // Login
  await page.goto('/login');
  
  // Fill credentials (assuming admin@parilink.com / password123 from seed)
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  // Wait for dashboard to load (login success)
  await expect(page.locator('h1').first()).toContainText(/Dashboard|Overview|Command Center/i, { timeout: 15000 });

  for (const route of ROUTES) {
    const response = await page.goto(route);
    
    // Fail on 4xx / 5xx
    expect(response?.ok(), `Route ${route} returned status ${response?.status()}`).toBeTruthy();
    
    // Wait briefly for client-side rendering (Error boundaries render quickly)
    await page.waitForTimeout(1500);
    
    // Check for standard error boundary text AND data-error-boundary attribute
    const pageText = await page.textContent('body');
    const hasBoundaryAttr = await page.evaluate(() => !!document.querySelector('[data-error-boundary="true"]'));
    
    if (hasBoundaryAttr || 
        pageText?.includes('Application error: a client-side exception has occurred') || 
        pageText?.includes('Something went wrong!')) {
      errors.push(new Error(`Error boundary hit on route ${route}`));
    }
  }

  // Fail the test if any errors were caught
  expect(errors).toHaveLength(0);
});
