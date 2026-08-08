import { chromium } from 'playwright';

(async () => {
  console.log('Starting Playwright...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('console', msg => {
    if (msg.type() === 'error') console.log('BROWSER ERROR:', msg.text());
  });

  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  await page.waitForURL('**/dashboard', { timeout: 10000 });
  
  console.log('Navigating to /loads/new...');
  await page.goto('http://localhost:3000/loads/new');
  await page.waitForLoadState('networkidle');

  console.log('Form Page Title:', await page.locator('h1').textContent().catch(()=>null));
  
  console.log('Filling Load form...');
  await page.fill('input[name="origin"]', 'Atlanta, GA').catch(()=>{});
  await page.fill('input[name="destination"]', 'Dallas, TX').catch(()=>{});
  // The load form might have different fields, I'll take a screenshot
  await page.screenshot({ path: '/tmp/loads_new_page.png' });
  
  await browser.close();
})();
