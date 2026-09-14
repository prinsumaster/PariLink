import { test } from '@playwright/test';

const POPULATED_ROUTES: Array<{
  route: string;
  mustContain: string[];
}> = [
  { route: '/customers',  mustContain: ['Tata Motors', 'Reliance Retail'] },
  { route: '/fleet',      mustContain: ['MH-04-AB-1234'] },
  { route: '/drivers',    mustContain: ['Raju'] },
  { route: '/loads',      mustContain: ['LOD'] },
  { route: '/trips',      mustContain: ['In Transit'] },
  { route: '/vendors',    mustContain: ['Speedways'] },
  { route: '/gst/rules',  mustContain: ['9965'] },
  { route: '/vehicles/permits', mustContain: ['NATIONAL_PERMIT'] },
  { route: '/dashboard',  mustContain: ['Command Center'] },
];

test('Populated screen check — key demo routes show real data', async ({ page }) => {
  test.setTimeout(300000);

  const failures: string[] = [];

  for (const { route, mustContain } of POPULATED_ROUTES) {
    await page.goto(route);
    await page.waitForTimeout(4000);

    const text = await page.evaluate(() => document.body.innerText);
    const missing = mustContain.filter(s => !text.includes(s));

    if (missing.length > 0) {
      await page.waitForTimeout(4000);
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
