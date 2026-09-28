# PariLink 2.0 — Product Demo Script

**Audience:** Internal Teams (Product, Engineering, QA)

---

## 1. Setup
- Ensure the API and Web App are running locally.
- Log in as the Super Admin.

## 2. The Subscription Center
1. Navigate to **Admin Console → Subscription Center**.
2. Show the list of tenants and their current capacity usage.
3. Highlight a customer that is near capacity (Amber or Red bar).
4. Click the **⋮ menu** and select **Set Truck Limit**.
5. Increase the limit by 10 and show the usage bar instantly update to Green.
6. Demonstrate the **Temporary Boost** feature, setting an expiry date.

## 3. The Customer Experience
1. Log out and log in as a Tenant Admin (or use the Impersonate feature if built).
2. Navigate to the Dashboard.
3. Point out the **License Usage Banner** on the sidebar.
4. Go to **Fleet → Add Vehicle**.
5. Attempt to add a vehicle when the limit is reached.
6. Show the **HTTP 402 Payment Required** error message and the prompt to upgrade.

## 4. The Dispatch Workflow
1. Navigate to the **Command Center**.
2. Create a new Trip.
3. Assign a driver and a vehicle.
4. Show the real-time status update to "Dispatched".

## 5. Driver Super App
1. Open the mobile PWA view (or use Chrome DevTools device mode).
2. Log in as the assigned driver.
3. Show the active trip.
4. Upload a mock POD (Proof of Delivery).
5. Mark the trip as "Completed".
