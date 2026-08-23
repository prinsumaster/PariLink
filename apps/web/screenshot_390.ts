import { chromium } from 'playwright';
import * as fs from 'fs';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await Promise.all([
    page.waitForURL(/dashboard/),
    page.click('button[type="submit"]')
  ]);

  const routes = [
    { url: '/dashboard', name: 'dashboard-390' },
    { url: '/dispatch', name: 'dispatch-390' },
    { url: '/loads', name: 'loads-390' },
    { url: '/fleet', name: 'fleet-390' },
    { url: '/finance', name: 'finance-390' },
    { url: '/admin/users', name: 'admin-users-390' },
    { url: '/tracking', name: 'tracking-390' },
    { url: '/tracking', name: 'tracking-1440', width: 1440, height: 900 }
  ];

  for (const r of routes) {
    if (r.width) {
      await page.setViewportSize({ width: r.width, height: r.height });
    } else {
      await page.setViewportSize({ width: 390, height: 844 });
    }
    await page.goto(`http://localhost:3000${r.url}`);
    await page.waitForTimeout(2000); // wait for render
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/${r.name}.png` });
    console.log(`Saved ${r.name}.png`);
  }
  
  await browser.close();
}
main().catch(console.error);
