import { test, expect } from '@playwright/test';

test.describe('Finance Workflow UAT', () => {
  test('Login and navigate finance modules without errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/api/')) {
        errors.push(`Network error: ${response.status()} on ${response.url()}`);
      }
    });

    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        if (!text.includes('ChunkLoadError') && !text.includes('HMR') && !text.includes('WebSocket')) {
          errors.push(`Console error: ${text}`);
        }
      }
    });

    await page.goto('/login');
    expect(errors.length, `Errors on load: ${errors.join(', ')}`).toBe(0);

    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    await page.waitForURL('/dashboard');
    expect(errors.length, `Errors on login: ${errors.join(', ')}`).toBe(0);

    await page.goto('/finance');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on finance page: ${errors.join(', ')}`).toBe(0);

    await page.goto('/finance/payroll');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on payroll: ${errors.join(', ')}`).toBe(0);

    await page.goto('/billing');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on billing: ${errors.join(', ')}`).toBe(0);
    
    await page.goto('/payments');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on payments: ${errors.join(', ')}`).toBe(0);
  });
});
