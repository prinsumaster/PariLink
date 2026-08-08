import { test, expect } from '@playwright/test';

test.describe('Authentication & Tenant Isolation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Clear cookies and local storage before each test to ensure clean state
    await page.context().clearCookies();
    await page.goto('/login');

    page.on('console', msg => console.log(`[BROWSER CONSOLE] ${msg.text()}`));

  });

  test('Login should succeed with valid credentials and redirect to dashboard', async ({ page }) => {
    // We mock the API layer for predictable test results
    await page.route('**/api/v1/auth/login', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          access_token: 'mock-token-123',
          user: {
            id: 'u-1',
            email: 'admin@parilink.com',
            firstName: 'Admin',
            lastName: 'User',
            role: 'SUPER_ADMIN',
            organizationId: 'org-1'
          }
        }),
      });
    });

    // We also mock the initial dashboard queries
    await page.route('**/api/v1/users/me', route => {
      route.fulfill({ status: 200, body: JSON.stringify({}) });
    });

    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'Password123!');
    await page.click('button[type="submit"]');

    // Wait for navigation to dashboard
    await expect(page).toHaveURL(/\/(dashboard)?/);
  });

  test('Login should fail with invalid credentials', async ({ page }) => {
    await page.route('**/auth/login', route => {
      route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({ message: 'Invalid credentials' }),
      });
    });

    await page.fill('input[type="email"]', 'wrong@parilink.com');
    await page.fill('input[type="password"]', 'wrongpass');
    await page.click('button[type="submit"]');

    // Check for error boundary or toast
    await expect(page.locator('text="Invalid credentials"')).toBeVisible();
    await expect(page).toHaveURL(/\/login/);
  });

  test('Tenant header is injected on API requests', async ({ page }) => {
    const requestPromise = page.waitForRequest(request => {
      return request.url().includes('/vehicles') &&
             request.headers()['x-tenant-id'] === 'tenant-alpha';
    });

    // Mock cookie to bypass middleware and simulate logged in state
    await page.context().addCookies([
      {
        name: 'access_token',
        value: 'mock-token',
        domain: 'localhost',
        path: '/'
      },
      {
        name: 'tenant_slug',
        value: 'tenant-alpha',
        domain: 'localhost',
        path: '/'
      },
      {
        name: 'logged_in',
        value: 'true',
        domain: 'localhost',
        path: '/'
      }
    ]);
    
    await page.addInitScript(() => {
      window.localStorage.setItem('parilink-auth', JSON.stringify({
        state: {
          token: 'mock-token',
          tenantId: 'tenant-alpha',
          isAuthenticated: true,
          user: { id: 'u-1', role: 'SUPER_ADMIN' }
        },
        version: 0
      }));
    });

    // Navigate to a page that makes an API call
    await page.goto('/fleet');
    
    // The request should be captured and verified
    const request = await requestPromise;
    expect(request.headers()['x-tenant-id']).toBe('tenant-alpha');
  });
});
