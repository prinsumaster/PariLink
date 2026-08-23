const { chromium } = require('@playwright/test');

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Login cleanly
  await page.goto('http://localhost:3000/login');
  
  // wait for input OR dashboard
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 5000 });
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
  } catch(e) {
    console.log("Already logged in or no input.");
  }
  
  await page.waitForURL('**/dashboard**', { timeout: 10000 });

  // Warm up cache
  await page.goto('http://localhost:3000/admin/users');
  await page.waitForSelector('tbody tr', { state: 'visible', timeout: 10000 });
  
  // Measure 3 times
  let total = 0;
  for(let i=0; i<3; i++) {
    await page.goto('http://localhost:3000/dashboard');
    await page.waitForSelector('h1');
    
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
