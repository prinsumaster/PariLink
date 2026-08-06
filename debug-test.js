const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ baseURL: 'http://localhost:3000' });
  const page = await context.newPage();

  page.on('console', msg => {
    console.log('BROWSER:', msg.type(), msg.text());
  });

  page.on('request', req => {
    if (req.url().includes('/backend')) {
      console.log('->', req.method(), req.url());
    }
  });

  page.on('response', async res => {
    if (res.url().includes('/backend')) {
      const text = await res.text();
      console.log('<-', res.status(), res.url(), text.substring(0, 200));
    }
  });

  // Login
  await page.goto('/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('/dashboard');

  // Go to Dispatch Board
  await page.goto('/dispatch');
  
  // Wait for board to load
  await page.waitForTimeout(2000);

  const ref = 'LD-DEBUG-' + Date.now();
  console.log('Using reference:', ref);

  const pendingCard = page.locator('.border-l-amber-400').first();
  if (await pendingCard.count() === 0) {
    console.log('No pending loads found. Cannot debug.');
    process.exit(0);
  }

  const loadText = await pendingCard.innerText();
  console.log('Found pending load:', loadText.split('\n')[0]);

  await pendingCard.getByRole('button', { name: 'Auto-Select' }).click();
  
  const dispatchBtn = pendingCard.locator('[data-testid="dispatch-now-btn"]');
  await dispatchBtn.waitFor({ state: 'visible', timeout: 5000 });

  console.log('Clicking Dispatch Now...');
  await page.evaluate(() => {
    const btn = document.querySelector('[data-testid="dispatch-now-btn"]');
    btn.click();
  });

  await page.waitForTimeout(3000);

  const newText = await page.locator(`.border-l-blue-500:has-text("${loadText.split('\n')[0]}")`).count();
  console.log('Is it in the assigned column?', newText > 0 ? 'YES' : 'NO');
  
  const isStillInPending = await page.locator(`.border-l-amber-400:has-text("${loadText.split('\n')[0]}")`).count();
  console.log('Is it still in pending column?', isStillInPending > 0 ? 'YES' : 'NO');

  await browser.close();
})();
