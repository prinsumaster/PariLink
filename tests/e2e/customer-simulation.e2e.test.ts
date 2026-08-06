import { test, expect } from '@playwright/test';

test.describe('Customer #1 Zero-Friction Go-Live Validation', () => {
  test.setTimeout(300000); // 5 minutes max since it's a massive flow

  const runId = Date.now();
  const companyName = `Global Logistics ${runId}`;
  const adminEmail = `admin_${runId}@globallogistics.com`;
  const password = 'SuperSecretPassword123!';

  test.beforeEach(async ({ page }) => {
    // Navigate to root to ensure we start clean
    await page.goto('/');
  });

  test('Execute full 30-day simulation journey', async ({ page }) => {
    page.on('console', msg => console.log(`[Browser Console] ${msg.type()}: ${msg.text()}`));
    page.on('pageerror', err => console.error(`[Browser Page Error] ${err.message}`));

    // 1. REGISTRATION & COMPANY CREATION
    await test.step('Register and setup company', async () => {
      await page.goto('/register');
      await page.fill('input[name="companyName"]', companyName);
      await page.fill('input[name="email"]', adminEmail);
      await page.fill('input[name="password"]', password);
      await page.click('button[type="submit"]');

      // Explicitly wait for onboarding redirect since new tenants always go there
      await page.waitForURL(/.*onboarding/);
      
      await page.click('text=Next');
      await page.click('text=Next');
      await page.click('text=Complete Setup');

      await expect(page).toHaveURL(/.*dashboard/);
      await expect(page.locator('text=Dashboard').first()).toBeVisible();
    });

    // 2. SETTINGS / UI VERIFICATION (Dark Mode)
    await test.step('Verify Settings & UI consistency (Dark Mode Toggle)', async () => {
      await page.goto('/settings');
      // Just check if settings loads and has tabs
      await expect(page.locator('text=Settings').first()).toBeVisible();
      
      // Let's toggle dark mode just to ensure it doesn't break the UI (e.g. contrast issues)
      // Look for a theme toggle button usually in the header or sidebar
      const themeToggle = page.locator('button[aria-label="Toggle theme"], button[title="Toggle theme"]').first();
      if (await themeToggle.isVisible()) {
        await themeToggle.click(); // Switch to dark
        // Wait a bit to ensure no JS errors pop up from themes
        await page.waitForTimeout(500);
        await themeToggle.click(); // Switch back to light
      }
    });

    // 3. MASTER DATA: CUSTOMER CREATION
    const customerName = `Cust Acme ${runId}`;
    await test.step('Create Customer Data', async () => {
      await page.goto('/customers');
      await page.waitForTimeout(2000); // Wait for page slide-in animations
      
      // DEBUGGING
      await page.screenshot({ path: 'debug-customers-page.png' });
      const authState = await page.evaluate(() => localStorage.getItem('parilink-auth'));
      console.log('[DEBUG] parilink-auth:', authState);
      const buttonHtml = await page.evaluate(() => document.body.innerHTML);
      console.log('[DEBUG] Body length:', buttonHtml.length);
      // END DEBUGGING
      
      await page.click('a:has-text("Add Customer")', { force: true });
      await page.waitForURL(/.*customers\/new/);
      
      await page.fill('input[name="companyName"]', customerName);
      await page.fill('input[name="primaryEmail"]', `billing@acme${runId}.com`);
      await page.fill('input[name="primaryPhone"]', '555-555-0100');
      
      // Address
      await page.fill('input[name="address.street"]', '100 Acme Way');
      await page.fill('input[name="address.city"]', 'Austin');
      await page.fill('input[name="address.state"]', 'TX');
      await page.fill('input[name="address.postalCode"]', '78701');
      await page.fill('input[name="address.country"]', 'USA');
      
      // Contact
      await page.fill('input[name="contacts.0.name"]', 'John Doe');
      await page.fill('input[name="contacts.0.role"]', 'Manager');
      await page.fill('input[name="contacts.0.email"]', `john@acme${runId}.com`);
      await page.fill('input[name="contacts.0.phone"]', '555-555-0100');

      await page.click('button[type="submit"]');
      
      // Wait for redirect to customer details
      await page.waitForURL(/\/customers\/[a-zA-Z0-9-]{36}/, { timeout: 15000 });
      
      // Verify customer appears in table
      await expect(page.locator(`text=${customerName}`).first()).toBeVisible();
    });

    // 4. MASTER DATA: DRIVER CREATION
    const driverName = `John Pilot ${runId}`;
    await test.step('Create Driver Data', async () => {
      console.log('[DEBUG] Navigating to /drivers');
      await page.goto('/drivers');
      
      console.log('[DEBUG] Waiting 2s');
      await page.waitForTimeout(2000);
      
      console.log('[DEBUG] Clicking Add Driver');
      await page.click('a:has-text("Add Driver")', { force: true });
      
      console.log('[DEBUG] Waiting for URL /drivers/new');
      await page.waitForURL(/.*drivers\/new/);
      
      console.log('[DEBUG] Filling driver form');
      await page.fill('input[name="firstName"]', 'John');
      await page.fill('input[name="lastName"]', `Pilot ${runId}`);
      await page.fill('input[name="phone"]', '555-555-0200');
      await page.fill('input[name="licenseNumber"]', `DL-${runId}`);
      
      console.log('[DEBUG] Submitting driver form');
      await page.click('button:has-text("Save Driver")');
      
      console.log('[DEBUG] Waiting for redirect away from /new');
      await page.waitForURL(/\/drivers$/, { timeout: 15000 }).catch(() => {});
      
      console.log('[DEBUG] Asserting driver name visible');
      await expect(page.locator(`text=${driverName}`).first()).toBeVisible();
      console.log('[DEBUG] Driver created successfully');
    });

    // 5. MASTER DATA: VEHICLE CREATION
    const vehicleRef = `TRK-${String(runId).slice(-4)}`;
    await test.step('Create Vehicle Data', async () => {
      await page.goto('/fleet');
      await page.waitForTimeout(1000);
      await page.click('a:has-text("Add Vehicle")', { force: true });
      await page.waitForURL(/.*fleet\/new/);
      
      // Type combobox
      const typeCombobox = page.locator('button[role="combobox"]').first();
      if (await typeCombobox.isVisible()) {
         await typeCombobox.click();
         await page.click('div[role="option"]:has-text("Truck")');
      }

      await page.fill('input[name="registrationNumber"]', vehicleRef);
      await page.fill('input[name="make"]', 'Freightliner');
      await page.fill('input[name="model"]', 'Cascadia');
      await page.fill('input[name="year"]', '2023');
      // Status combobox defaults to IN_SERVICE probably, wait for it just in case
      await page.click('button[type="submit"]');
      
      await page.waitForURL(/\/fleet/, { timeout: 15000 }).catch(() => {});
      await expect(page.locator(`text=${vehicleRef}`).first()).toBeVisible();
    });

    // 6. OPERATIONS: CREATE MULTIPLE LOADS (SIMULATE VOLUME)
    const loadRefs: string[] = [];
    await test.step('Create Volume Loads', async () => {
      await page.goto('/loads');
      
      for (let i = 0; i < 3; i++) {
        const refNum = `VOL-${runId}-${i}`;
        loadRefs.push(refNum);
        
        console.log(`[DEBUG] Navigating to /loads for iteration ${i}`);
        await page.goto('/loads');
        await page.waitForTimeout(1000);
        console.log(`[DEBUG] Clicking Create Load for iteration ${i}`);
        await page.click('button:has-text("Create Load"), button:has-text("New Load")', { force: true });
        
        console.log(`[DEBUG] Selecting customer for iteration ${i}`);
        await page.selectOption('select[name="customerId"]', { index: 1 });
        console.log(`[DEBUG] Filling referenceNumber for iteration ${i}`);
        await page.fill('input[name="referenceNumber"]', refNum);
        console.log(`[DEBUG] Clicking Continue 1 for iteration ${i}`);
        await page.click('button:has-text("Continue")');
        
        console.log(`[DEBUG] Filling origin/dest for iteration ${i}`);
        await page.fill('input[name="originAddress"]', 'Whse A');
        await page.fill('input[name="originCity"]', 'Dallas');
        await page.fill('input[name="originState"]', 'TX');
        await page.fill('input[name="destinationAddress"]', 'Store B');
        await page.fill('input[name="destinationCity"]', 'Houston');
        await page.fill('input[name="destinationState"]', 'TX');
        console.log(`[DEBUG] Clicking Continue 2 for iteration ${i}`);
        await page.click('button:has-text("Continue")');
        
        await page.fill('input[name="pickupDate"]', '2026-10-10T10:00');
        await page.fill('input[name="deliveryDate"]', '2026-10-12T14:00');
        await page.fill('input[name="rate"]', '1500');
        
        await page.click('button[type="submit"]:has-text("Create Load")');
        await expect(page).toHaveURL(/\/loads\/[a-zA-Z0-9-]{36}/, { timeout: 15000 });
      }
    });

    // 7. OPERATIONS: DISPATCH BOARD
    await test.step('Dispatch Board Assignment', async () => {
      await page.goto('/dispatch');
      
      // Dispatch the first load
      const loadToDispatch = loadRefs[0];
      const loadCard = page.locator(`.border-l-amber-400:has-text("${loadToDispatch}")`);
      await expect(loadCard).toBeVisible({ timeout: 20000 });
      
      // Use Auto-Select to quickly assign
      await loadCard.getByRole('button', { name: 'Auto-Select' }).click();
      
      // Dispatch
      await page.evaluate((ref) => {
        const cards = Array.from(document.querySelectorAll('.border-l-amber-400'));
        const card = cards.find(c => c.textContent?.includes(ref));
        if (card) {
          const btn = card.querySelector('[data-testid="dispatch-now-btn"]') as HTMLElement;
          if (btn) btn.click();
        }
      }, loadToDispatch);
      
      // Should move to dispatched column
      await page.reload();
      await expect(page.locator(`.border-l-blue-500:has-text("${loadToDispatch}")`)).toBeVisible({ timeout: 15000 });
    });

    // 8. OPERATIONS: IN TRANSIT & POD
    await test.step('Update Status and Submit POD', async () => {
      const loadToDeliver = loadRefs[0];
      await page.goto('/loads');
      await page.click(`text=${loadToDeliver}`);
      
      // Mark In Transit
      await page.selectOption('select:has-text("Change Status")', 'IN_TRANSIT');
      await expect(page.locator('.bg-violet-100:has-text("In Transit")').first()).toBeVisible();
      
      // Deliver (POD)
      await page.click('button:has-text("Submit POD")');
      await page.locator('div:has-text("Click to sign")').last().click();
      await page.fill('input[name="receiverName"]', 'Receiver Sim');
      await page.getByRole('dialog').getByRole('button', { name: 'Submit POD' }).click();
      
      await expect(page.locator('.bg-emerald-100:has-text("Delivered")').first()).toBeVisible();
    });

    // 9. FINANCE: INVOICING & PAYMENT
    await test.step('Billing and Payments', async () => {
      await page.goto('/billing');
      const invoiceRow = page.locator('tr', { hasText: 'Draft' }).first();
      await expect(invoiceRow).toBeVisible({ timeout: 15000 });
      
      // Approve Invoice
      await invoiceRow.getByRole('button', { name: /Open menu/i }).click();
      await page.getByRole('menuitem', { name: /Approve & Send/i }).click();
      await expect(page.locator('tr', { hasText: 'Sent' }).first()).toBeVisible();
      
      // Record Payment
      await page.goto('/payments');
      await page.click('button:has-text("Record Payment")');
      await page.selectOption('select[name="invoiceId"]', { index: 1 });
      await page.fill('input[name="amount"]', '1500');
      await page.click('button[type="submit"]:has-text("Record Payment")');
      
      await expect(page.locator('text=Payment recorded successfully!')).toBeVisible();
    });

    // 10. QA: DATA TABLES / EXPORTS
    await test.step('QA Table Interactions (Filter, Search)', async () => {
      await page.goto('/loads');
      // Type in search box
      const searchInput = page.locator('input[placeholder*="Search"]');
      if (await searchInput.isVisible()) {
         await searchInput.fill(loadRefs[1]);
         // Should filter the table to just this row
         await expect(page.locator(`text=${loadRefs[1]}`)).toBeVisible();
         await expect(page.locator(`text=${loadRefs[2]}`)).not.toBeVisible();
      }
    });

  });
});
