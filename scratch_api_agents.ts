import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ storageState: 'apps/web/tests/.auth/user.json' });
  const page = await context.newPage();
  
  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));
  
  await page.goto('http://localhost:3000/ai/agents');
  await page.waitForTimeout(2000);
  
  await browser.close();
})();
