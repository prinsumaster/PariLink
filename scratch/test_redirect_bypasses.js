const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  
  const testPayload = async (name, payload, expectedPathname) => {
    console.log(`\n--- Test: ${name} ---`);
    const context = await browser.newContext();
    const page = await context.newPage();
    const url = `http://localhost:3000/login?callbackUrl=${payload}`;
    await page.goto(url);
    console.log(`Visited ${url}`);
    
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    try {
      await page.waitForFunction(() => !window.location.href.includes('/login'), { timeout: 10000 });
    } catch (e) {
      console.log(`Navigation timed out for payload: ${payload}`);
      await page.screenshot({ path: `/Users/vishalvirda/Desktop/PariLink/scratch/debug_${name.replace(/ /g, '_')}.png` });
    }
    console.log(`After login, final URL: ${page.url()}`);
    await context.close();
    
    // Sleep to avoid rate limiting (5 req / 60s limit -> wait 12s between each)
    console.log('Waiting 12s to respect rate limits...');
    await new Promise(r => setTimeout(r, 12000));
  };

  try {
    await testPayload('Positive Control 1a', '/dashboard/admin/audit');
    await testPayload('Bypass 1: Backslash', '/\\evil.com');
    await testPayload('Bypass 2: Encoded Tab', '/%09/evil.com');
    await testPayload('Bypass 3: Double Slash', '//evil.com');
    await testPayload('Bypass 4: Absolute URL', 'https://example.com');
    await testPayload('Bypass 5: Javascript URI', 'javascript:alert(1)');
  } catch (e) {
    console.error('Test Failed:', e.message);
  } finally {
    await browser.close();
  }
})();
