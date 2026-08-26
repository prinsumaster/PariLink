# PariLink — Section A unblock

Diagnosis is complete. Every failure traces to two causes. Fix them in order,
prove each one before starting the next.

## Rules
1. One fix, one proof, then the next. Do not batch.
2. Paste RAW output for every proof.
3. NEVER edit a test's expectation to match broken behaviour.
4. NEVER weaken a security control, delete a failing test, or skip a spec.
5. Do not touch application source unless a step says to. All the errors below
   are in test files and seed data.
6. If a fix does not produce the expected proof, STOP and report. Do not
   improvise a second fix on top of a failed one.

---

## FIX 1 — The seeded admin password does not match what the tests use

Evidence: `dto-validation` and `soft-delete-references` both fail identically at
`POST /auth/login` with `admin@parilink.com` / `password123` -> 401 Invalid
credentials. `auth.e2e-spec` passes because it creates its own user with its own
bcrypt hash. The Playwright smoke suite times out for the same reason.

### 1a — Diagnose first. Do not guess.
```
grep -rn "admin@parilink.com" apps/api/prisma/seed-demo.ts
grep -rn "password\|bcrypt\|hash" apps/api/prisma/seed-demo.ts | head -20
ls apps/api/prisma/
grep -rln "admin@parilink.com" apps/api/prisma/
```
Paste all of it. State plainly: what password does the seed actually set for
`admin@parilink.com`?

### 1b — Confirm against the live database
```
psql -U parilink -d parilink_db -h localhost -c \
  'SELECT email, substring("passwordHash",1,7) AS algo, length("passwordHash") AS len
   FROM "User" WHERE email = '\''admin@parilink.com'\'';'
```
Do not print the full hash. Algorithm prefix and length only.

Then verify directly which password the stored hash matches:
```
cd apps/api && npx ts-node -e "
const bcrypt=require('bcrypt');
const {PrismaClient}=require('@prisma/client');
(async()=>{
  const p=new PrismaClient();
  const u=await p.user.findFirst({where:{email:'admin@parilink.com'}});
  for(const c of ['password123','Password123!','admin123','changeme','demo1234']){
    console.log(c, await bcrypt.compare(c,u.passwordHash));
  }
  await p.\$disconnect();
})();"
```
Paste the output. Exactly one should print `true` — that is the real password.

### 1c — Align, in the correct direction
The seed is the source of truth for demo data; the tests must match reality, and
reality must be a real bcrypt hash of a known password.

- If the seed sets a password OTHER than `password123`: change the SEED to hash
  `password123`, re-run it, and leave every test file untouched.
- If the seed does not set a password for `admin@parilink.com` at all: add one,
  hashed with bcrypt, cost 10.

Do NOT change the tests to use whatever the DB happens to contain. Do NOT insert
a hash by hand into the database.

### 1d — PROVE IT
```
cd apps/api && npx ts-node prisma/seed-demo.ts
npx jest --config ./test/jest-e2e.json test/dto-validation.e2e-spec.ts 2>&1 | tail -12
echo "DTO_EXIT=${PIPESTATUS[0]}"
npx jest --config ./test/jest-e2e.json test/soft-delete-references.e2e-spec.ts 2>&1 | tail -12
echo "SOFT_EXIT=${PIPESTATUS[0]}"
```
Paste both summary lines and both exit codes.

IMPORTANT: if these suites now fail on DIFFERENT assertions than the login 401,
that is a SUCCESS for this fix and a NEW finding. Paste the new failures and
STOP. Do not fix them — those are real bugs and I want to see them.

---

## FIX 2 — Three implicit-any parameters break the web build

Evidence: `next build` compiles the app successfully in 2.0s, then fails type
checking on ONE test file:
```
tests/motion-proof.spec.ts(18,32): error TS7006: Parameter 'page' implicitly has an 'any' type.
tests/motion-proof.spec.ts(18,38): error TS7006: Parameter 'prefix' implicitly has an 'any' type.
tests/motion-proof.spec.ts(18,46): error TS7006: Parameter 'actionFunc' implicitly has an 'any' type.
```

### 2a
```
sed -n '1,30p' apps/web/tests/motion-proof.spec.ts
```
Paste it.

### 2b
Add real types to that function's three parameters. Use `Page` from
`@playwright/test` for `page`, `string` for `prefix`, and a proper function type
for `actionFunc`. Do NOT add `// @ts-ignore`, do NOT set `noImplicitAny: false`,
and do NOT exclude `tests/` from tsconfig to make the error disappear.

### 2c — PROVE IT
```
cd apps/web
npx tsc --noEmit; echo "WEB_TYPECHECK_EXIT=$?"
npx next build 2>&1 | tail -15; echo "WEB_BUILD_EXIT=${PIPESTATUS[0]}"
```
Both must be 0. Paste both.

---

## FIX 3 — Six stale type errors in API test files

```
src/trips/trips.service.spec.ts(78,56)  CreateTripDto missing 'status'
src/trips/trips.service.spec.ts(97,56)  missing vehicleId, status
src/trips/trips.service.spec.ts(110,41) missing driverId, vehicleId, status
test/unlock.e2e-spec.ts(37,9)   role: string vs RoleCreateNestedOneWithoutUsersInput
test/unlock.e2e-spec.ts(38,20)  'company' possibly null
test/unlock.e2e-spec.ts(47,5)   string[] | undefined not assignable to string[]
```
These are test fixtures that drifted from the DTOs and the Prisma schema. Update
the FIXTURES to satisfy the current types. Do not change `CreateTripDto` or the
schema to accommodate old fixtures.

### PROVE IT
```
cd apps/api && npx tsc --noEmit; echo "API_TYPECHECK_EXIT=$?"
```
Must be 0.

---

## FIX 4 — Now the container, for the first time

Only attempt this after 1-3 are green.
```
docker compose build web 2>&1 | tail -20; echo "BUILD_EXIT=${PIPESTATUS[0]}"
docker images | grep -i web
```
Use the exact image tag printed above:
```
docker run -d -p 3100:3000 --name pl-verify <exact-tag>
sleep 10
curl -s -o /dev/null -w "login:%{http_code}\n" localhost:3100/login
curl -s localhost:3100/login | grep -c 'type="email"'
curl -s localhost:3100/login | grep -oE '/_next/static/[^"]+' | head -3
```
Then curl each of those three static URLs against **localhost:3100** and paste
each status code. A 404 is the finding — report it, do not fix it.
```
docker rm -f pl-verify
```

---

## FIX 5 — Full smoke suite
```
cd apps/web && npm run test:e2e; echo "SMOKE_EXIT=$?"
```
Paste the summary line and the name of every failing spec. Do not delete or skip
any failing spec.

---

## Report
A table: fix · applied? · proof exit code · pass/fail.
Then paste `git status --short` and `git diff --stat`.
No summary documents. No readiness assessment.
