import { test, expect } from '@playwright/test';

test.describe('Action Motion Proofs', () => {
  test.setTimeout(120000);

  test.beforeEach(async ({ page }) => {
    // Login cleanly
    await page.goto('http://localhost:3000/login');
    try {
      await page.waitForSelector('input[type="email"]', { timeout: 5000 });
      await page.fill('input[type="email"]', 'admin@parilink.com');
      await page.fill('input[type="password"]', 'password123');
      await page.click('button[type="submit"]');
    } catch(e) {}
    await page.waitForURL('**/dashboard**');
  });

  const captureFrames = async (page, prefix, actionFunc) => {
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/${prefix}-frame1.png` });
    const actionPromise = actionFunc();
    await page.waitForTimeout(50);
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/${prefix}-frame2.png` });
    await page.waitForTimeout(350);
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/${prefix}-frame3.png` });
    await actionPromise;
  };

  test('Dispatch Trip Success & Rollback', async ({ page }) => {
    await page.goto('http://localhost:3000/trips');
    await page.click('tbody tr:first-child');
    await page.waitForSelector('text=Dispatch Trip');
    
    // SUCCESS
    await captureFrames(page, 'dispatch-success', async () => {
      await page.click('text=Dispatch Trip');
    });

    // Wait for the UI state to settle
    await page.waitForTimeout(1000);
    
    // Navigate back to trips for another row
    await page.goto('http://localhost:3000/trips');
    await page.waitForTimeout(1000);
    // Click the second row if possible, else just first
    const rows = await page.$$('tbody tr');
    if (rows.length > 1) {
      await rows[1].click();
    } else {
      await rows[0].click();
    }
    await page.waitForSelector('text=Dispatch Trip');
    
    // ROLLBACK
    await page.route('**/api/trips/**', async (route) => {
      if (route.request().method() === 'PATCH' || route.request().method() === 'PUT') {
        await route.fulfill({ status: 400, body: 'Bad Request' });
      } else {
        await route.continue();
      }
    });

    await captureFrames(page, 'dispatch-rollback', async () => {
      await page.click('text=Dispatch Trip');
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/dispatch-rollback-frame4.png` });
  });

  test('Delete Document Success & Rollback', async ({ page }) => {
    await page.goto('http://localhost:3000/documents');
    await page.waitForSelector('tbody tr');
    
    // SUCCESS
    await captureFrames(page, 'delete-doc-success', async () => {
      const deleteBtn = await page.$('button[aria-label="Delete document"]');
      if (deleteBtn) await deleteBtn.click();
    });

    await page.waitForTimeout(2000);

    // ROLLBACK
    await page.route('**/api/documents/**', async (route) => {
      if (route.request().method() === 'DELETE') {
        await route.fulfill({ status: 400, body: 'Bad Request' });
      } else {
        await route.continue();
      }
    });

    await captureFrames(page, 'delete-doc-rollback', async () => {
      const deleteBtns = await page.$$('button[aria-label="Delete document"]');
      if (deleteBtns.length > 0) await deleteBtns[0].click();
    });
    await page.waitForTimeout(1000);
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/delete-doc-rollback-frame4.png` });
  });
});
