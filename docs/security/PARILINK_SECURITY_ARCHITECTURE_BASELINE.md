# PARILINK SECURITY ARCHITECTURE BASELINE (PHASE 0)

## Overview
This document answers critical architectural questions regarding `app.bypass_rls` as requested in Phase 0.

## Question: Who can set `app.bypass_rls`, from where, and is any path reachable from an authenticated tenant request?

### Answer:
The `app.bypass_rls` session variable in PostgreSQL is designed to disable Row-Level Security (RLS) protections, allowing a transaction to read and write across all tenants.

**Who can set it & from where:**
It is set exclusively within the `PrismaService.runAsSystem()` method located at `apps/api/src/prisma/prisma.service.ts`:
```typescript
async runAsSystem<T>(callback: (tx: ...) => Promise<T>): Promise<T> {
  return this.$transaction(async (tx) => {
    await tx.$executeRaw`SELECT set_config('app.bypass_rls', 'on', true)`;
    return callback(tx);
  });
}
```

**Is any path reachable from an authenticated tenant request?**
**YES**. 
A review of `prisma-query-census.csv` shows `runAsSystem` is invoked in 60+ locations across the API, including standard user-facing controllers and services. 
Examples of tenant-reachable paths include:
1. `AnalyticsController` (`/api/v1/analytics/dashboard`, `/api/v1/analytics/live`)
2. `NotificationController`
3. `CompaniesService` (fetching company details)

While `runAsSystem` itself bypasses RLS, the critical vulnerability depends on whether these routes *also* filter by the caller's `companyId` within the `runAsSystem` callback. If they fail to filter manually, they will leak cross-tenant data. We will test this actively in **Phase 1 (A8 Analytics Cache)**.
