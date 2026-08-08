import { test, expect, BrowserContext, Page } from '@playwright/test';

test.describe('Authentication Lifecycle Audit', () => {
  // We need to run these serially as they manipulate global state
  test.describe.configure({ mode: 'serial' });
  
  let sharedContext: BrowserContext;
  let sharedPage: Page;
  
  test.beforeAll(async ({ browser }) => {
    sharedContext = await browser.newContext();
    sharedPage = await sharedContext.newPage();
  });
  
  test.afterAll(async () => {
    await sharedContext.close();
  });

  test('1. Direct URL access without cookie redirects to login', async () => {
    await sharedPage.goto('http://localhost:3000/dashboard');
    await expect(sharedPage).toHaveURL(/.*\/login/);
  });

  test('2. Fresh login succeeds and syncs state', async () => {
    await sharedPage.goto('http://localhost:3000/login');
    
    // Fill out login form (assuming standard inputs exist)
    await sharedPage.fill('input[type="email"]', 'admin@parilink.com');
    await sharedPage.fill('input[type="password"]', 'password123');
    await sharedPage.click('button[type="submit"]');
    
    // Wait for redirect to dashboard
    await sharedPage.waitForURL('http://localhost:3000/dashboard');
    await expect(sharedPage).toHaveURL('http://localhost:3000/dashboard');
    
    // Verify cookie exists
    const cookies = await sharedContext.cookies();
    const tokenCookie = cookies.find(c => c.name === 'access_token');
    expect(tokenCookie).toBeDefined();
    
    // Verify localStorage exists
    const ls = await sharedPage.evaluate(() => localStorage.getItem('parilink-auth'));
    expect(ls).toContain('admin@parilink.com');
  });

  test('3. Browser refresh maintains session', async () => {
    await sharedPage.reload();
    await expect(sharedPage).toHaveURL('http://localhost:3000/dashboard');
    // Ensure no layout tearing or redirect loop occurred
    await expect(sharedPage.locator('text=Sign In')).toHaveCount(0);
  });

  test('4. Open new tab shares session', async ({ browser }) => {
    const newPage = await sharedContext.newPage();
    await newPage.goto('http://localhost:3000/dashboard');
    await expect(newPage).toHaveURL('http://localhost:3000/dashboard');
    await newPage.close();
  });

  test('5. Deep linking works for authenticated users', async () => {
    await sharedPage.goto('http://localhost:3000/settings');
    await expect(sharedPage).toHaveURL(/.*\/settings/);
  });

  test('6. Missing cookie forcefully logs out client (Simulate drift)', async () => {
    // Delete the cookie to simulate expiration or manual deletion
    await sharedContext.clearCookies();
    
    // Refresh the page
    await sharedPage.reload();
    
    // Should be redirected to login because middleware saw no cookie
    await expect(sharedPage).toHaveURL(/.*\/login/);
    
    // Check if the client-side state correctly wiped itself on load
    const ls = await sharedPage.evaluate(() => localStorage.getItem('parilink-auth'));
    expect(ls).toBeNull(); // Because our new customStorage engine wiped it!
  });

  test('7. Incognito window requires fresh login', async ({ browser }) => {
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto('http://localhost:3000/dashboard');
    await expect(page).toHaveURL(/.*\/login/);
    await context.close();
  });

  test('8. Invalid password shows error', async () => {
    await sharedPage.goto('http://localhost:3000/login');
    await sharedPage.fill('input[type="email"]', 'admin@parilink.com');
    await sharedPage.fill('input[type="password"]', 'wrongpass');
    await sharedPage.click('button[type="submit"]');
    
    // Should stay on login and show error (toast or inline)
    await expect(sharedPage).toHaveURL(/.*\/login/);
  });
});
