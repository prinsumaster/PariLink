import { test, expect } from '@playwright/test';

test.describe('Dispatcher Workflow UAT', () => {
  test('Login and navigate dispatcher modules without errors', async ({ page }) => {
    // Collect console errors
    const errors: string[] = [];
    page.on('response', response => {
      if (response.status() === 404 || response.status() === 400) {
        console.log(`[DEBUG] ${response.status()} Error in Dispatcher: ${response.url()}`);
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

    // Login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await page.waitForURL('/dashboard');
    expect(errors.length, `Errors on login: ${errors.join(', ')}`).toBe(0);

    // Fleet
    await page.goto('/fleet');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on fleet page: ${errors.join(', ')}`).toBe(0);

    // Inbox
    await page.goto('/inbox');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on inbox: ${errors.join(', ')}`).toBe(0);

    // Automation / Execution Center
    // Assuming execution center is its own route, wait, I think it's embedded in some pages?
    // Let me check if there's a route for execution center. I'll test `/operations/incidents` first.
    
    // Operations / Incidents
    await page.goto('/operations/incidents');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on operations/incidents: ${errors.join(', ')}`).toBe(0);
    
    // Dispatch
    await page.goto('/dispatch');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on dispatch: ${errors.join(', ')}`).toBe(0);
  });
});
