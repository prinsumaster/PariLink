import { chromium } from 'playwright';

async function main() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await Promise.all([
    page.waitForURL(/dashboard/),
    page.click('button[type="submit"]')
  ]);

  const routes = [
    '/ai/agents',
    '/announcements',
    '/control-tower'
  ];

  for (const r of routes) {
    let boundaryCount = 0;
    let pageError = 0;
    
    page.on('console', msg => {
      if (msg.type() === 'error' && msg.text().includes('React Error Boundary')) boundaryCount++;
    });
    page.on('pageerror', () => pageError++);

    const response = await page.goto(`http://localhost:3000${r}`);
    await page.waitForTimeout(2000); // wait for render
    
    const body = await page.content();
    const h1 = await page.locator('h1').first().textContent().catch(() => 'No H1');
    
    console.log(`URL: ${page.url()}`);
    console.log(`Status: ${response?.status()}`);
    console.log(`Body Length: ${body.length}`);
    console.log(`H1: ${h1?.trim()}`);
    console.log(`Boundary Count: ${boundaryCount}`);
    console.log(`Page Error: ${pageError}`);
    console.log('---');
    
    page.removeAllListeners('console');
    page.removeAllListeners('pageerror');
  }
  
  await browser.close();
}
main().catch(console.error);
