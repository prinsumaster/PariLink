# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: verify.spec.ts >> Verify three routes
- Location: tests/e2e/verify.spec.ts:5:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('input[type="email"]')

```

# Page snapshot

```yaml
- generic [active]:
  - region "Notifications alt+T"
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | const TARGET_ROUTES = ['/ai/agents', '/announcements', '/control-tower'];
  4  | 
  5  | test('Verify three routes', async ({ page }) => {
  6  |   // Login first
  7  |   await page.goto('/login');
> 8  |   await page.fill('input[type="email"]', 'admin@parilink.com');
     |              ^ Error: page.fill: Test timeout of 30000ms exceeded.
  9  |   await page.fill('input[type="password"]', 'Admin123!');
  10 |   await page.click('button[type="submit"]');
  11 |   await expect(page).toHaveURL(/.*dashboard.*/, { timeout: 15000 });
  12 |   await expect(page.locator('h1', { hasText: 'Command Center' })).toBeVisible({ timeout: 15000 });
  13 | 
  14 |   for (const route of TARGET_ROUTES) {
  15 |     let pageError = false;
  16 |     page.on('pageerror', (exception) => {
  17 |       console.log(`[${route}] pageerror: ${exception}`);
  18 |       pageError = true;
  19 |     });
  20 | 
  21 |     const res = await page.goto(route);
  22 |     const status = res?.status();
  23 |     
  24 |     // Wait for load
  25 |     await page.waitForTimeout(1000);
  26 | 
  27 |     const bodyText = await page.evaluate(() => document.body.innerText);
  28 |     const bodyLength = bodyText.length;
  29 |     
  30 |     const h1s = await page.locator('h1').allInnerTexts();
  31 |     const h1Text = h1s.join(' | ');
  32 | 
  33 |     const boundaryCount = await page.locator('[data-error-boundary="true"]').count();
  34 | 
  35 |     console.log(`ROUTE: ${route}`);
  36 |     console.log(`- Status: ${status}`);
  37 |     console.log(`- Body Length: ${bodyLength}`);
  38 |     console.log(`- H1 Text: ${h1Text}`);
  39 |     console.log(`- Boundary Count: ${boundaryCount}`);
  40 |     console.log(`- PageError: ${pageError ? 'YES' : 'NONE'}`);
  41 |     console.log('---');
  42 |   }
  43 | });
  44 | 
```