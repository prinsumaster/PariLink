import { chromium } from 'playwright';

const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:8080';

async function getAuthToken() {
  const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  const data = await loginRes.json();
  return { token: data.access_token, user: data.user };
}

async function main() {
  const { token, user } = await getAuthToken();
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();
  
  // Go to root to set localStorage
  await page.goto(`${BASE_URL}`);
  
  await page.evaluate(({ token, user }) => {
    localStorage.setItem('auth-storage', JSON.stringify({
      state: {
        token,
        isAuthenticated: true,
        user,
        tenantId: user.companyId
      },
      version: 0
    }));
  }, { token, user });
  
  await page.goto(`${BASE_URL}/dispatch-workspace`);
  
  await page.waitForTimeout(6000);
  
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/21fd906c-ff50-491b-9a46-d59f675d4a71/dispatch_map_1440.png' });
  
  console.log('\n--- VERIFYING MOVEMENT ---');
  for (let i = 0; i <= 4; i += 2) {
    const data = await page.evaluate(() => {
      return {
        fleetData: (window as any).__TEST_FLEET_DATA__,
        positions: (window as any).__TEST_FLEET_POSITIONS__
      };
    });
    
    if (data.positions && Object.keys(data.positions).length > 0) {
      const vehicleId = Object.keys(data.positions)[0];
      const pos = data.positions[vehicleId];
      console.log(`[t=${i}s] Vehicle ${vehicleId} coords: lat=${pos.lat.toFixed(6)}, lng=${pos.lng.toFixed(6)}`);
    } else {
      console.log(`[t=${i}s] No positions. FleetData size: ${data.fleetData ? data.fleetData.length : 'undefined'}`);
    }
    if (i < 4) await page.waitForTimeout(2000);
  }
  
  await page.setViewportSize({ width: 390, height: 844 });
  await page.waitForTimeout(1000);
  await page.screenshot({ path: '/Users/vishalvirda/.gemini/antigravity-ide/brain/21fd906c-ff50-491b-9a46-d59f675d4a71/dispatch_map_390.png' });

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
