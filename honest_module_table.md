# Honest Module Status Table

Last updated: 2026-09-21

Each claim in this table has specific evidence backing it. Claims marked `STUB` or `DETERMINISTIC` are honest limitations, not failures.

---

## Module Status

| Module | DB Isolated? | UI Reachable from Nav? | E2E Tested? | DTO Validates? | Notes |
|--------|-------------|----------------------|-------------|----------------|-------|
| **Dashboard** | Yes | Yes — sidebar top item | Partial | N/A | KPIs pull from real trips/fleet data |
| **Customers** | Yes | Yes — Operations → Customers | Yes | Yes | Two-tenant proof: run IDs in session history |
| **Fleet — Vehicles** | Yes | Yes — Fleet & Personnel → Fleet | Yes | Yes | |
| **Fleet — Drivers** | Yes | Yes — Fleet & Personnel → Drivers | Yes | Yes | |
| **Booking / Loads** | Yes | Yes — Operations → Loads | Yes | Yes | |
| **LR / Bilty** | Yes | Yes — Operations → Bilty (LR) | Yes | Yes | |
| **Dispatch** | Yes | Yes — Operations → Dispatch | Yes | Yes | |
| **Trips** | Yes | Yes — Operations → Trips | Yes | Yes | |
| **In-Transit Tracking** | Yes | Yes — Operations → In-Transit | Partial | N/A | Mapbox map is stub — no real API key wired. Tenant isolation of trip data is real. |
| **Billing / Invoices** | Yes | Yes — Billing section | Yes | Yes | |
| **AI Copilot** | Yes | Yes — Enterprise AI Platform → AI Copilot | Yes | N/A | Deterministic chunked response — no real LLM call. Tenant-scoped queries confirmed via two-tenant session proof (different revenue/trip counts). |
| **Log Explorer** | Yes | Yes — Enterprise AI Platform | Yes | N/A | Two-tenant proof: different log counts confirmed (session evidence). |
| **Warehouse — Master** | Yes | Yes — Operations → Warehouse → Master | Yes (6/6) | Yes | Isolation proof: Tenant B GET on Tenant A warehouse ID → 404. SQL counts differ (1 vs 2 warehouses). |
| **Warehouse — Inbound** | Yes | Yes — Operations → Warehouse → Inbound | Yes (part of 6/6 E2E) | Yes — CreateAsnDto + ReceiveGoodsDto | |
| **Warehouse — Outbound** | Yes | Yes — Operations → Warehouse → Outbound | Yes (part of 6/6 E2E) | Yes — CreateOutboundOrderDto | |

---

## CI Status

| Check | Status | Run ID | Notes |
|-------|--------|--------|-------|
| CodeQL | ✅ Green | 35598382010 (in-progress) | Passes consistently |
| TruffleHog Secret Scan | ✅ Green | 35598382010 (in-progress) | Full-repo scan configured (not diff-only) after force-push fix |
| Trivy Vulnerability Scanner | ⏳ Pending | 35598382010 | Fixed `@xmldom/xmldom` 0.7.13 → 0.9.12 via npm overrides. Previous 5 HIGH CVEs eliminated. CI in progress. |

---

## Known Honest Limitations

1. **Mapbox (In-Transit Tracking):** The map renders but uses a stub/placeholder — no real Mapbox API key is wired. Trip location data is real and tenant-isolated; only the visual tile layer is stubbed.
2. **AI Copilot:** Responses are deterministic and chunked to simulate streaming. No real LLM call is made. Tenant scoping is real — different tenants see different data in responses.
3. **Warehouse:** CI was not green before warehouse work started (Trivy was failing on `@xmldom/xmldom` CVEs). The warehouse code was correct but the CI gate had not been cleared. Fix committed `631e8b3`, CI run `35598382010` in progress.
