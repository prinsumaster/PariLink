# PariLink — Day 2 verification. Four items are not closed.

The last report claimed six items closed. Four are not. This is not a rebuke —
the work on items 2, 3 and 5 was real. But the proofs do not support the claim,
and one item was never attempted. Correct them in this order.

## Rules
Raw output only. No summaries. If something cannot be done, write
"NOT DONE: <reason>". That is always acceptable. A claim without its proof is
not.

---

# A — Item 1 was never attempted  [CRITICAL — do this first]

There is no output anywhere in the last report for item 1. No `git rm --cached`,
no `.gitignore` change, no revocation status. It was reported closed as part of
"all 6" without being run.

`.env.bak` with 21 live credentials is still in HEAD.

```
git ls-files | grep -E "\.env\.bak|token\.json|\.auth/user\.json"
```
If that prints anything, run:
```
git rm --cached .env.bak token.json apps/web/tests/.auth/user.json
printf '\n.env.bak\ntoken.json\napps/web/tests/.auth/\n' >> .gitignore
git add .gitignore && git commit -m "security: untrack committed secrets and session state"
git ls-files | grep -E "\.env\.bak|token\.json|\.auth/user\.json" && echo "STILL TRACKED" || echo "CLEAN"
```
Paste both greps.

Then answer in plain words, one line each — RAZORPAY, TWILIO, RESEND, MAPBOX,
MINIO: has this key been revoked and reissued at the provider? "Not done" is a
valid answer for each. Do not guess.

---

# B — Item 6's spec does not test what was asked

The spec asserts:
```js
if (res.status === 500) { failures.push({ route, status: res.status }); }
expect(failures).toHaveLength(0);
```
The requirement was `POST {} -> 400`. An endpoint that returns **201 for an
empty body** — the precise bug this whole audit is about — PASSES this test.
The assertion was widened from "must validate" to "must not crash".

Two more problems:
- The run took 199 ms. Several hundred POST routes over HTTP cannot complete in
  199 ms. Likely the router walk found almost nothing.
- `console.log("Found X POST routes")` was never reported.

### B1 — How many routes did it actually find?
```
cd apps/api && npx jest --config test/jest-e2e.json test/dto-coverage.e2e-spec.ts 2>&1 | grep -i "found.*routes"
```
Paste it. If that number is under 100, the enumeration is broken — the audit
counted 396 write endpoints, of which ~250 are POST.

### B2 — Fix the assertion to the actual requirement
```js
const ACCEPTABLE = [400, 401, 403];   // 401/403 = guard fired before the DTO; still validated
const failures = [];
for (const route of uniqueRoutes) {
  const res = await request(server).post(route.replace(/:[a-zA-Z]+/g, 'test-id'))
    .set('Authorization', `Bearer ${jwtToken}`).send({});
  if (!ACCEPTABLE.includes(res.status)) {
    failures.push({ route, status: res.status });
  }
}
console.log(`ROUTES TESTED: ${uniqueRoutes.length}`);
console.log(`UNVALIDATED (${failures.length}):`);
failures.forEach(f => console.log(`  ${f.status}  POST ${f.route}`));
expect(failures).toHaveLength(0);
```

### B3 — Run it and EXPECT IT TO FAIL
```
cd apps/api && npx jest --config test/jest-e2e.json test/dto-coverage.e2e-spec.ts 2>&1 | tail -60
```
Paste the route count and the FULL failure list. That list is the deliverable.
**Do not fix the failing endpoints. Do not weaken the assertion again.** Report
the count and STOP.

---

# C — Item 5 has no positive control

All four money endpoints returned 400 for `{}`. The instruction was explicit
that a 400 alone only proves the endpoint was broken. Run the second half:

```
POST /api/v1/finance/ledger/entries    <valid payload>
POST /api/v1/vendors/purchase-orders    <valid payload>
POST /api/v1/finance/wallet/expenses    <valid payload>
POST /api/v1/saas/billing/checkout      <valid payload>
```
Paste each status code. Each must be 2xx. If any returns 400 with a valid
payload, the DTO is wrong and the endpoint is now broken.

---

# D — Item 4 is not fixed, and the note in it is a bigger finding

Reported: *"Firefox in headless mode returned empty innerText (0 chars) for
every route."* Firefox still fails.

Empty innerText on **every route** is not an assertion problem. Combined with
WebKit's 111 blocked XHRs, that would mean the application works in Chromium
only. That is a launch-blocking fact if true, and it is currently buried in a
parenthetical.

```
cd apps/web
(npm run dev > /tmp/webdev.log 2>&1 &) ; sleep 25
npx playwright test tests/smoke.spec.ts --project=firefox --reporter=list 2>&1 | tail -40
```
Then open Firefox manually at http://localhost:3000/login, log in, and
screenshot the dashboard at 1440. Answer from the screenshot:
- Does the page render content, or is it blank?
- Any console errors? Paste them.
```
pkill -f "next dev" || true
```
If Firefox renders fine by hand, the finding is headless-specific. If it is
blank there too, that is a P1.

---

# E — Two things in item 2 need explaining

**E1.** The proof shows `no_secret:400`, but the case that matters is different.
The bug was: *stored credentials contain no `secretKey`, so the check is
skipped*. The test sent a request with no secret — that is not the same thing.
Create an AppInstallation whose `credentials` has NO `secretKey` field, then
POST a valid payload to it. It must be rejected.
```
psql -U parilink -d parilink_db -h localhost -c \
 'SELECT id, "companyId", "appId", credentials ? '\''secretKey'\'' AS has_secret FROM "AppInstallation" LIMIT 10;'
```
Paste it, then the status code for that case.

**E2.** The report says `@Public()` was added to the telemetry controller "so it
can be reached." Explain what was blocking it. There is no global `APP_GUARD` in
`app.module.ts`, so the endpoint was already reachable without a guard. Adding
`@Public()` marks it as intentionally unauthenticated — which is only correct if
the secret check is genuinely unconditional. Paste the current controller and
the secret-check block of the service.

---

# F — One question

`rm apps/api/seed-app.ts` was run before the typecheck passed. What was in that
file, and was deleting it necessary or a shortcut to green?
```
git log --oneline --diff-filter=D -- apps/api/seed-app.ts
git show HEAD:apps/api/seed-app.ts 2>/dev/null | head -30 || echo "was untracked"
```

---

## Report
`item · actually done? · proof · exit code`. Use "NOT DONE" freely.
Do not write "all items closed" unless every proof above is pasted above it.
