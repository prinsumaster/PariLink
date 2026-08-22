const { chromium } = require('playwright');
const fs = require('fs');
const path = require('path');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  
  // Motion 1: Login Route-Draw Animation
  console.log('Capturing Login Animation Frames...');
  const page1 = await context.newPage();
  
  // Disable cache to see animation on initial load
  await page1.route('**/*', (route) => route.continue());
  
  // Frame 1: Immediately after load
  page1.goto('http://localhost:3000/login');
  await page1.waitForTimeout(50); 
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/motion_login_frame1.png', fullPage: true });
  
  // Frame 2: Mid animation
  await page1.waitForTimeout(400); 
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/motion_login_frame2.png', fullPage: true });
  
  // Frame 3: Final state
  await page1.waitForTimeout(1000); 
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/motion_login_frame3.png', fullPage: true });

  // Login to get access for Dispatch
  await page1.fill('input[name="email"]', 'admin@vanguard.com');
  await page1.fill('input[name="password"]', 'password123');
  await Promise.all([
    page1.waitForNavigation({ waitUntil: 'networkidle' }),
    page1.click('button[type="submit"]')
  ]);

  // Motion 2: Dispatch Marker Moving
  console.log('Capturing Dispatch Marker Frames...');
  await page1.goto('http://localhost:3000/dispatch', { waitUntil: 'domcontentloaded' });
  await page1.waitForTimeout(2000); // let map load

  // Frame 1: Initial state
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/motion_dispatch_frame1.png', fullPage: true });
  
  // Wait for vehicle location replay to move markers
  await page1.waitForTimeout(1500); 
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/motion_dispatch_frame2.png', fullPage: true });
  
  await page1.waitForTimeout(1500); 
  await page1.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/15556009-df23-426a-ac28-2f631428aae3/motion_dispatch_frame3.png', fullPage: true });

  await browser.close();
})();
