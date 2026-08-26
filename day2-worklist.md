# PariLink — Day 2. Security first, blast radius order.

Section A is closed. All four API suites green, both apps typecheck and build,
the image builds and renders correctly, the seed is idempotent in both orders,
Chromium passes all 63 smoke routes.

This list is ordered by blast radius. Do them IN ORDER. One fix, one proof, then
the next.

## Rules
1. One fix, one proof. Do not batch. Do not start item N+1 before item N proves.
2. Paste RAW output for every proof.
3. Never weaken a security control, delete a spec, or edit an assertion to match
   broken behaviour.
4. A 404 without a positive control proves nothing. Where a proof asks for both
   a negative AND a positive case, both are required.
5. If a fix does not produce its expected proof, STOP and report. Do not stack a
   second fix on a failed one.
6. No summary documents. No readiness assessments.

---

# 1 — Secrets out of git  [CRITICAL]

`.env.bak` is tracked in HEAD with 21 populated credentials. `token.json` is
tracked. `apps/web/tests/.auth/user.json` is tracked and holds a live session
cookie.

### 1a — Stop the bleeding
```
git rm --cached .env.bak token.json apps/web/tests/.auth/user.json
printf '\n.env.bak\ntoken.json\napps/web/tests/.auth/\n' >> .gitignore
git add .gitignore
git commit -m "security: untrack .env.bak, token.json and playwright auth state"
```

### 1b — PROVE IT
```
git ls-files | grep -E "\.env\.bak|token\.json|\.auth/user\.json" && echo "STILL TRACKED" || echo "CLEAN"
git check-ignore -v .env.bak token.json apps/web/tests/.auth/user.json
```

### 1c — The part that actually matters
The file is still in history. Removing it from HEAD does not un-leak it. List
every third-party credential in it — do NOT print values:
```
git show HEAD~1:.env.bak | grep -oE "^[A-Z_0-9]+=" | sort
```
For each of RAZORPAY, TWILIO, RESEND, MAPBOX, MINIO: these do not rotate
themselves. State for each whether it has been revoked and reissued at the
provider. "Not done" is an acceptable answer. Guessing is not.

History rewrite (`git filter-repo`) is a separate decision — do not run it now,
just report whether the repo has been pushed anywhere it cannot be force-pushed.

---

# 2 — Unauthenticated cross-tenant write  [CRITICAL]

`POST /api/v1/ingress/telemetry` has no guard, no HMAC, and no DTO. The service
trusts `payload.companyId` and writes through `runAsSystem`, which bypasses RLS.
The only check is `if (creds?.secretKey && ...)` — skipped entirely when the
stored credentials have no `secretKey`.

### 2a — Fix, in `telemetry-ingress.service.ts` and its controller
- Make the secret check UNCONDITIONAL. Missing stored secret = reject.
- Compare with `crypto.timingSafeEqual`, not `!==`.
- Add a real class-validator DTO for the payload (`@IsString`, `@IsArray`,
  `@ValidateNested` on records). It is currently an `import type`, so the global
  ValidationPipe cannot see it.
- Write with `runAsTenant(installation.companyId, ...)` — the INSTALLATION's
  companyId, never the payload's.

### 2b — PROVE IT, all four cases
```
# 1. empty body -> 400 (DTO fires)
curl -s -o /dev/null -w "empty:%{http_code}\n" -X POST localhost:8080/api/v1/ingress/telemetry \
  -H 'Content-Type: application/json' -d '{}'

# 2. valid appId+companyId, WRONG secret -> 401
# 3. valid appId+companyId, NO secret field -> 401  (this is the actual bug)
# 4. POSITIVE CONTROL: correct secret -> 202
```
Build cases 2-4 from a real AppInstallation row. Paste the row (redact the
secret), all four status codes, and then prove the write landed in the right
tenant:
```
psql -U parilink -d parilink_db -h localhost -c \
 'SELECT "companyId", count(*) FROM "VehicleLocation" GROUP BY "companyId";'
```
Case 4 must add rows to the installation's company and NO other.

---

# 3 — WebKit cannot talk to the API at all  [HIGH — new]

111 CORS failures in WebKit; Chromium passes. Every one is a direct
cross-origin XHR to `http://localhost:8080/api/v1/...`.

