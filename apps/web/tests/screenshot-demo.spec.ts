import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.use({ storageState: 'tests/.auth/user.json' });

const ROUTES = [
  { name: 'dashboard', path: '/dashboard' },
  { name: 'customers', path: '/customers' },
  { name: 'fleet', path: '/fleet' },
  { name: 'drivers', path: '/drivers' },
  { name: 'loads', path: '/loads' },
  { name: 'trips', path: '/trips' },
  { name: 'lorry-receipts', path: '/bilty' },
  { name: 'dispatch', path: '/dispatch' },
  { name: 'invoices', path: '/finance/invoices' },
  { name: 'payments', path: '/payments' },
  { name: 'ledger', path: '/ledger' },
  { name: 'profitability', path: '/profitability' },
  { name: 'documents', path: '/documents' },
  { name: 'warehouse', path: '/wms' },
  { name: 'notifications', path: '/notifications' },
  { name: 'tracking', path: '/tracking' },
];

test('Capture screenshots of all demo screens', async ({ page }) => {
  test.setTimeout(600000);
  
  // Create output directory
  const outDir = path.join(process.cwd(), 'demo-shots');
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  // Set viewport to 1440
  await page.setViewportSize({ width: 1440, height: 900 });

  for (const route of ROUTES) {
    console.log(`Navigating to ${route.name} (${route.path})`);
    await page.goto(route.path);
    await page.waitForTimeout(4000); // Wait for network and renders
    
    // Attempt to dismiss any modals/tour popups if they exist
    await page.keyboard.press('Escape');

    await page.screenshot({ path: path.join(outDir, `${route.name}.png`), fullPage: true });
    
    // If it's a list page that has a detail view, let's try to click the first row!
    if (['trips', 'lorry-receipts', 'invoices'].includes(route.name)) {
      try {
        // Find the first link in the table body and click it
        const firstLink = page.locator('tbody tr a').first();
        if (await firstLink.isVisible()) {
          await firstLink.click();
          await page.waitForTimeout(4000); // Wait for detail page
          await page.screenshot({ path: path.join(outDir, `${route.name}-detail.png`), fullPage: true });
        }
      } catch (e) {
        console.log(`Could not get detail screenshot for ${route.name}`);
      }
    }
  }
});
