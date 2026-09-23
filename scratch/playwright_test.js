const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  console.log('Starting Playwright test...');
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('BROWSER ERROR:', err));

  try {
    // 1. Login
    console.log('Logging in...');
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/dashboard', { timeout: 10000 });
    console.log('Login successful.');

    // 2. Navigate to Workshop List
    console.log('Navigating to Workshop...');
    await page.goto('http://localhost:3000/workshop');
    await page.waitForTimeout(4000);
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/screenshot_workshop_list.png' });
    console.log('Workshop list rendered and screenshot saved.');

    // 3. Click first job card
    console.log('Clicking first job card...');
    const jobCardLink = await page.$('.grid a');
    if (jobCardLink) {
      await jobCardLink.click();
      await page.waitForTimeout(4000);
      await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/screenshot_jobcard_detail.png' });
      console.log('Job card detail rendered and screenshot saved.');
    } else {
      console.log('No job card links found in the list!');
    }

    // 4. Navigate to New Job Card
    console.log('Navigating to New Job Card...');
    await page.goto('http://localhost:3000/workshop/new');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/screenshot_workshop_new_jc.png' });
    console.log('New Job Card form rendered and screenshot saved.');

    // 5. Navigate to New Tyre Log
    console.log('Navigating to New Tyre Log...');
    await page.goto('http://localhost:3000/workshop/tyre-log/new');
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/screenshot_workshop_new_tyrelog.png' });
    console.log('New Tyre Log form rendered and screenshot saved.');

    // 6. Cross-tenant check
    console.log('Logging out and testing cross-tenant access...');
    await context.clearCookies();
    await page.goto('http://localhost:3000/login');
    await page.fill('input[type="email"]', 'admin_b@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    await page.waitForURL('http://localhost:3000/dashboard', { timeout: 10000 });

    const tenantAJobCardId = 'a0000000-0000-0000-0000-000000000001';
    console.log(`Tenant B navigating to Tenant A JobCard: ${tenantAJobCardId}`);
    
    await page.goto(`http://localhost:3000/workshop/${tenantAJobCardId}`);
    await page.waitForTimeout(3000);
    await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/6aee53ff-b35c-463d-a5d3-ea7c7e48b6a1/screenshot_cross_tenant.png' });
    
    const bodyText = await page.innerText('body');
    if (bodyText.includes('Job Card not found') || bodyText.includes('404')) {
      console.log('Cross-tenant 404 successfully rendered in UI.');
    } else {
      console.log('WARNING: Cross-tenant 404 might not have rendered correctly.');
    }

  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await browser.close();
  }
})();
