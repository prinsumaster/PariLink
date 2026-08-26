import { test, expect } from '@playwright/test';

/**
 * populated.spec.ts — asserts that key demo screens actually SHOW data rows.
 * Requires the rich seed to have been run first.
 */

const POPULATED_ROUTES: Array<{
  route: string;
  // Text that must appear in the page for it to be "populated"
  mustContain: string[];
}> = [
  { route: '/customers',     mustContain: ['Tata Motors', 'Reliance Retail', 'Amul'] },
  { route: '/fleet',         mustContain: ['MH-04-AB-1234', 'DL-1L-BC-9876', 'GJ-01-AB-5678'] },
  { route: '/drivers',       mustContain: ['Raju', 'Amit', 'Bhavesh'] },
  { route: '/loads',         mustContain: ['LOD-IND-100', 'Pune', 'Mumbai'] },
  { route: '/trips',         mustContain: ['TRP-IND-100', 'IN_TRANSIT', 'COMPLETED'] },
  { route: '/payments',      mustContain: ['45,000', '72,000'] },
  { route: '/vendors',       mustContain: ['Sharma Transport', 'Speedways'] },
  { route: '/gst/rules',     mustContain: ['9965', 'Transport'] },
  { route: '/vehicles/permits', mustContain: ['NP-MH-2024', 'NATIONAL_PERMIT'] },
  { route: '/dashboard',     mustContain: ['Command Center'] },
];

test('Populated screen check — key demo routes show real data', async ({ page }) => {
  test.setTimeout(300000);

  const failures: string[] = [];

  for (const { route, mustContain } of POPULATED_ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(3000); // wait for data to load

    const text = await page.evaluate(() => document.body.innerText);

    const missing = mustContain.filter(s => !text.includes(s));
    if (missing.length > 0) {
      // Try waiting longer for slow queries
      await page.waitForTimeout(3000);
      const text2 = await page.evaluate(() => document.body.innerText);
      const stillMissing = mustContain.filter(s => !text2.includes(s));
      if (stillMissing.length > 0) {
        failures.push(`[FAIL] ${route} — missing: ${stillMissing.join(', ')}`);
        console.log(`[FAIL] ${route} — missing: ${stillMissing.join(', ')}`);
      } else {
        console.log(`[PASS] ${route}`);
      }
    } else {
      console.log(`[PASS] ${route}`);
    }
  }

  if (failures.length > 0) {
    throw new Error(`Populated screen check failures:\n${failures.join('\n')}`);
  }
});
