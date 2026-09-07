import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

// Written relative to the repo, not to one machine. The previous version
// copied every shot into
//   /Users/vishalvirda/.gemini/antigravity-ide/brain/21fd906c-.../
// which throws ENOENT for anyone else and was committed to the repo.
// Override with SHOTS_DIR if you want them somewhere else.
const OUTPUT_DIR = process.env.SHOTS_DIR
  ? path.resolve(process.env.SHOTS_DIR)
  : path.resolve(process.cwd(), 'demo-shots');
const BASE_URL = process.env.BASE_URL || 'http://localhost:3000';
const API_URL = process.env.API_URL || 'http://localhost:8080';

// This app does NOT use NextAuth for its session. The login page posts to
// /api/v1/auth/login itself and puts the token in a client-side store, so
// there is no session cookie for curl to carry -- driving the real form in a
// browser is the only way to get an authenticated page.
const VIEWPORTS = [
  { label: 'desktop', width: 1440, height: 900 },
  { label: 'mobile', width: 390, height: 844 },
];

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const browser = await chromium.launch();
  const failures = [];

  const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' }),
  });
  if (!loginRes.ok) {
    throw new Error(
      `API login failed: ${loginRes.status} ${JSON.stringify(await loginRes.json())}`,
    );
  }
  const token = (await loginRes.json()).access_token;

  const get = (p) =>
    fetch(`${API_URL}/api/v1${p}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .catch(() => ({}));
  const [trips, invoices, vehicles, drivers] = await Promise.all([
    get('/trips'), get('/invoices'), get('/vehicles'), get('/drivers'),
  ]);
  const first = (r) => r?.data?.[0]?.id ?? r?.[0]?.id ?? null;
  const tripId = first(trips);
  const invoiceId = first(invoices);
  const vehicleId = first(vehicles);
  const driverId = first(drivers);

  // A null id yields a URL like /billing/null, which screenshots a 404 and
  // reads as a passing capture. Skip and report instead.
  const targets = [
    { name: '01-dashboard', url: '/dashboard' },
    { name: '02-billing-list', url: '/billing' },
    { name: '03-invoice-detail', url: invoiceId && `/billing/${invoiceId}` },
    { name: '04-general-ledger', url: '/finance' },
    { name: '05-drivers-list', url: '/drivers' },
    { name: '06-driver-detail', url: driverId && `/drivers/${driverId}` },
    { name: '07-fleet-telemetry', url: vehicleId && `/fleet/${vehicleId}` },
    { name: '08-trip-detail-map', url: tripId && `/trips/${tripId}` },
    { name: '09-command-center', url: '/analytics/command-center' },
    { name: '10-operations-dispatch', url: '/operations' },
  ];

  for (const vp of VIEWPORTS) {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    // Surface client-side crashes -- an unguarded .map() renders a blank page
    // that screenshots perfectly happily.
    const pageErrors = [];
    page.on('pageerror', (e) => pageErrors.push(e.message));

    console.log(`\n=== ${vp.label} ${vp.width}x${vp.height} ===`);
    await page.goto(`${BASE_URL}/login`);
    await page.fill('input[type="email"]', 'admin@parilink.com');
    await page.fill('input[type="password"]', 'password123');
    await page.click('button[type="submit"]');
    try {
      await page.waitForURL('**/dashboard', { timeout: 15000 });
    } catch {
      failures.push(`${vp.label}: login did not reach /dashboard (at ${page.url()})`);
      await context.close();
      continue;
    }
    await page.waitForTimeout(1000);

    for (const t of targets) {
      if (!t.url) {
        failures.push(`${vp.label}/${t.name}: skipped, no seeded id`);
        console.log(`  SKIP ${t.name} (no id)`);
        continue;
      }
      pageErrors.length = 0;
      await page.goto(`${BASE_URL}${t.url}`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1500);
      const dest = path.join(OUTPUT_DIR, `${t.name}-${vp.width}.png`);
      await page.screenshot({ path: dest, fullPage: false });
      if (pageErrors.length) {
        failures.push(`${vp.label}/${t.name}: ${pageErrors[0]}`);
        console.log(`  FAIL ${t.name} -> ${pageErrors[0]}`);
      } else {
        console.log(`  ok   ${t.name} -> ${path.basename(dest)}`);
      }
    }
    await context.close();
  }

  await browser.close();
  console.log(`\nshots written to ${OUTPUT_DIR}`);
  if (failures.length) {
    console.log(`\n${failures.length} FAILURE(S):`);
    failures.forEach((f) => console.log(`  - ${f}`));
    process.exit(1);
  }
  console.log('all captures clean');
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
