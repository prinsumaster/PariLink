# RC6 Security and Validation Fixes

**Verification Status:**
- Build verification succeeded (`npm run build` returned exit code 0).
- Run verification failed (Docker daemon unreachable in the test environment).

None of the runtime API functionalities could be directly verified by `curl` or Docker integration tests in Round 24 due to the test environment being unreachable.

## 1. Workflow Queue Injection (Test 4.12)
- **Files touched:** `apps/api/src/workflow/workflow.module.ts`
- **Fix:** Added `workflow_execution` queue to the `BullModule.registerQueue` definition to prevent the application from crashing upon injection into `ApprovalEngineService`.

## 2. Company Creation Transaction Propagation (Test 7.1)
- **Files touched:** 
  - `apps/api/src/companies/companies.service.ts`
  - `apps/api/src/platform/digital-twin/event-store.service.ts`
- **Fix:** Plumbed the Prisma transaction (`tx`) into the asynchronous calls to `auditService.logEvent()` and `eventStore.append()`. The `Company` creation transaction was disjointed from the audit/event inserts previously, causing PostgreSQL constraint violations since the outer transaction hadn't committed yet.

## 3. Trip Status Payload Flexibility (Test 6.6)
- **Files touched:** `apps/api/src/trips/dto/create-trip.dto.ts`
- **Fix:** Softened the validation rule for the `status` field from `@IsNotEmpty()` to `@IsOptional()`, allowing clients that omit the field to default cleanly to `PLANNED` per the database schema.
