# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: apps/web/tests/smoke.spec.ts >> Smoke test all core routes
- Location: apps/web/tests/smoke.spec.ts:93:5

# Error details

```
Error: expect(received).not.toContain(expected) // indexOf

Expected substring: not "/login"
Received string:        "http://localhost:3000/login?callbackUrl=%2Fadmin"
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - button "Skip Animation" [ref=e8]
    - generic:
      - generic:
        - heading "Command your fleet." [level=1]
        - paragraph: The AI-powered operating system unifying dispatch, telematics, and financial automation.
  - region "Notifications alt+T"
  - alert [ref=e15]
```

# Test source

```ts
  17  |   '/ai/analytics',
  18  |   '/ai/command-center',
  19  |   '/ai/copilot',
  20  |   '/ai/cost',
  21  |   '/ai/evaluations',
  22  |   '/ai/knowledge',
  23  |   '/ai/models',
  24  |   '/ai/prompt-studio',
  25  |   '/alip',
  26  |   '/announcements',
  27  |   '/analytics/builder',
  28  |   '/analytics/command-center',
  29  |   '/automation',
  30  |   '/automation/history',
  31  |   '/billing',
  32  |   '/branches',
  33  |   '/branches/new',
  34  |   '/chat',
  35  |   '/command-center',
  36  |   '/crm/leads',
  37  |   '/customers',
  38  |   '/customers/new',
  39  |   '/dashboard',
  40  |   '/dispatch',
  41  |   '/dispatch-workspace',
  42  |   '/documents',
  43  |   '/downloads',
  44  |   '/driver-intelligence',
  45  |   '/drivers',
  46  |   '/drivers/attendance',
  47  |   '/drivers/new',
  48  |   '/executive-ai',
  49  |   '/fastag/accounts',
  50  |   '/finance',
  51  |   '/finance/bank-statements',
  52  |   '/finance/new',
  53  |   '/finance/payroll',
  54  |   '/fleet',
  55  |   '/fleet-health',
  56  |   '/fleet/new',
  57  |   '/gst/rules',
  58  |   '/inbox',
  59  |   '/integrations',
  60  |   '/ledger',
  61  |   '/loads',
  62  |   '/notifications',
  63  |   '/notifications/preferences',
  64  |   '/operations',
  65  |   '/operations/backup',
  66  |   '/operations/incidents',
  67  |   '/operations/logs',
  68  |   '/operations/traces',
  69  |   '/orders',
  70  |   '/orders/new',
  71  |   '/payments',
  72  |   '/predictions',
  73  |   '/reports',
  74  |   '/settings',
  75  |   '/settings/billing',
  76  |   '/settings/notifications',
  77  |   '/settings/onboarding',
  78  |   '/settings/organization',
  79  |   '/settings/security',
  80  |   '/tracking',
  81  |   '/trailers',
  82  |   '/trailers/new',
  83  |   '/trips',
  84  |   '/trips/new',
  85  |   '/vehicles/permits',
  86  |   '/vendors',
  87  |   '/vendors/new',
  88  |   '/wms',
  89  |   '/wms/new',
  90  |   '/workflows'
  91  | ];
  92  | 
  93  | test('Smoke test all core routes', async ({ page }) => {
  94  |   test.setTimeout(300000); // 5 minutes timeout for dev mode
  95  |   
  96  |   // Catch page errors and data error boundaries
  97  |   const errors: Error[] = [];
  98  |   page.on('pageerror', (err) => {
  99  |     errors.push(err);
  100 |   });
  101 |   
  102 |   page.on('console', msg => {
  103 |     if (msg.type() === 'error' && msg.text().includes('Unhandled Runtime Error')) {
  104 |       errors.push(new Error(`Runtime error: ${msg.text()}`));
  105 |     }
  106 |   });
  107 | 
  108 |   // Already logged in via globalSetup
  109 | 
  110 |   for (const route of ROUTES) {
  111 |     const response = await page.goto('http://localhost:3000' + route);
  112 |     
  113 |     // Fail on 4xx / 5xx
  114 |     expect(response?.ok(), `Route ${route} returned status ${response?.status()}`).toBeTruthy();
  115 |     
  116 |     // CN1: assert page.url() still matches the requested route (no /login redirect)
> 117 |     expect(page.url()).not.toContain('/login');
      |                            ^ Error: expect(received).not.toContain(expected) // indexOf
  118 |     
  119 |     // Wait briefly for client-side rendering (Error boundaries render quickly)
  120 |     await page.waitForTimeout(1500);
  121 |     
  122 |     // Check for standard error boundary text AND data-error-boundary attribute
  123 |     const pageText = await page.textContent('body');
  124 |     
  125 |     // CN1: assert the body does NOT contain "Command your fleet"
  126 |     expect(pageText).not.toContain('Command your fleet');
  127 |     const hasBoundaryAttr = await page.evaluate(() => !!document.querySelector('[data-error-boundary="true"]'));
  128 |     const boundaryCount = await page.locator('[data-error-boundary="true"]').count();
  129 |     
  130 |     if (hasBoundaryAttr || 
  131 |         pageText?.includes('Application error: a client-side exception has occurred') || 
  132 |         pageText?.includes('Something went wrong!')) {
  133 |       errors.push(new Error(`Error boundary hit on route ${route}`));
  134 |     }
  135 |     
  136 |     // Catch empty stubs: require body length > 200 chars or be in allowlist
  137 |     const innerText = await page.evaluate(() => document.body.innerText);
  138 |     const charCount = innerText.trim().length;
  139 |     
  140 |     const h1s = await page.locator('h1').allInnerTexts();
  141 |     const h1Text = h1s.join(' | ');
  142 | 
  143 |     // Optional: allowlist for routes legitimately under 200 chars
  144 |     const allowlist = ['/api/health', '/forgot-password', '/reset-password'];
  145 |     
  146 |     if (['/ai/agents', '/announcements', '/control-tower', '/control-tower/event-stream', '/control-tower/exception-center', '/control-tower/live-map'].includes(route)) {
  147 |       console.log(`[INFO] Route: ${route} | Status: ${response?.status()} | Body Length: ${charCount} | H1: ${h1Text} | Boundary: ${boundaryCount} | pageerror: 0`);
  148 |     }
  149 | 
  150 |     if (charCount < 200 && !allowlist.includes(route)) {
  151 |       errors.push(new Error(`Route ${route} is suspiciously empty (only ${charCount} chars). Suspected stub.`));
  152 |     } else {
  153 |       console.log(`[PASS] ${route} -> ${charCount} chars`);
  154 |     }
  155 |   }
  156 | 
  157 |   // Fail the test if any errors were caught
  158 |   expect(errors).toHaveLength(0);
  159 | });
  160 | 
```