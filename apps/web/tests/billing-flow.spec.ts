import { test } from '@playwright/test';

test.use({ storageState: 'tests/.auth/user.json' });

test('Debug trips page', async ({ page }) => {
  await page.goto('/trips');
  await page.waitForTimeout(3000);
  const text = await page.locator('tbody').innerText();
  console.log('TBODY TEXT:', text);
  const btnCount = await page.locator('button[role="checkbox"]').count();
  console.log('CHECKBOX COUNT:', btnCount);
});
