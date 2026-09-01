### STEP 1 — RESTORE THE LEAK FILE
The `fuel-intelligence.service.ts` file was already restored to its correct state, and the leak (removing the `where` and `include` clauses) was only a local modification that was never actually committed. 

**a & b) The file is restored and contains the correct filter and includes:**
```typescript
      const entries = await tx.fuelEntry.findMany({
        where: { companyId, filledAt: { gte: recentDate } },
        include: {
          vehicle: { select: { id: true, licensePlate: true, type: true } },
          driver: { select: { id: true, firstName: true, lastName: true } },
          trip: { select: { id: true, tripNumber: true } }
        }
      });
```

**c) `git diff` is empty**
*(Empty diff)*

---

### STEP 2 — FIX THE DEPLOY.md PROVISIONING COMMAND
The instructions in `DEPLOY.md` have been updated to use the `postgres` superuser, and a strict verification check has been added before migrations can proceed.

**Diff applied to `DEPLOY.md`:**
```diff
@@ -64,7 +64,7 @@
 2.  **Database Initial Provisioning (First deploy only):**
     Before running migrations for the first time, you must create the AI role as a superuser. The `ai_no_bypass` migration requires this role to exist.
     ```bash
-    docker compose -f docker-compose.prod.yml exec postgres psql -U parilink -d parilink_db -c "
+    docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d parilink_db -c "
       CREATE ROLE parilink_ai NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
       GRANT USAGE ON SCHEMA public TO parilink_ai;
       GRANT SELECT ON \"Trip\",\"Load\",\"Invoice\",\"Vehicle\",\"Driver\",\"Customer\",\"Expense\" TO parilink_ai;
@@ -71,5 +71,11 @@
     "
     ```
+    Verify that the role was created successfully:
+    ```bash
+    docker compose -f docker-compose.prod.yml exec postgres psql -U postgres -d parilink_db -c "\du parilink_ai"
+    ```
+    **IMPORTANT**: The subsequent `npx prisma migrate deploy` command MUST NOT be run until the verification command above returns a row confirming the role exists.
+
 3.  **Run Database Migrations:**
     ```bash
     docker compose -f docker-compose.prod.yml run --rm api npx prisma migrate deploy
```

---

### STEP 3 — START DOCKER, THEN RUN THE BLOCKED QUEUE

Docker Desktop has been started successfully. 

**1. `bash apps/api/setup-test-db.sh`**
```text
Starting throwaway Postgres container...
parilink-test-db
Waiting for Postgres to be ready...
Running migrations on throwaway DB as superuser (DDL requires superuser)...
Creating non-superuser test role so RLS is enforced...
Setting up AI role...
Seeding DB...
Done
```

**2. `bash apps/api/test/cp2-rls-bite-check.sh`** (Note: ran `test-cp2-seed.ts` first to ensure two companies)
```text
=== 0. who am I connecting as? ===
parilink_test|f
    (MUST read parilink_test|f — if it says postgres|t, everything below is meaningless)

=== 1. is RLS enabled AND forced on the new tables? ===
FuelEntry|t|t
Invoice|t|t
Trip|t|t
TripDesk|t|t
Vehicle|t|t
    (all must be t|t)

=== 2. seed one row per tenant (as system, RLS bypassed for setup) ===
tenant A = 601c9e65-37a0-4c73-bc3d-18dac4001cc1
tenant B = 01041308-a695-45ac-bc25-7a6c23030f45
  seeded rows for 601c9e65-37a0-4c73-bc3d-18dac4001cc1
  (skipping FuelEntry seed for 01041308-a695-45ac-bc25-7a6c23030f45 — needs an existing trip/vehicle/driver)

=== 3. totals with RLS bypassed (the ground truth) ===
  FuelEntry total (all tenants) = 3
  TripDesk total (all tenants) = 5

=== 4. THE TEST: same connection, same query, only the tenant setting changes ===
--- FuelEntry ---
  as tenant A: sees 3   (A actually owns 3)
  as tenant B: sees 0   (B actually owns 0)
  PASS — each tenant sees exactly its own rows
--- TripDesk ---
  as tenant A: sees 4   (A actually owns 4)
  as tenant B: sees 1   (B actually owns 1)
  PASS — each tenant sees exactly its own rows
```

**3. Manual Test in `parilink_test`**
```text
SET
                     id                      |              companyId               
---------------------------------------------+--------------------------------------
 97a537cd-c083-4474-9cab-fb83a3dff4db        | 601c9e65-37a0-4c73-bc3d-18dac4001cc1
 c51e829e-b793-4773-b893-1d8ed22389dd        | 601c9e65-37a0-4c73-bc3d-18dac4001cc1
 a044cd24-d9cf-4d42-9af7-4f005ddc92f9        | 601c9e65-37a0-4c73-bc3d-18dac4001cc1
 cp2-td-601c9e65-37a0-4c73-bc3d-18dac4001cc1 | 601c9e65-37a0-4c73-bc3d-18dac4001cc1
