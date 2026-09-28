# PariLink — error text, round 2

The previous run gave exit codes without error output. Exit codes say something
failed; they do not say what. This run collects the actual errors. Same rules.

## Rules
1. Paste RAW output. Do not summarize, do not describe.
2. Do NOT fix anything. Do NOT edit any file. Measurement only.
3. Do not create .md files or write a readiness assessment.
4. If a command cannot run, say "CANNOT RUN: <reason>" and continue.
5. Run each block from the repo root unless told otherwise.

## 1 — Web build failure (highest priority)

This is the blocker: `npm run build -w apps/web` exits 1, and the Docker build
fails at the same step.

```
cd apps/web
npx next build 2>&1 | tail -80
echo "EXIT=${PIPESTATUS[0]}"
```
Paste ALL 80 lines. If the error names a module, a file, or a page, that is the
answer we need.

## 2 — Typecheck errors, both apps

```
cd apps/api
npx prisma generate 2>&1 | tail -5; echo "PRISMA_EXIT=${PIPESTATUS[0]}"
npx tsc --noEmit 2>&1 | head -60
npx tsc --noEmit 2>&1 | grep -c "error TS"
```

```
cd apps/web
npx tsc --noEmit 2>&1 | head -60
npx tsc --noEmit 2>&1 | grep -c "error TS"
npx tsc --noEmit 2>&1 | grep -oE "error TS[0-9]+" | sort | uniq -c | sort -rn
```
Paste the first 60 error lines and the totals for each app.

## 3 — The two failing suites

Both failed every test in about 1.5 seconds, which usually means the suite never
started rather than that the assertions failed. Find out which.

```
cd apps/api
npx jest --config ./test/jest-e2e.json test/dto-validation.e2e-spec.ts 2>&1 | head -80
```
```
cd apps/api
npx jest --config ./test/jest-e2e.json test/soft-delete-references.e2e-spec.ts 2>&1 | head -80
```
Paste both. Specifically: is there a `beforeAll` / `beforeEach` error, a
connection error, or a module-resolution error at the top? Or are these genuine
assertion failures with expected/received values?

## 4 — SAML advisory, full text

The previous `head -60` truncated before the critical entry.
```
npm audit --workspace=apps/api 2>&1 | grep -B3 -A12 "passport-saml"
npm audit --workspace=apps/api 2>&1 | grep -A6 -i "critical"
npm ls passport-saml @xmldom/xmldom 2>&1 | head -20
```

## 5 — Seed row counts

The seed printed "Demo data seeded successfully" twice but no counts, so
idempotency is unproven — running twice without error is not the same as
producing the same rows.

```
psql -U parilink -d parilink_db -h localhost -c '
SELECT ''Load'' t, count(*) FROM "Load"
UNION ALL SELECT ''Vehicle'', count(*) FROM "Vehicle"
UNION ALL SELECT ''Driver'', count(*) FROM "Driver"
UNION ALL SELECT ''Customer'', count(*) FROM "Customer"
UNION ALL SELECT ''Invoice'', count(*) FROM "Invoice"
UNION ALL SELECT ''Trip'', count(*) FROM "Trip";'
```
Then run the seed ONE more time, then run that exact query again. Paste both
result sets. If any count changed, the seed is not idempotent.

## 6 — Does the web app run at all outside Docker?

```
cd apps/web && (npm run dev > /tmp/webdev.log 2>&1 &) ; sleep 25
curl -s -o /dev/null -w "login:%{http_code}\n" localhost:3000/login
curl -s localhost:3000/login | grep -c 'type="email"'
tail -30 /tmp/webdev.log
pkill -f "next dev" || true
```
This tells us whether the smoke suite failed because the app is broken or
because nobody started it.

## 7 — Report

For each of 1–6: one line saying what the error actually is. No fixes, no plan,
no assessment. Just the diagnosis of each failure.
