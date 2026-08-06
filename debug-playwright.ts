import { chromium } from 'playwright';
async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3001/billing');
  await page.waitForTimeout(5000);
  const rows = await page.locator('tr').allInnerTexts();
  console.log(rows);
  await browser.close();
}
run();
