const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

async function run() {
  console.log('Launching browser...');
  const browser = await chromium.launch();
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Login
  console.log('Logging in...');
  await page.goto('http://localhost:3000/login');
  await page.waitForTimeout(1000);
  
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.waitForTimeout(2000);
  
  console.log('Navigating to Trips...');
  await page.goto('http://localhost:3000/trips');
  await page.waitForTimeout(3000);
  
  // Click on the first trip link to go to trip details
  console.log('Clicking on first trip...');
  const firstTripLink = await page.$('a[href^="/trips/"]');
  if (firstTripLink) {
    await firstTripLink.click();
    await page.waitForTimeout(3000);
    
    // Scroll down to the Trip Reviews panel
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    console.log('Capturing Trip Review Panel...');
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/trip_review_panel.png' });
  } else {
    console.log('No trips found!');
  }

  console.log('Navigating to Drivers...');
  await page.goto('http://localhost:3000/drivers');
  await page.waitForTimeout(3000);
  
  // Click on the first driver link
  console.log('Clicking on first driver...');
  const firstDriverLink = await page.$('a[href^="/drivers/"]');
  if (firstDriverLink) {
    await firstDriverLink.click();
    await page.waitForTimeout(3000);
    
    // Scroll down to the Driver Scorecard panel
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1000);
    
    console.log('Capturing Driver Scorecard Panel...');
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/driver_scorecard_panel.png' });
  } else {
    console.log('No drivers found!');
  }

  await browser.close();
  console.log('Done!');
}
run().catch(console.error);
