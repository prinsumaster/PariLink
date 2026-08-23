import { chromium, type FullConfig } from '@playwright/test';

async function globalSetup(config: FullConfig) {
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();
  
  page.on('response', response => {
    if (response.url().includes('login')) {
      console.log('LOGIN RESPONSE STATUS:', response.status());
      response.text().then(text => console.log('LOGIN RESPONSE BODY:', text)).catch(() => {});
    }
  });

  await page.goto('http://localhost:3000/login');
  
  try {
    await page.waitForSelector('input[type="email"]', { timeout: 30000 });
  } catch (e) {
    const html = await page.content();
    console.error('FAILED TO FIND INPUT. Page HTML:', html);
    throw e;
  }
  
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'Password123!'); 
  await page.click('button[type="submit"]');
  
  try {
    await page.waitForURL(/.*dashboard.*/, { timeout: 30000 });
  } catch (e) {
    const errorText = await page.locator('.text-red-700').textContent().catch(() => 'No error div');
    console.log('UI ERROR TEXT:', errorText);
    throw new Error('Timeout waiting for dashboard');
  }
  
  const state = await page.context().storageState();
  if (!state.cookies.length) throw new Error('LOGIN FAILED - no cookies');
  
  await page.context().storageState({ path: 'tests/.auth/user.json' });
  await browser.close();
}
export default globalSetup;
