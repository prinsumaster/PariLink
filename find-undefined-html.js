const { chromium } = require('playwright');
(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.goto('http://localhost:3000/login');
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'admin123');
  await page.click('button[type="submit"]');
  await page.waitForNavigation();
  
  await page.goto('http://localhost:3000/operations', { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1000);
  
  const buttons = await page.$$('button, a[role="button"], div[role="tab"], [role="tab"]');
  for (const btn of buttons) {
    const text = await btn.innerText().catch(() => '');
    if (['Health', 'Metrics', 'Incidents', 'Backup', 'Logs', 'Traces', 'Overview'].some(t => text.includes(t))) {
      console.log("Clicking tab:", text);
      await btn.click({ timeout: 1000 }).catch(e => console.log("click err"));
      await page.waitForTimeout(1000);
      
      const innerHTML = await page.evaluate(() => document.body.innerHTML);
      const innerText = await page.evaluate(() => document.body.innerText);
      
      if (innerHTML.includes('undefined')) {
         console.log(`Found undefined in HTML of tab ${text}`);
         let idx = innerHTML.indexOf('undefined');
         while (idx !== -1) {
             const snippet = innerHTML.substring(Math.max(0, idx - 80), Math.min(innerHTML.length, idx + 80));
             if (!snippet.includes('<script')) {
                 console.log(`Snippet HTML: ...${snippet}...`);
             }
             idx = innerHTML.indexOf('undefined', idx + 1);
         }
      }
      
      if (innerText.includes('undefined')) {
         console.log(`Found undefined in TEXT of tab ${text}`);
         let idx = innerText.indexOf('undefined');
         while (idx !== -1) {
             const snippet = innerText.substring(Math.max(0, idx - 80), Math.min(innerText.length, idx + 80));
             console.log(`Snippet TEXT: ...${snippet}...`);
             idx = innerText.indexOf('undefined', idx + 1);
         }
      }
    }
  }
  await browser.close();
})();
