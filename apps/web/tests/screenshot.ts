import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
// @ts-ignore: reserved
const _API_URL = 'http://localhost:8080';

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
  const page = await context.newPage();

  console.log('Logging in...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(3000);
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.waitForLoadState('networkidle');
  await page.click('button[type="submit"]');
  await page.waitForURL(`${BASE_URL}/dashboard`, { timeout: 120000 });
  await page.waitForTimeout(3000); // wait for data to load
  await page.screenshot({ path: 'dashboard-fixed.png', fullPage: true });

  console.log('Taking operations screenshot...');
  await page.goto(`${BASE_URL}/operations`, { waitUntil: 'domcontentloaded', timeout: 120000 });
  await page.waitForTimeout(5000); // Wait for API calls to settle
  await page.screenshot({ path: 'operations-fixed.png', fullPage: true });

  console.log('Screenshots saved!');
  await browser.close();
}
run();
