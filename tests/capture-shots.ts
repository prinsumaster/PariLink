import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';
import { PrismaClient } from '@prisma/client';

const OUT_DIR = path.join(__dirname, '../demo-shots');

const BASE_URL = 'http://localhost:3000';
const API_URL = 'http://localhost:8080';
const OUTPUT_DIR = path.resolve(process.cwd(), 'demo-shots');
const ARTIFACT_DIR = '/Users/vishalvirda/.gemini/antigravity-ide/brain/21fd906c-ff50-491b-9a46-d59f675d4a71';

async function main() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
  });
  const page = await context.newPage();

  // Login
  console.log('Logging in...');
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input[type="email"]', 'admin@parilink.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');
  await page.waitForTimeout(1000);

  // Fetch dynamic IDs
  const loginRes = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@parilink.com', password: 'password123' })
  });
  const token = (await loginRes.json()).access_token;

  const [tripsRes, invoicesRes, vehiclesRes, driversRes] = await Promise.all([
    fetch(`${API_URL}/api/v1/trips`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    fetch(`${API_URL}/api/v1/invoices`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    fetch(`${API_URL}/api/v1/vehicles`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
    fetch(`${API_URL}/api/v1/drivers`, { headers: { Authorization: `Bearer ${token}` } }).then(r => r.json()),
  ]);

  const tripId = tripsRes.data?.[0]?.id || tripsRes[0]?.id;
  const invoiceId = invoicesRes.data?.[0]?.id || invoicesRes[0]?.id;
  const vehicleId = vehiclesRes.data?.[0]?.id || vehiclesRes[0]?.id;
  const driverId = driversRes.data?.[0]?.id || driversRes[0]?.id;

  const targets = [
    { name: '01-dashboard.png', url: '/dashboard' },
    { name: '02-billing-list.png', url: '/billing' },
    { name: '03-invoice-detail.png', url: `/billing/${invoiceId}` },
    { name: '04-general-ledger.png', url: '/finance' },
    { name: '05-drivers-list.png', url: '/drivers' },
    { name: '06-driver-detail.png', url: `/drivers/${driverId}` },
    { name: '07-fleet-telemetry.png', url: `/fleet/${vehicleId}` },
    { name: '08-trip-detail-map.png', url: `/trips/${tripId}` },
    { name: '09-command-center.png', url: '/analytics/command-center' },
    { name: '10-operations-dispatch.png', url: '/operations' },
  ];

  for (const t of targets) {
    console.log(`Capturing ${t.name} from ${t.url}...`);
    await page.goto(`${BASE_URL}${t.url}`, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(1500);
    const dest = path.join(OUTPUT_DIR, t.name);
    await page.screenshot({ path: dest, fullPage: false });
    
    // Copy to artifact directory for embedding in walkthrough
    const artifactDest = path.join(ARTIFACT_DIR, t.name);
    fs.copyFileSync(dest, artifactDest);
    console.log(`Saved ${t.name}`);
  }

  await browser.close();
  console.log('All 10 screenshots captured successfully!');
}

main().catch(console.error);
