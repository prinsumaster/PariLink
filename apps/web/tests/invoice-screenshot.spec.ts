import { test } from '@playwright/test';

test('Invoice screens', async ({ page }) => {
  // Go to invoice detail
  await page.goto('http://localhost:3000/billing/b69d6fc5-5376-4e1a-ae77-d2cac9aaf1a3');
  await page.waitForTimeout(4000);
  
  // Take screenshot 1
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/10_invoice_detail_generated.png', fullPage: true });
  
  // Go to billing list
  await page.goto('http://localhost:3000/billing');
  await page.waitForTimeout(4000);
  
  // Take screenshot 2
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/11_invoices_list.png', fullPage: true });
});
