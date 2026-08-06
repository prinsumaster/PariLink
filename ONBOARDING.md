# Customer Onboarding & Setup Checklist

Welcome to PariLink! Follow these sequential steps to safely initialize your transport organization.

## 1. Initial Company Setup (System Admin)
- [ ] Log in using your root administrative credentials.
- [ ] Navigate to **Settings > Company Profile** and upload your official logo (this applies to all generated Invoices & PODs).
- [ ] Navigate to **Settings > Billing** and define your default currency and tax brackets (e.g. GST/VAT parameters).
- [ ] Navigate to **Admin > Users** and invite your Department Heads (Dispatch Manager, Fleet Manager, Financial Controller). Ensure you assign the correct RBAC Role.

## 2. Fleet & Asset Setup (Fleet Manager)
- [ ] Navigate to **Fleet > Vehicles** and bulk import your active trucks via CSV.
- [ ] Upload compliance documents for each vehicle (Registration, Insurance, Permits).
- [ ] Navigate to **Drivers > Database** and invite your drivers. They will receive SMS links to download the Driver App.
- [ ] (Optional) In **Integrations > Marketplace**, activate your GPS / Telematics Provider (e.g. Samsara, Geotab) to bind active vehicle streams.

## 3. Financial Integration (Financial Controller)
- [ ] Navigate to **Integrations > Marketplace** and activate your ERP (Tally, SAP, Oracle).
- [ ] Map PariLink Ledger IDs to your ERP's Chart of Accounts.
- [ ] Define default Rate Cards and Fuel Surcharge (FSC) percentages.

## 4. Dispatch Operations (Dispatch Manager)
- [ ] Define Customer profiles and contract rates.
- [ ] Navigate to **Dispatch > Control Tower**.
- [ ] Run a test Quotation → Booking → Dispatch flow.
- [ ] Assign a Load to a test Driver and have them accept the load via the Driver App. 

## 5. Launch
- [ ] Once the E2E test trip is marked *Completed* and the test Invoice is successfully bridged to your ERP, you are ready to onboard your remaining customer base and go live.