Note: `next.config.ts` already defines a same-origin proxy:
```
source: "/backend/:path*"  ->  `${backendUrl}/api/:path*`
```
If the client called through that proxy, there would be no cross-origin request
and no CORS to configure. Diagnose before fixing.

### 3a — Diagnose
```
grep -rn "NEXT_PUBLIC_API_URL\|baseURL\|axios.create\|API_URL" apps/web/src/lib/ apps/web/src/services/ | head -20
grep -n "NEXT_PUBLIC_API_URL\|API_INTERNAL_URL" .env apps/web/.env.local 2>/dev/null
sed -n '170,200p' apps/api/src/main.ts
```
Paste all of it. State: does the browser call the API directly, or through
`/backend`? And what exactly does the CORS callback compare?

### 3b — Then report which fix you recommend, and STOP
Two options: (a) point the client at the `/backend` proxy so requests are
same-origin, or (b) correct the CORS origin list and credentials handling.
Do not implement either yet. Say which and why.

---

# 4 — The Firefox 304  [LOW — test defect, not an app defect]

```
Error: Route /tracking returned status 304
expect(response?.ok(), ...).toBeTruthy()
```
`response.ok()` is true only for 200-299. **304 Not Modified is a correct
response** — it means the browser holds a valid cached copy. Firefox caches
where Chromium revalidates. The route works; the assertion is too narrow.

This is the one place in this list where changing a test is correct, because the
current assertion encodes a wrong belief about HTTP. Widen it:
```
expect(response?.ok() || response?.status() === 304, `Route ${route} returned status ${response?.status()}`).toBeTruthy();
```
Do NOT remove the route, skip the spec, or drop the assertion.

### PROVE IT
```
cd apps/web
(npm run dev > /tmp/webdev.log 2>&1 &) ; sleep 25
npx playwright test tests/smoke.spec.ts --project=firefox --reporter=list 2>&1 | tail -20
pkill -f "next dev" || true
```
Firefox must now pass all routes. WebKit will still fail on item 3 — expected.

---

# 5 — Money DTOs  [HIGH]

Four endpoints take `any` as a request body, so the global ValidationPipe never
fires:
```
POST /finance/ledger/entries          payload: any
POST /vendors/purchase-orders          data: any
POST /finance/wallet/expenses          data: any
POST /saas/billing/checkout            dto: { planId, successUrl, cancelUrl }  (inline type)
```
Add a class-validator DTO to each. One at a time.

### PROVE EACH
```
curl -s -o /dev/null -w "empty:%{http_code}\n" -X POST localhost:8080/api/v1/<route> \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '{}'
curl -s -o /dev/null -w "valid:%{http_code}\n" -X POST localhost:8080/api/v1/<route> \
  -H "Authorization: Bearer $TOKEN" -H 'Content-Type: application/json' -d '<valid payload>'
```
Empty must be 400. Valid must be 2xx. **Both are required** — a 400 alone only
proves you broke the endpoint.

---

# 6 — The regression spec that would have caught all of this  [HIGH]

Write `apps/api/test/dto-coverage.e2e-spec.ts`: for EVERY POST endpoint that
creates a resource, assert `POST {}` returns 400.

Enumerate the routes from the Nest router at runtime rather than hand-listing
them, so the spec cannot drift:
```ts
const server = app.getHttpServer();
const router = server._events.request._router;
const postRoutes = router.stack
  .filter((l: any) => l.route?.methods?.post)
  .map((l: any) => l.route.path);
```
Skip only auth/webhook/ingress routes, and put the skip list in one named
constant with a comment saying why each is exempt.

### PROVE IT
```
cd apps/api && npx jest --config ./test/jest-e2e.json test/dto-coverage.e2e-spec.ts 2>&1 | tail -30
```
Paste the full failure list. **Expect it to fail the first time** — that list IS
the finding, and it tells us how many of the 68 flagged endpoints are genuinely
unvalidated. Do not fix them yet. Report the count and STOP.

---

## Report after each item
`item · fixed? · proof output · exit code`. Then `git status --short`.
Stop at any item that will not prove. Partial results beat a clean-looking lie.
