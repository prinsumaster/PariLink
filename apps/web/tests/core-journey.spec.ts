import { test, expect } from '@playwright/test';

test.describe('Core Journey - Happy Path', () => {
  test('User can view Dashboard KPIs, navigate to Trips, and view Trip Details', async ({ page }) => {
    // 1. Dashboard Verification
    await page.goto('/dashboard', { timeout: 120000 });
    
    // Verify Dashboard header is visible
    await expect(page.getByRole('heading', { name: /command center/i, exact: false })).toBeVisible();

    // Verify Active Shipments KPI tile
    const activeShipmentsTile = page.getByTestId('kpi-active-shipments');
    await expect(activeShipmentsTile).toBeVisible();
    await expect(activeShipmentsTile).toContainText(/\d+/);

    // 2. Trip Navigation
    // The Trips link is under the Operations group, so we need to expand it first
    await page.getByText('Operations', { exact: true }).click();
    
    // Wait for the sidebar link to be clickable and click it
    const tripsLink = page.getByTestId('nav-link-trips');
    await expect(tripsLink).toBeVisible();
    await tripsLink.click();

    // Wait for URL to change to /trips
    await page.waitForURL(/\/trips$/);
    
    // 3. Trip Detail Verification
    // Wait for the trips table to load
    const tripsTable = page.getByTestId('trips-data-table');
    await expect(tripsTable).toBeVisible({ timeout: 10000 });

    // Click the first row in the table (which should have a testid to ensure it's a loaded row)
    const firstTripRow = page.getByTestId('trip-row-0');
    await expect(firstTripRow).toBeVisible();
    await firstTripRow.click();

    // Wait for URL to change to /trips/[id]
    await page.waitForURL(/\/trips\/[0-9a-fA-F-]+$/);

    // Verify Driver Name and Vehicle License Plate render properly
    const driverNameElement = page.getByTestId('trip-detail-driver-name');
    await expect(driverNameElement).toBeVisible({ timeout: 10000 });
    // We expect it NOT to be a raw UUID (a rough heuristic is verifying it has no dashes if it's just a name, or isn't 36 chars long, or just ensuring it's not empty)
    const driverNameText = await driverNameElement.textContent();
    expect(driverNameText).toBeTruthy();
    expect(driverNameText).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);

    const vehiclePlateElement = page.getByTestId('trip-detail-vehicle-plate');
    await expect(vehiclePlateElement).toBeVisible();
    const vehiclePlateText = await vehiclePlateElement.textContent();
    expect(vehiclePlateText).toBeTruthy();
    expect(vehiclePlateText).not.toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
  });
});
