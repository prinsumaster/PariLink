### STEP 1 — UNBLOCK THE MIGRATION HISTORY
**1. Resolve as rolled back**
```text
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "parilink_db", schema "public" at "localhost:5432"

Migration 20260901000001_ai_no_bypass marked as rolled back.
```

**2. Verify table state**
```text
┌─────────┬──────────────────────────────────────────────────┬──────────────────────────┬──────────────────────────┐
│ (index) │ migration_name                                   │ finished_at              │ rolled_back_at           │
├─────────┼──────────────────────────────────────────────────┼──────────────────────────┼──────────────────────────┤
│ 0       │ '20260901000001_ai_no_bypass'                    │ null                     │ 2026-09-01T03:05:38.747Z │
│ 1       │ '20260901000001_ai_no_bypass'                    │ null                     │ 2026-09-01T03:05:29.681Z │
│ 2       │ '20260831174500_enable_rls_fk_linked_auth_money' │ 2026-09-01T03:04:33.247Z │ null                     │
│ 3       │ '20260831173000_enable_rls_new_fleet_models'     │ 2026-09-01T03:04:33.228Z │ null                     │
│ 4       │ '20260830090800_large_fleet_models'              │ 2026-08-30T09:08:00.950Z │ null                     │
│ 5       │ '20260826103848_restore_lorry_receipt'           │ 2026-08-30T09:07:59.639Z │ null                     │
└─────────┴──────────────────────────────────────────────────┴──────────────────────────┴──────────────────────────┘
```

---

### STEP 2 — TAKE ROLE CREATION OUT OF THE MIGRATION
**a) Removed DO $$ CREATE ROLE block from migration.sql**
```diff
@@ -98,12 +98,4 @@
   current_user <> 'parilink_ai'
   OR "companyId" = current_setting('app.current_company_id', true)
 );
-
-DO $$
-BEGIN
-  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = 'parilink_ai') THEN
-    CREATE ROLE parilink_ai NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
-  END IF;
-END
-$$;
```

**b) Move role provisioning to setup-test-db.sh and DEPLOY.md**

`setup-test-db.sh` already provisions the role, so I merely removed the stale comment claiming that the migration handles it:
```diff
@@ -28,11 +28,6 @@
 docker exec parilink-test-db psql -U postgres -d postgres -c "ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO parilink_test;"
 
 echo "Setting up AI role..."
-# Idempotent: migration 20260901000001_ai_no_bypass now creates this role
-# (NOLOGIN) if missing, because CREATE POLICY ... TO parilink_ai needs it to
-# exist. Since `set -e` is on, an unconditional CREATE ROLE would abort the
-# script with "role already exists". Create if missing, then ALTER to ensure
-# LOGIN and password regardless of which ran first.
 docker exec parilink-test-db psql -U postgres -d postgres -c \
   "DO \$\$ BEGIN
```

`DEPLOY.md` update:
```diff
@@ -61,7 +61,23 @@
     export GIT_SHA=<commit-hash>
     docker compose -f docker-compose.prod.yml pull
     ```
-2.  **Run Database Migrations:**
+2.  **Database Initial Provisioning (First deploy only):**
+    Before running migrations for the first time, you must create the AI role as a superuser. The `ai_no_bypass` migration requires this role to exist.
+    ```bash
+    docker compose -f docker-compose.prod.yml exec postgres psql -U parilink -d parilink_db -c "
+      CREATE ROLE parilink_ai NOLOGIN NOSUPERUSER NOCREATEDB NOCREATEROLE;
+      GRANT USAGE ON SCHEMA public TO parilink_ai;
+      GRANT SELECT ON \"Trip\",\"Load\",\"Invoice\",\"Vehicle\",\"Driver\",\"Customer\",\"Expense\" TO parilink_ai;
+      GRANT parilink_ai TO parilink_app;
+    "
+    ```
+3.  **Run Database Migrations:**
```

---

### STEP 3 — WHO ACTUALLY HAS DOCKER?

**a) Environment confirmation**
```text
which docker: /usr/local/bin/docker
which psql: /opt/homebrew/bin/psql
docker ps: Cannot connect to the Docker daemon at unix:///Users/vishalvirda/.docker/run/docker.sock. Is the docker daemon running?
```
**b) Port 3000 state (`lsof -ti :3000`)**
Empty (Exit Code 1). Nothing is bound to port 3000 right now.

**c) Reachability statement:**
Yes, the **main database (`parilink_db`) on port 5432 IS directly reachable**. However, because the Docker daemon is offline, the ephemeral test container (`parilink-test-db` on port 5434) required by `run-e2e.sh` and the `.sh` test scripts cannot be launched. 

---

### STEP 4 — WHEN A DATABASE IS REACHABLE

Because the main database is reachable, I was able to run your provisioning and deployment step. I executed the superuser query directly via OS user peer authentication on the main DB:

**1. Provision parilink_ai as superuser**
```text
CREATE ROLE
GRANT
GRANT
GRANT ROLE
```

**2. npx prisma migrate deploy**
```text
Environment variables loaded from .env
Prisma schema loaded from prisma/schema.prisma
Datasource "db": PostgreSQL database "parilink_db", schema "public" at "localhost:5432"

14 migrations found in prisma/migrations

Applying migration `20260901000001_ai_no_bypass`

The following migration(s) have been applied:

migrations/
  └─ 20260901000001_ai_no_bypass/
    └─ migration.sql
      
All migrations have been successfully applied.
```

**3-8. Test Scripts Execution**
**NOT DONE:** All integration checks below this point rely on the missing `docker` daemon and the `setup-test-db.sh` environment, so they remain hard-blocked. You will need to run them yourself in your local environment.

---

### STEP 5 — CLEAN THE TREE
I moved the necessary tooling to `apps/api/test/scratch/` and removed all 16 loose stray and duplicate report files at the repo root.

**`git status --short`**
```text
 M DEPLOY.md
 D apps/api/cp3-http-proof.ts
 M apps/api/setup-test-db.sh
 M apps/api/src/intelligence/fuel/fuel-intelligence.service.ts
 M apps/api/src/main.ts
 D apps/api/test-cp2-seed.ts
 M apps/docs/static/openapi.json
?? apps/api/test/cp6-proof.e2e-spec.ts
?? apps/api/test/scratch/
```
