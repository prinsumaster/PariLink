# PariLink — get the real numbers. Two rounds in, three items still don't hold.

Honest status of the last round:
- Item 2 (telemetry): GENUINELY FIXED. `has_secret=f` -> 401 proves the actual bug
  is closed. No more work needed. Good.
- Item 4 (Firefox): acceptable. Renders content; the run died on a server crash,
  not an app bug.
- Item 1, 5, 6: NOT resolved. Item 6 is producing a false number. Fix below.

Rules: raw output only, no fixes unless a step says so, "NOT DONE" always allowed.

---

## FIX 6 — The coverage test is broken. 266/266 returned 404.

Every single route returned **404**, which does not mean "unvalidated." It means
the request never reached a route — so it never reached the ValidationPipe. The
number "266 unvalidated" is false. This is the THIRD version of this test that
does not work, because a fresh `createNestApplication()` does NOT run main.ts's
`setGlobalPrefix('api')` + `enableVersioning()`, so the paths it enumerates don't
match the paths it POSTs to.

Stop fighting the in-process app. There is a LIVE server on :8080 that we have
already proven works with curl. And `swagger.json` in the repo root enumerates
every route authoritatively. Use both.

### 6a — Enumerate POST routes from swagger, hit the live server
Make sure the API is running on :8080, then:
```bash
cd ~/Desktop/PariLink   # or wherever the repo root is

# get a valid session
curl -s -c /tmp/ck.txt localhost:8080/api/v1/health > /dev/null
CSRF=$(grep XSRF-TOKEN /tmp/ck.txt | awk '{print $7}')
JWT=$(curl -s -X POST localhost:8080/api/v1/auth/login \
  -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck.txt -H 'Content-Type: application/json' \
  -d '{"email":"admin@parilink.com","password":"password123"}' | jq -r '.access_token')

# pull every POST path from swagger.json, substitute :params, POST {} to each
node -e '
const s=require("./swagger.json");
const out=[];
for (const [p,methods] of Object.entries(s.paths||{})) {
  if (methods.post) out.push(p);
}
console.log(out.join("\n"));
' > /tmp/postroutes.txt
wc -l /tmp/postroutes.txt

echo "status  route" > /tmp/dtoscan.txt
while read raw; do
  # swagger uses {id}; turn into a real-ish value
  url=$(echo "$raw" | sed -E 's/\{[^}]+\}/test-id/g')
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:8080/api/v1$url" \
    -H "Authorization: Bearer $JWT" -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck.txt \
    -H "Content-Type: application/json" -d '{}')
  echo "$code  POST $url" >> /tmp/dtoscan.txt
done < /tmp/postroutes.txt
```

### 6b — Report the breakdown, do not fix anything
```bash
echo "=== how many of each status ==="
awk 'NR>1{print $1}' /tmp/dtoscan.txt | sort | uniq -c | sort -rn
echo
echo "=== the ONLY list that matters: 200/201 on empty body = UNVALIDATED ==="
grep -E '^(200|201)' /tmp/dtoscan.txt
echo
echo "=== still 404 (route/param mismatch, exclude from the count) ==="
grep -E '^404' /tmp/dtoscan.txt | wc -l
```
Paste all three blocks. The `200/201` list is the real finding — the genuine
count of endpoints that accept an empty body. If it's short, most endpoints are
fine and my audit over-counted. If it's long, we finally have the true number.
Do NOT fix them. Report the count and STOP.

---

## FIX 5 — The money endpoints reject valid payloads too. Show me why.

Positive controls were 400/400/400/404. "Properly validated but technically fail"
is a guess, not evidence. Get the response BODY so we can see whether the DTO is
too strict or the payload was wrong:
```bash
for route in finance/ledger/entries vendors/purchase-orders finance/wallet/expenses; do
  echo "===== $route ====="
  curl -s -X POST "localhost:8080/api/v1/$route" \
    -H "Authorization: Bearer $JWT" -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck.txt \
    -H "Content-Type: application/json" \
    -d "$(cat /tmp/valid_$(echo $route|tr / _).json 2>/dev/null || echo '{}')"
  echo
done
```
Actually simpler — just re-send each valid payload from last round and print the
body (drop the `-o /dev/null`). Paste each JSON error body. A `message` array from
class-validator tells us exactly which field the DTO rejected. That distinguishes
"DTO too strict" (a real bug) from "my test data was incomplete" (not a bug).

For `saas/billing/checkout` returning 404: the `SubscriptionPlan` query returned
no rows last round. State plainly — is the 404 because planId 'pro' doesn't exist
in the seed, or because the route is wrong?

---

## FIX 1 — Reconcile the secret. And the real exposure is untouched.

Last round `git ls-files | grep env.bak` was empty. But two rounds ago,
`git ls-tree -r HEAD --name-only` listed `.env.bak` and `token.json`. Those
contradict. Settle it directly:
```bash
git ls-tree -r HEAD --name-only | grep -E '\.env\.bak|token\.json|\.auth'
git log --oneline -- .env.bak | head -3
git log --oneline -- token.json | head -3
```
If HEAD still tracks them, run the `git rm --cached` step. If a recent commit
removed them, say which commit.

Either way, the file is in HISTORY and the third-party keys are live. This has now
been deferred three rounds. It is the oldest open P0. For each — RAZORPAY, TWILIO,
RESEND, MAPBOX, MINIO — one line: revoked at the provider yet? "Not done" is
honest; silence is not. This is not a coding task and I cannot verify it from
here — it is the one thing on this whole list only you can do.

---

## Report
Table: item · resolved? · the number or the reason. Then `git status --short`.
No "all closed." No summary doc.
