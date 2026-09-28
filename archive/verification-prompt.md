# PariLink — evidence run

Repo: NestJS + Next.js monorepo at this project root. Do NOT fix anything.
Do NOT refactor. Do NOT create summary documents. This task is measurement only.

## Rules — these matter more than the results

1. Paste RAW terminal output for every command, inside code fences. A description
   of a result is not a result. "Tests passed" is not acceptable; the summary
   line from the runner is.
2. If a command fails, paste the failure and MOVE ON. Do not fix it. Do not retry
   with different flags to get a nicer answer. A failure is a valid finding.
3. Do not skip a command because you believe you know the answer.
4. Do not edit any test, config, Dockerfile, or source file at any point.
5. If you cannot run something (no Docker, no DB, missing binary), say
   "CANNOT RUN: <reason>" and continue. Do not simulate or infer the output.
6. Answer every numbered item. If an item is not applicable, say why.

## Part 1 — Environment

```
node -v; npm -v; docker --version; docker compose version; psql --version
git rev-parse --abbrev-ref HEAD; git log --oneline -5; git status --short
```

Is Postgres running and reachable? Is Redis? Paste how you determined it.

## Part 2 — Verify six specific claims

These came from a static audit. Confirm or refute each with output.

**2.1 — Secrets committed to git**
```
git ls-tree -r HEAD --name-only | grep -E "^\.env\.bak$|^token\.json$"
git show HEAD:.env.bak | grep -oE "^[A-Z_0-9]+=" | wc -l
git show HEAD:.env.bak | grep -cE "=(changeme|placeholder|your_|xxx|CHANGE|<)"
git log --oneline -- .env.bak
```
Do NOT print secret values. Key names and counts only.

**2.2 — SAML advisory**
```
npm audit --workspace=apps/api 2>&1 | head -60
grep -n '"passport-saml"' apps/api/package.json
grep -rn "passport-saml" apps/api/src --include=*.ts
```

**2.3 — Unauthenticated telemetry endpoint**
Open `apps/api/src/marketplace/telemetry-ingress/telemetry-ingress.controller.ts`
and `telemetry-ingress.service.ts`. Paste both files in full. Specifically state:
does the controller have any guard or HMAC check, and does the service take
`companyId` from the request body?

**2.4 — RLS bypass count**
```
grep -rho "runAsSystem(\s*'[^']*'" apps/api/src --include=*.ts | sort | uniq -c | sort -rn
grep -rln "TenantGuard" apps/api/src --include=*.controller.ts
```

**2.5 — The password blocker**
```
grep -rn "Password123!" tests apps/api/test apps/web/tests scripts apps/api/prisma
sed -n '15,30p' apps/web/tests/global.setup.ts
```

**2.6 — Dockerfile standalone COPYs**
```
grep -n "COPY --from=builder" apps/web/Dockerfile
grep -n "npm ci\|npx tsc" apps/web/Dockerfile
```

## Part 3 — Does it actually run? (the important part)

Run each. Paste the FULL summary line from each runner — the one with
pass/fail/total counts — plus the exit code.

```
cd apps/api && npx prisma generate && npx tsc --noEmit; echo "API_TYPECHECK_EXIT=$?"
cd apps/web && npx tsc --noEmit; echo "WEB_TYPECHECK_EXIT=$?"
npm run build -w apps/api; echo "API_BUILD_EXIT=$?"
npm run build -w apps/web; echo "WEB_BUILD_EXIT=$?"
```

Then the API e2e suites — auth, dto-validation, integrations-security,
soft-delete-references. Run each, paste each summary line and exit code.

Then the Playwright smoke suite:
```
npm run test:e2e -w apps/web; echo "SMOKE_EXIT=$?"
```
Paste the summary line (e.g. "X passed, Y failed") and, if anything fails,
the name of each failing spec. Do not delete or skip failing tests.

## Part 4 — Container

```
docker compose build web 2>&1 | tail -30; echo "BUILD_EXIT=$?"
docker run -d -p 3100:3000 --name pl-verify <image-tag-from-above>
sleep 8
curl -s -o /dev/null -w "login:%{http_code}\n" localhost:3100/login
curl -s localhost:3100/login | grep -c 'type="email"'
```
Extract three `/_next/static/...` URLs from that HTML and curl each, pasting the
status codes. Then `docker rm -f pl-verify`.
Any 404 on a static asset is the finding — report it, do not fix it.

## Part 5 — Data

```
npx ts-node scripts/seed-demo.ts   # or whatever the seed entrypoint is
```
Run it TWICE. Paste row counts after each run — they must match if it is
idempotent. Then:
```sql
SELECT "companyId", count(*) FROM "Load" GROUP BY "companyId";
SELECT email, "companyId" FROM "User" WHERE email LIKE '%admin%';
```
Paste both result sets. The question being answered: does seeded data land in
the same company as the admin account used to log in?

## Part 6 — Report back

A table, one row per item above: item · ran? · result · exit code.
Then answer these three directly:

1. How many of the four API e2e suites are green, with the summary line for each?
2. Do `apps/api` and `apps/web` both typecheck and build, with all four exit codes?
3. Which of the six claims in Part 2 did you CONFIRM, and which did you REFUTE?

Do not write a readiness assessment. Do not create any .md files. Just the
numbers and the raw output.