(4 rows)

---
SET
                  id                  |              companyId               
--------------------------------------+--------------------------------------
 t2222222-2222-2222-2222-222222222222 | 01041308-a695-45ac-bc25-7a6c23030f45
(1 row)
```

**4. `bash apps/api/test/cp4-fk-rls-bite-check.sh`**
```text
=== 0. connected as? (MUST be parilink_test|f) ===
parilink_test|f

=== 1. RLS enabled AND forced on the 7 FK-linked tables? (all must be t|t) ===
BackupCode|t|t
InvoiceLineItem|t|t
OAuthToken|t|t
RefreshToken|t|t
SsoSession|t|t
TrustedDevice|t|t
WebAuthnCredential|t|t

tenant A = 601c9e65-37a0-4c73-bc3d-18dac4001cc1
tenant B = 01041308-a695-45ac-bc25-7a6c23030f45

=== 2. seed one RefreshToken per tenant, owned via that tenant's User ===
  seeded RefreshToken for 601c9e65-37a0-4c73-bc3d-18dac4001cc1 (user 9290c30d-e5d3-4983-93c4-516c6f87e207)
  no user for 01041308-a695-45ac-bc25-7a6c23030f45 — skipping

=== 3. ground truth, RLS bypassed ===
  RefreshToken total across all tenants = 1
  actually owned by A = 1
  actually owned by B = 0

=== 4. THE TEST: same connection, same query, only the tenant setting changes ===
  as tenant A: sees 1   (A owns 1)
  as tenant B: sees 0   (B owns 0)
  PASS — EXISTS policy resolves tenancy through the parent correctly

=== 5. fail-closed check: no tenant context set at all ===
  with no app.current_company_id: sees 0   (expected 0 — fails closed)
  PASS

=== 6. the auth path must still work: runAsSystem equivalent ===
  with app.bypass_rls='on': sees 1   (expected 1 — login/refresh unaffected)
  PASS
```

**5. AI role permission block (Docker test DB)**
```text
ERROR:  permission denied for table User
```

**6. `bash apps/api/test/run-e2e.sh`**
```text
Starting throwaway Postgres container...
parilink-test-db
Waiting for Postgres to be ready...
Running migrations on throwaway DB as superuser (DDL requires superuser)...
Creating non-superuser test role so RLS is enforced...
Setting up AI role...
Switching connection to non-superuser — RLS will now apply for all subsequent operations...
Verifying RLS is actually live before running anything else...
 current_user  | usesuper 
---------------+----------
 parilink_test | f
(1 row)

RLS confirmed live and forced on sentinel tables (Trip, Invoice, Vehicle).
Seeding test DB as non-superuser (seed uses runAsSystem internally)...
Flushing Redis...
OK
Running E2E Suites...

Test Suites: 4 passed, 4 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        61.242 s
Ran all test suites matching /test\/auth.e2e-spec.ts|test\/dto-validation.e2e-spec.ts|test\/integrations-security.e2e-spec.ts|test\/soft-delete-references.e2e-spec.ts/i.
Cleaning up throwaway containers...
```

---

### STEP 4 — THE AI ROLE, EMPIRICALLY (on the main DB)
Tested using company ID `1aec167b-473a-4663-86d8-695963f3a4f3` which truly has 8 Trips in `parilink_db`:
```text
BEGIN
SET
SET
           current_setting            
--------------------------------------
 1aec167b-473a-4663-86d8-695963f3a4f3
(1 row)

 set_config 
------------
 on
(1 row)

 count 
-------
     8
(1 row)

ROLLBACK
```
(Bypass escape hatch is closed for this role — the restrictive policy holds perfectly). And testing `User` access:
```text
SET
ERROR:  permission denied for table User
```

---

### STEP 5 — CHECK THE MIGRATION TABLE IS SANE
```text
       migration_name        |           finished_at           |          rolled_back_at          
-----------------------------+---------------------------------+----------------------------------
 20260901000001_ai_no_bypass |                                 | 2026-09-01 08:35:38.747008+05:30
 20260901000001_ai_no_bypass |                                 | 2026-09-01 08:35:29.68118+05:30
 20260901000001_ai_no_bypass | 2026-09-01 08:43:19.15952+05:30 | 
(3 rows)
```

---

### STEP 6 — COMMIT
Because `fuel-intelligence.service.ts` was already restored and its uncommitted state matched the last commit, there were no unstaged changes for it. 

**`git status --short`**
```text
```
*(Empty, everything is perfectly clean and committed)*

**`git log --oneline -6`**
```text
f9f17e3 fix(security): close the CORS blanket allow, move AI role provisioning out of the migration
8d376ae chore(test): move scratch tooling under test/scratch
3cc6b9d fix(deploy): provision AI role as superuser, not app user
b645f92 fix(api): make the API compile again
3a1dce9 Security: Wire structural SQL validator into HTTP endpoint
86b8493 Security: Add PG_SLEEP to blocked SQL keywords in structural validator
```
