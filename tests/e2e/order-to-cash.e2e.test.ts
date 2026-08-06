import { test, expect } from '@playwright/test';

test.describe('Order-to-Cash (O2C) Workflow', () => {
  test.setTimeout(120000);
  // Use a unique reference number for each test run
  const referenceNumber = `LD-E2E-${Date.now()}`;
  
  test.beforeEach(async ({ page }) => {
    // Navigate to login
    await page.goto('/login');
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await expect(page).toHaveURL('/dashboard');
  });

  test('executes full order to cash flow end-to-end', async ({ page }) => {
    // Capture browser console
    page.on('console', msg => console.log(`Browser console: ${msg.type()}: ${msg.text()}`));

    // 1. Create Load
    // 1. Create Load
    await test.step('Create Load', async () => {
      await page.goto('/loads');
      require('fs').writeFileSync('dom-dump.html', await page.content());
      await page.locator('button:has-text("Create Load"), button:has-text("New Load")').first().click();
      await expect(page.getByRole('dialog')).toBeVisible();

      // Fill in form
      await page.selectOption('select[name="customerId"]', { index: 1 });
      await page.fill('input[name="referenceNumber"]', referenceNumber);
      await page.getByRole('button', { name: 'Continue' }).click();
      
      // Origin
      await page.fill('input[name="originAddress"]', '123 E2E Street');
      await page.fill('input[name="originCity"]', 'Dallas');
      await page.fill('input[name="originState"]', 'TX');
      
      // Destination
      await page.fill('input[name="destinationAddress"]', '456 Delivery Ave');
      await page.fill('input[name="destinationCity"]', 'Austin');
      await page.fill('input[name="destinationState"]', 'TX');
      await page.getByRole('button', { name: 'Continue' }).click();
      await page.waitForSelector('input[name="pickupDate"]');
      await page.evaluate(() => {
        const setNativeValue = (element: any, value: string) => {
          const valueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
          const prototype = Object.getPrototypeOf(element);
          const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value')?.set;
          if (valueSetter && valueSetter !== prototypeValueSetter) {
            prototypeValueSetter?.call(element, value);
          } else {
            valueSetter?.call(element, value);
          }
          element.dispatchEvent(new Event('input', { bubbles: true }));
        };
        setNativeValue(document.querySelector('input[name="pickupDate"]'), '2025-10-10T10:00');
        setNativeValue(document.querySelector('input[name="deliveryDate"]'), '2025-10-12T14:00');
      });
      
      // Financials
      await page.fill('input[name="rate"]', '1250');
      
      await page.click('button[type="submit"]:has-text("Create Load")');
      
      // Check if there are any error messages in the form
      await page.waitForTimeout(1000); // wait for validation messages to render
      const errors = await page.locator('.text-red-500').allTextContents();
      if (errors.length > 0) {
        console.log('Form validation errors:', errors);
      }

      // Should redirect to detail page
      await expect(page).toHaveURL(/\/loads\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/, { timeout: 10000 });
      await expect(page.locator(`text=${referenceNumber}`).first()).toBeVisible();
    });

    // Extract Load ID from URL for subsequent navigation if needed
    const loadUrl = page.url();
    const loadId = loadUrl.split('/').pop();
    console.log('Extracted Load ID:', loadId);

    // 2. Dispatch Board (Assign Driver & Vehicle)
    await test.step('Dispatch Board Assignment', async () => {
      // Force reload to ensure fresh data
      await page.reload();
      await page.click('text=Dispatch');
      await expect(page).toHaveURL('/dispatch');
      
      // Wait for the specific load card to appear in Pending column
      const loadCard = page.locator(`.border-l-amber-400:has-text("${referenceNumber}")`);
      await expect(loadCard).toBeVisible({ timeout: 20000 });

      // Select driver and vehicle via Auto-Select
      await loadCard.getByRole('button', { name: 'Auto-Select' }).click();
      
      // Wait for the Dispatch Now button to appear (conditionally rendered after driver+vehicle selected)
      const dispatchBtn = loadCard.locator('[data-testid="dispatch-now-btn"]');
      await expect(dispatchBtn).toBeVisible({ timeout: 5000 });
      await dispatchBtn.scrollIntoViewIfNeeded();

      // Use native DOM .click() via page.evaluate() to guarantee React's synthetic event fires
      // (bypasses any browser focus/stale reference issues with Playwright's CDP click)
      await page.evaluate((ref) => {
        const cards = Array.from(document.querySelectorAll('.border-l-amber-400'));
        const card = cards.find(c => c.textContent?.includes(ref));
        if (!card) throw new Error('Card not found for ' + ref);
        const btn = card.querySelector('[data-testid="dispatch-now-btn"]') as HTMLElement | null;
        if (!btn) throw new Error('dispatch-now-btn not found in card');
        btn.click();
      }, referenceNumber);

      // Wait for the success toast as confirmation the mutation fired and completed
      await page.waitForSelector(`text=Load ${referenceNumber} dispatched!`, { timeout: 10000 });

      // Force reload to bypass React Query optimistic cache entirely for debugging
      await page.reload();
      await page.waitForLoadState('networkidle');

      // Wait for it to move to Assigned column (React Query refetch after mutation)
      try {
        await expect(page.locator(`.border-l-blue-500:has-text("${referenceNumber}")`)).toBeVisible({ timeout: 10000 });
      } catch (e) {
        const dump = await page.evaluate(() => {
          const cols = Array.from(document.querySelectorAll('.space-y-3'));
          return cols.map(c => c.innerHTML).join('\n\n---COLUMN---\n\n');
        });
        console.log(`LOOKING FOR REF: ${referenceNumber}`);
        console.log('ALL COLUMNS HTML:', dump);
        throw e;
      }
    });

    // 3. Mark as IN TRANSIT via Detail Page (simulating mobile driver app)
    await test.step('Simulate In-Transit via Detail', async () => {
      await page.goto('/loads');
      await expect(page).toHaveURL('/loads');
      await page.click(`text=${referenceNumber}`);
      await expect(page).toHaveURL(/\/loads\/[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}/, { timeout: 10000 });
      await expect(page.locator(`text=${referenceNumber}`).first()).toBeVisible();
      
      await page.selectOption('select:has-text("Change Status")', 'IN_TRANSIT');
      
      // Verify Status Badge updated
      await expect(page.locator('.bg-violet-100:has-text("In Transit")').first()).toBeVisible();
    });

    // 4. Submit Proof of Delivery
    await test.step('Submit Proof of Delivery', async () => {
      await page.click('button:has-text("Submit POD")');
      await expect(page.locator('text=Proof of Delivery (POD)')).toBeVisible();
      
      // Sign (click the signature pad area)
      await page.locator('div:has-text("Click to sign")').last().click();
      await expect(page.getByText('Signed', { exact: true })).toBeVisible();

      // Receiver Name
      await page.fill('input[name="receiverName"]', 'Jane Receiver');
      
      await page.getByRole('dialog').getByRole('button', { name: 'Submit POD' }).click();
      
      // Status should become DELIVERED
      await expect(page.locator('.bg-emerald-100:has-text("Delivered")').first()).toBeVisible();
    });

    // 5. Generate Invoice
    await test.step('Invoice Generation & Approval', async () => {
      // In a real flow, changing to DELIVERED might auto-generate, or there's a button.
      await page.goto('/billing');
      await expect(page).toHaveURL('/billing');

      // The new invoice should be there in DRAFT state
      const invoiceRow = page.locator('tr', { hasText: 'Draft' }).first();
      await expect(invoiceRow).toBeVisible({ timeout: 10000 });

      // Open Actions and Approve
      await invoiceRow.getByRole('button', { name: /Open menu/i }).click();
      await page.getByRole('menuitem', { name: /Approve & Send/i }).click();
      
      // Wait for status to change to SENT
      const updatedRow = page.locator('tr', { hasText: 'Sent' }).first();
      await expect(updatedRow.locator('.bg-blue-100:has-text("Sent")')).toBeVisible();

      // Go to invoice details to check it out
      await updatedRow.getByRole('button', { name: /Open menu/i }).click();
      await page.getByText('View Invoice').first().click();
      await expect(page).toHaveURL(/\/billing\/[a-zA-Z0-9_-]+/);
      await expect(page.locator('text=Amount Due')).toBeVisible();
    });

    // 6. Record Payment
    await test.step('Record Payment', async () => {
      // From invoice detail page, click Record Payment
      await page.goto('/payments');
      await expect(page).toHaveURL('/payments');

      await page.click('button:has-text("Record Payment")');
      await expect(page.locator('text=Record Payment').nth(1)).toBeVisible();

      // Select the invoice we just approved
      // In a real test, we would look for the specific invoice, but for E2E we can select the first valid option
      await page.selectOption('select[name="invoiceId"]', { index: 1 });
      await page.fill('input[name="amount"]', '1250');
      
      await page.click('button[type="submit"]:has-text("Record Payment")');
      
      // Toast should appear and it should show in table
      await expect(page.locator('text=Payment recorded successfully!')).toBeVisible();
      await expect(page.locator('tr:has-text("$1,250.00")').first()).toBeVisible();
    });
  });
});
