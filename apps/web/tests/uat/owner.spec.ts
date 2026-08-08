import { test, expect } from '@playwright/test';

test.describe('Owner Workflow UAT', () => {
  test('Login and navigate owner modules without errors', async ({ page }) => {
    // Collect console errors
    const errors: string[] = [];
    page.on('response', response => {
      if (response.status() === 404) {
        console.log(`[DEBUG] 404 Not Found: ${response.url()}`);
      }
    });
    
    page.on('console', msg => {
      if (msg.type() === 'error') {
        const text = msg.text();
        // Ignore Next.js dev server HMR/ChunkLoad errors
        if (!text.includes('ChunkLoadError') && !text.includes('HMR') && !text.includes('WebSocket')) {
          errors.push(`Console error: ${text}`);
        }
      }
    });
    
    // Fail test if any critical API fails (exclude some harmless analytics if needed, but here we catch all 4xx/5xx)
    page.on('response', response => {
      if (response.status() >= 400 && response.url().includes('/api/')) {
        errors.push(`Network error: ${response.status()} on ${response.url()}`);
      }
    });

    console.log('Navigating to login...');
    await page.goto('/login');
    
    // Check if there are any errors on initial load
    expect(errors.length, `Errors on load: ${errors.join(', ')}`).toBe(0);

    // Login
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await page.waitForURL('/dashboard');
    expect(errors.length, `Errors on login: ${errors.join(', ')}`).toBe(0);

    // Enterprise
    await page.goto('/admin/enterprise');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on enterprise page: ${errors.join(', ')}`).toBe(0);

    // AI Analytics
    await page.goto('/ai/analytics');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on AI analytics: ${errors.join(', ')}`).toBe(0);

    // Integrations
    await page.goto('/integrations');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on integrations: ${errors.join(', ')}`).toBe(0);

    // AI Prompt Studio
    await page.goto('/ai/prompt-studio');
    await page.waitForLoadState('networkidle');
    expect(errors.length, `Errors on prompt studio: ${errors.join(', ')}`).toBe(0);
  });
});
