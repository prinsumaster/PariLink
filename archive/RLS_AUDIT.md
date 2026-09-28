# RLS Audit Report (Multi-Tenant Security)

## Phase 1 Findings
The following files contain direct Prisma model access (`this.prisma.model.findMany`, etc.) that bypasses the `PrismaService.runAsTenant()` isolation wrapper. This represents a critical IDOR / Tenant Data Leakage risk.

| File | Line | Risk | Recommended Fix |
| :--- | :--- | :--- | :--- |
| `apps/api/src/ai/copilot/sql-generator.service.ts` | 56 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/auth/guards/api-key.guard.ts` | 53 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/common/guards/eway-bill.guard.ts` | 29 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/common/guards/require-approval.guard.ts` | 44 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/dashboard/dashboard.controller.ts` | 21 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/dashboard/dashboard.controller.ts` | 30 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/dashboard/dashboard.controller.ts` | 35 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/dashboard/dashboard.controller.ts` | 39 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fastag/services/fastag-reconciliation.processor.ts` | 22 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fastag/services/fastag-reconciliation.processor.ts` | 35 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fastag/services/fastag-reconciliation.processor.ts` | 49 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fastag/services/fastag-reconciliation.processor.ts` | 63 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/fastag/fastag.service.ts` | 15 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/fastag/fastag.service.ts` | 28 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/invoicing/invoicing.service.ts` | 16 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/invoicing/invoicing.service.ts` | 28 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/ledger/general-ledger.service.ts` | 63 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/payables/accounts-payable.service.ts` | 16 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/finance/payables/accounts-payable.service.ts` | 28 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fleet/iot/iot.service.ts` | 19 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fleet/lifecycle/vehicle-lifecycle.service.ts` | 12 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fleet/lifecycle/vehicle-lifecycle.service.ts` | 20 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fleet/maintenance/fleet-maintenance.service.ts` | 11 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fleet/maintenance/fleet-maintenance.service.ts` | 29 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fuel/services/fuel-management.processor.ts` | 26 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fuel/services/fuel-management.processor.ts` | 33 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/fuel/services/fuel-management.processor.ts` | 37 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/integration/services/csv-import.processor.ts` | 45 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/integration/services/tally-sync.processor.ts` | 18 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/intelligence/prediction/prediction.service.ts` | 24 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/intelligence/recommendation/recommendation.service.ts` | 12 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/intelligence/risk/risk.service.ts` | 14 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/operations/dr/disaster-recovery.service.ts` | 115 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/platform/iam/iam-policy-engine.service.ts` | 104 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/analytics/customer-analytics.service.ts` | 15 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/analytics/customer-analytics.service.ts` | 22 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/analytics/customer-analytics.service.ts` | 25 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/finance/customer-finance.service.ts` | 14 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/finance/customer-finance.service.ts` | 30 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/loads/customer-loads.service.ts` | 14 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/loads/customer-loads.service.ts` | 38 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/customer/tracking/customer-tracking.service.ts` | 14 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/checklist/driver-checklists.service.ts` | 18 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/checklist/driver-checklists.service.ts` | 33 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/expenses/driver-expenses.service.ts` | 21 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/expenses/driver-expenses.service.ts` | 37 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/telemetry/driver-telemetry.service.ts` | 19 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/trips/driver-trips.service.ts` | 14 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/trips/driver-trips.service.ts` | 43 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/driver/trips/driver-trips.service.ts` | 53 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/marketplace/vendor-marketplace.service.ts` | 13 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/marketplace/vendor-marketplace.service.ts` | 36 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/operations/vendor-operations.service.ts` | 14 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/operations/vendor-operations.service.ts` | 37 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/operations/vendor-operations.service.ts` | 47 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/settlements/vendor-settlements.service.ts` | 13 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/portals/vendor/settlements/vendor-settlements.service.ts` | 25 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/search/search.controller.ts` | 21 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/search/search.controller.ts` | 28 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/search/search.controller.ts` | 38 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/search/search.controller.ts` | 42 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |
| `apps/api/src/trips/services/driver-settlement.service.ts` | 9 | Critical (IDOR) | Wrap in `this.prisma.runAsTenant(companyId, tx => tx.model...)` |

**Total RLS Violations Detected:** 62
