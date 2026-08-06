# PariLink Enterprise 1.0.0 — User Manual

Welcome to PariLink Enterprise v1.0.0. This guide is tailored to specific operational roles within your logistics organization.

---

## 1. Administrator Guide
Administrators hold global permissions to configure the tenant environment.
- **Onboarding Users:** Navigate to `Settings > Users`. You can invite Dispatchers, Drivers, and Managers. Passwords should be securely distributed.
- **Integration Hub:** To connect your CRM or ERP, navigate to `Settings > Integrations`. Generate an API Key (save this securely, it will not be shown again) and configure your Webhook callback URLs.
- **Fleet Setup:** You must create Vehicles (Tractors/Trailers) before Dispatchers can assign Loads. Ensure VIN numbers and License Plates are accurate to prevent DOT compliance issues.

---

## 2. Dispatcher Guide
Dispatchers are responsible for matching Freight (Loads) with Fleet (Vehicles/Drivers).
- **Load Creation:** Navigate to `Logistics > Loads`. Create an Origin and Destination stop.
- **Trip Assignment:** Navigate to `Dispatch > Trips`. You can manually assign a Vehicle and Driver to a Load, creating a "Trip". 
- **AI Auto-Dispatch:** Click the `AI Dispatch` button to let PariLink automatically match the closest, most compliant driver to the load based on predictive analytics and Hours of Service.
- **Live Fleet Map:** View real-time GPS coordinates of active Trips on the map.

---

## 3. Driver Guide
Drivers interact primarily with the PariLink Mobile App.
- **Trip Acceptance:** When a Dispatcher assigns you a Trip, you will receive a Push Notification. You must click `Acknowledge` to change the Trip status to `DISPATCHED`.
- **Status Updates:** Update your status to `IN_PROGRESS` when you leave the yard, and `COMPLETED` when the load is delivered. 
- **Odometer:** You MUST enter accurate odometer readings at the start and end of every trip. This data feeds into the automated Fleet Maintenance Engine.

---

## 4. Operations & Warehouse Guide
Operations personnel manage cross-docking and inventory.
- **Inbound Freight:** Scan incoming BOLs (Bill of Lading) to register inventory into the Warehouse module.
- **Outbound Freight:** Consolidate loads and generate pick-lists. The system will automatically prevent deadlocks during concurrent picking using sequential batch locks.

---

## 5. Frequently Asked Questions (FAQ)

**Q: Why can't I see the AI Dispatch button?**
A: Your organization may not have enabled the AI Tier, or your JWT session does not have the `DISPATCHER` or `ADMIN` role.

**Q: Can a driver be assigned to two active trips at once?**
A: No. PariLink enforces a strict 1-to-1 availability rule. A driver must mark a trip `COMPLETED` before accepting a new one.

**Q: How do I export my data to accounting?**
A: Administrators can use the `Billing > Invoices` view to export CSVs, or utilize the Developer API to pull automated syncs.

---

## 6. Troubleshooting Guide

**Issue: Webhooks are not firing.**
- *Solution:* Navigate to `Settings > Webhooks > Logs`. Ensure your receiving server is responding with a `200 OK` status. PariLink uses exponential backoff; if your server returns `500` repeatedly, the webhook will eventually enter a `FAILED` state.

**Issue: Driver location not updating on Live Map.**
- *Solution:* Wait 30 seconds for the REST polling interval to catch up. Real-time streaming (SSE) is currently a Known Limitation in v1.0.0 and will fallback to standard polling. Ensure the Driver has granted Location Permissions in the mobile app.

**Issue: 401 Unauthorized Error on API.**
- *Solution:* Your API Key or JWT Token has expired. Administrators should rotate keys, or users should log out and log back in to refresh their session token.
