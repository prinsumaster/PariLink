const { chromium } = require('@playwright/test');

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'Password123!');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard**');

  // Warm up cache
  await page.goto('http://localhost:3000/admin/users');
  await page.waitForSelector('tbody tr');
  
  // Measure 3 times
  let total = 0;
  for(let i=0; i<3; i++) {
    // Navigate away
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForSelector('h1');
    
    // Navigate and measure
    const start = Date.now();
    await page.goto('http://localhost:3000/admin/users');
    await page.waitForSelector('tbody tr', { state: 'visible' });
    const elapsed = Date.now() - start;
    console.log(`Run ${i+1}: ${elapsed}ms`);
    total += elapsed;
  }
  
  console.log(`Average: ${Math.round(total/3)}ms to rows`);
  await browser.close();
}

run().catch(console.error);
