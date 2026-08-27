import { test, expect, chromium } from '@playwright/test';
import { PrismaClient } from '@prisma/client';
import fs from 'fs';

const p = new PrismaClient();

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  console.log("Seeding and capturing detail screenshots...");
  fs.mkdirSync('demo-shots/detail', { recursive: true });

  // 1. Get real data
  const load = await p.load.findFirst({ orderBy: { createdAt: 'desc' }});
  const trip = await p.trip.findFirst({ orderBy: { createdAt: 'desc' }});
  const invoice = await p.invoice.findFirst({ orderBy: { createdAt: 'desc' }});
  const customer = await p.customer.findFirst({ orderBy: { createdAt: 'desc' }});
  const vehicle = await p.vehicle.findFirst({ orderBy: { createdAt: 'desc' }});
  const warehouse = await p.warehouse.findFirst({ orderBy: { createdAt: 'desc' }});
  const order = await p.order.findFirst({ orderBy: { createdAt: 'desc' }});

  // Log in
  await page.goto('http://localhost:3000/login');
  await page.fill('input[name="email"]', 'admin@parilink.in');
  await page.fill('input[name="password"]', 'password123');
  await page.click('button[type="submit"]');
  await page.waitForURL('**/dashboard');

  // Helper to screenshot
  async function shoot(path, filename) {
    console.log(`Shooting ${filename} at ${path}`);
    await page.goto(`http://localhost:3000${path}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(1000); // Wait for animations
    
    // Check for boundaries
    const hasError = await page.evaluate(() => {
      return document.body.innerText.includes('Dashboard View Error') || document.body.innerText.includes('Permission Denied');
    });
    if (hasError) {
      console.error(`ERROR on ${path}: Boundary detected!`);
      await page.screenshot({ path: `demo-shots/detail/ERROR_${filename}.png` });
      process.exit(1);
    }
    
    await page.screenshot({ path: `demo-shots/detail/${filename}.png` });
  }

  // Shoot details
  if (load) await shoot(`/loads/${load.id}`, 'load_detail');
  if (trip) await shoot(`/trips/${trip.id}`, 'trip_detail');
  if (invoice) await shoot(`/finance/${invoice.id}`, 'invoice_detail');
  if (customer) await shoot(`/customers/${customer.id}`, 'customer_detail');
  if (vehicle) await shoot(`/fleet/${vehicle.id}`, 'vehicle_detail');
  if (warehouse) await shoot(`/wms/${warehouse.id}`, 'warehouse_detail');
  if (order) await shoot(`/orders/${order.id}`, 'order_detail');

  // Test Actions
  console.log("Testing Generate Bilty...");
  if (load) {
    await page.goto(`http://localhost:3000/loads/${load.id}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    // Find Generate Bilty button
    const biltyBtn = page.getByRole('button', { name: /Generate Bilty|Create LR/i });
    if (await biltyBtn.count() > 0) {
      await biltyBtn.first().click();
      await page.waitForTimeout(2000); // Wait for modal or toast
      await page.screenshot({ path: `demo-shots/detail/action_generate_bilty.png` });
    } else {
      console.log("Generate Bilty button not found on load detail");
      await page.screenshot({ path: `demo-shots/detail/action_generate_bilty_missing.png` });
    }
  }

  console.log("Testing Record Payment...");
  if (invoice) {
    await page.goto(`http://localhost:3000/finance/${invoice.id}`);
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(500);
    const payBtn = page.getByRole('button', { name: /Record Payment/i });
    if (await payBtn.count() > 0) {
      await payBtn.first().click();
      await page.waitForTimeout(2000); // Wait for toast
      await page.screenshot({ path: `demo-shots/detail/action_record_payment.png` });
    } else {
      console.log("Record Payment button not found on invoice detail");
      await page.screenshot({ path: `demo-shots/detail/action_record_payment_missing.png` });
    }
  }

  await browser.close();
  console.log("Detail screenshots complete!");
}

run().catch(e => {
  console.error(e);
  process.exit(1);
});
