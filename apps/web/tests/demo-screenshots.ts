import { chromium } from 'playwright';

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8080';
const ARTIFACT_DIR = '/Users/vishalvirda/.gemini/antigravity-ide/brain/21fd906c-ff50-491b-9a46-d59f675d4a71';

async function login() {
  const res = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  const d = await res.json();
  return { token: d.access_token, user: d.user };
}

async function main() {
  const { token, user } = await login();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  // Set auth before any navigation
  await page.goto(`${BASE_URL}/login`);
  await page.waitForLoadState('networkidle');
  
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: { token, isAuthenticated: true, user, tenantId: user.companyId },
      version: 0
    }));
  }, { token, user });

  // Screenshot: Reports
  await page.goto(`${BASE_URL}/reports`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/reports-charts.png` });
  console.log('✅ Saved: reports-charts.png');

  // Screenshot: Dashboard (Live Map)
  await page.goto(`${BASE_URL}/dashboard`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(6000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/live-map.png` });
  console.log('✅ Saved: live-map.png');

  // Screenshot: Billing (no crash)
  await page.goto(`${BASE_URL}/billing`);
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(5000);
  await page.screenshot({ path: `${ARTIFACT_DIR}/billing-no-error.png` });
  console.log('✅ Saved: billing-no-error.png');

  await browser.close();
  console.log('All screenshots saved.');
}

main().catch(e => { console.error(e); process.exit(1); });
