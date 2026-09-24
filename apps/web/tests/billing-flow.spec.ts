import { test, expect } from '@playwright/test';

test.use({ storageState: 'tests/.auth/user.json' });

test('Invoice generation flow via UI', async ({ page }) => {
  test.setTimeout(60000); 
  
  // 1. Navigate to trips
  await page.goto('/trips');
  await page.waitForTimeout(4000); // Give time for table to populate
  
  // 2. Select the first trip
  const checkbox = page.locator('[data-slot="checkbox"]').nth(1);
  await checkbox.waitFor({ state: 'visible' });
  await checkbox.click({ force: true });
  await page.waitForTimeout(1000);
  
  // 3. Click Generate Invoice button
  const generateBtn = page.locator('button:has-text("Generate Invoice")').first();
  await expect(generateBtn).toBeVisible();
  await generateBtn.click({ force: true });
  
  // 4. Fill customer ID in modal and submit
  // We use a dynamically fetched or known valid customer ID for the latest seeded trips
  const customerInput = page.locator('input[placeholder*="Enter customer ID"]');
  await expect(customerInput).toBeVisible();
  await customerInput.fill('cust-inter-1790262303270');

  const submitBtn = page.locator('div[role="dialog"] button:has-text("Generate Invoice")').first();
  await expect(submitBtn).toBeVisible();
  await submitBtn.click({ force: true });
  
  // 5. Expect to be redirected to the new invoice detail page (/billing/[id])
  await page.waitForURL('**/billing/**', { timeout: 15000 });
  await page.waitForTimeout(2000); // wait for rendering
  
  // 6. Final UI validation screenshot
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/18_real_ui_invoice_flow_success.png', fullPage: true });
});
