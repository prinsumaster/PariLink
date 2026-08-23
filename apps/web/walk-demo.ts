import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1000);
  await page.screenshot({ path: 'demo-login-1440.png' });
  console.log('login -> No rows (Login screen)');

  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await Promise.all([
    page.waitForURL(/dashboard/),
    page.click('button[type="submit"]')
  ]);

  const routes = [
    { url: '/dashboard', name: 'dashboard' },
    { url: '/dispatch', name: 'dispatch' },
    { url: '/loads', name: 'loads' },
    { url: '/fleet', name: 'fleet' },
    { url: '/finance', name: 'finance' },
    { url: '/admin/users', name: 'admin-users' }
  ];

  for (const r of routes) {
    await page.goto(`http://localhost:3000${r.url}`);
    await page.waitForTimeout(2000); // wait for render and data
    await page.screenshot({ path: `demo-${r.name}-1440.png` });
    
    // Count table rows (tr inside tbody) or cards if no table
    let rows = await page.locator('tbody tr').count();
    if (rows === 0) {
      // maybe it's a grid of cards?
      rows = await page.locator('.grid > div').count();
    }
    console.log(`${r.name} -> ${rows} rows`);
  }
  
  await browser.close();
}
main().catch(console.error);
