import { test, expect } from '@playwright/test';

test.describe('Customer Workflow UAT', () => {
  test('Login and navigate customer modules without errors', async ({ page }) => {
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

    await page.goto('/customers');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on customers page: ${errors.join(', ')}`).toBe(0);

    await page.goto('/tracking');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on tracking: ${errors.join(', ')}`).toBe(0);
    
    await page.goto('/reports');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on reports: ${errors.join(', ')}`).toBe(0);
  });
});
