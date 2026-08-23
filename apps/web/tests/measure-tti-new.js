const { chromium } = require('@playwright/test');
const path = require('path');

async function run() {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    storageState: path.join(__dirname, '.auth', 'user.json')
  });
  const page = await context.newPage();

  // Warm up cache
  await page.goto('http://localhost:3000/admin/users');
  await page.waitForSelector('tbody tr', { state: 'visible' });
  
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
