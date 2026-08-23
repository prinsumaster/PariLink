import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: 'apps/web/tests/.auth/user.json',
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();
  
  const routes = [
    { url: '/dashboard', name: 'dashboard' },
    { url: '/dispatch', name: 'dispatch' },
    { url: '/loads', name: 'loads' },
    { url: '/fleet', name: 'fleet' },
    { url: '/finance', name: 'finance' },
    { url: '/admin/users', name: 'admin-users' }
  ];

  for (const r of routes) {
    console.log(`Visiting ${r.name}...`);
    await page.goto(`http://localhost:3000${r.url}`);
    await page.waitForLoadState('networkidle');
    await page.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/${r.name}-1440.png`, fullPage: true });
    
    // Count rows (assuming tables use standard tr or similar grid rows)
    const rowCount = await page.evaluate(() => {
      // Find tables
      const trs = document.querySelectorAll('tbody tr');
      if (trs.length > 0) return trs.length;
      // Find cards/lists if no table
      const cards = document.querySelectorAll('[class*="border"][class*="rounded-xl"]');
      return cards.length;
    });
    console.log(`${r.name}: ${rowCount} items`);
  }
  
  // Mobile dispatch
  const mobileContext = await browser.newContext({
    storageState: 'apps/web/tests/.auth/user.json',
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true
  });
  const mobilePage = await mobileContext.newPage();
  console.log('Visiting dispatch (mobile)...');
  await mobilePage.goto('http://localhost:3000/dispatch');
  await mobilePage.waitForLoadState('networkidle');
  await mobilePage.screenshot({ path: `/Users/vishalvirda/.gemini/antigravity-ide/brain/bd8875cf-b40d-487e-817e-01304edd682b/dispatch-390.png`, fullPage: true });
  
  await browser.close();
}
main().catch(console.error);
