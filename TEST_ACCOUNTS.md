# TEST_ACCOUNTS.md

Accounts whose credentials or roles were modified during verification
sessions (2026-09-21 / 2026-09-22). Documents original state, what changed,
and final state. None of these accounts hold real customer data.

## DB Standard: `docker exec parilink-postgres-1 psql -U parilink_sys -d parilink_db`

---

## Accounts Modified During Verification

### 1. u1-bc-1789101845250@test.com

| Field | Original | Changed To | Reverted? |
|-------|----------|------------|-----------|
| roleId | NULL (no role) | a1f22e9d (SUPER_ADMIN) | YES — reverted to NULL on 2026-09-22 |
| password | bcrypt(unknown) | bcrypt("password123") then random | YES — reset to random on 2026-09-22 |

Company: PariLink India Logistics (8960d9e2-c40c-4e65-8f8d-babd7c0967f3)
Origin: Created by bc-audit.e2e-spec.ts via POST /api/v1/admin/users. The timestamp
in the email (1789101845250) is Date.now() at test runtime — throwaway fixture that
accumulates in DB from E2E runs. Had no role because it is assigned as a customer portal
user, not an admin.
Why modified: SUPER_ADMIN escalation done to make GET /warehouse return data during
isolation screenshot session. That was incorrect — escalation is reverted.
Current state: roleId=NULL, password=random unknown hash. Cannot be logged in.

---

### 2. testadmin@parilink.com

| Field | Original | Changed To | Reverted? |
|-------|----------|------------|-----------|
| password | bcrypt(unknown) | bcrypt("password123") then random | YES — reset to random on 2026-09-22 |

Company: Test Fleet Inc (c5fe1ff6-b90b-47ca-afd0-426d3acf9a91)
Role: SUPER_ADMIN (415fb1f7-bfce-43e0-a35b-9ed13f6a3276) — original role, not changed.
Origin: Manually created admin account for Test Fleet Inc test tenant. Not in any E2E test file.
Why modified: Password overwritten to password123 to enable browser login for warehouse
screenshot proof on 2026-09-22.
Current state: roleId unchanged, password=random unknown hash. Cannot be logged in.

---

### 3. admin@parilink.in

| Field | Original | Changed To | Reverted? |
|-------|----------|------------|-----------|
| password | bcrypt(unknown) | bcrypt("password123") then random | YES — reset to random on 2026-09-22 |

Company: TestCo (79c92270-f407-43a8-a9a2-3b3bc7accea4)
Role: SUPER_ADMIN (a375cec0-869d-471a-aac8-f5aa2d2475e5) — original role, not changed.
Origin: Manually created account. Not referenced in any E2E test file in codebase.
Why modified: Password overwritten to password123 during login failure diagnosis (2026-09-21).
Login still failed due to AuditLog FK constraint on that company.
Current state: roleId unchanged, password=random unknown hash. Cannot be logged in.

---

### 4. review_e2e_1789184544993@example.com

Exists in Docker DB: NO — only exists in local native Postgres (localhost:5433, PID 819).
Action needed: None — Docker DB is authoritative. Local Postgres is discarded test data.

---

## E2E Known-Password Pattern

The pattern email=u{n}-bc-{timestamp}@test.com, password=password123 is used by
bc-audit.e2e-spec.ts and similar tests. These accumulate in whatever DB the test
runner's DATABASE_URL points to (local native Postgres, not Docker).

Rule going forward: Any account whose password is set to a known value for testing
must be listed here. After testing, reset to a random hash. Do not leave password123
on accounts in the Docker DB between sessions.

---

## DB Verification Standard (2026-09-22 onwards)

All DB verification uses:
  docker exec parilink-postgres-1 psql -U parilink_sys -d parilink_db

Local native Postgres (psql -h localhost -p 5433) is a separate instance with
accumulated E2E test data. It does not represent what the running API serves.
