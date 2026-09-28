# PariLink — the real number, then the honest final table. Last one.

Two parts. Part 1 is the one-line fix that finally measures validation coverage.
Part 2 is the honest close-out. No fixes in Part 2 — just an accurate state.

Rules: raw output, "NOT DONE"/"Unknown" always allowed, no summary docs, do not
edit tests or weaken controls.

---

## PART 1 — The real unvalidated count

The scan double-prefixed the URL (`/api/v1/api/v1/...`), so all 265 were 404.
Swagger paths already include `/api/v1`. Fix: hit the path directly.

```bash
cd ~/Desktop/PariLink
# ensure API up on :8080, then fresh session
curl -s -c /tmp/ck.txt localhost:8080/api/v1/health > /dev/null
CSRF=$(grep XSRF-TOKEN /tmp/ck.txt | awk '{print $7}')
JWT=$(curl -s -X POST localhost:8080/api/v1/auth/login \
  -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck.txt -H 'Content-Type: application/json' \
  -d '{"email":"admin@parilink.com","password":"password123"}' | jq -r '.access_token')

node -e 'const s=require("./swagger.json");for(const[p,m]of Object.entries(s.paths||{}))if(m.post)console.log(p)' > /tmp/postroutes.txt

echo "status  route" > /tmp/dtoscan.txt
while read raw; do
  url=$(echo "$raw" | sed -E 's/\{[^}]+\}/test-id/g')
  code=$(curl -s -o /dev/null -w "%{http_code}" -X POST "localhost:8080$url" \
    -H "Authorization: Bearer $JWT" -H "X-XSRF-TOKEN: $CSRF" -b /tmp/ck.txt \
    -H "Content-Type: application/json" -d '{}')
  echo "$code  POST $url" >> /tmp/dtoscan.txt
done < /tmp/postroutes.txt

echo "=== status breakdown ==="
awk 'NR>1{print $1}' /tmp/dtoscan.txt | sort | uniq -c | sort -rn
echo
echo "=== 200 or 201 on empty body = GENUINELY UNVALIDATED (the finding) ==="
grep -E '^(200|201)' /tmp/dtoscan.txt
echo
echo "=== 404 remaining (route/param mismatch, not a validation result) ==="
grep -cE '^404' /tmp/dtoscan.txt
```

Expected now: mostly 400 (validated, rejected empty) and 401/403 (guard fired
first). Paste the breakdown and the full 200/201 list. If that list is empty,
every POST endpoint either validates or is guarded — a genuinely strong result.
If it has entries, those exact routes are the real work. Do NOT fix them here.
Report the count.

Spot-check that the scan is honest — one route we KNOW rejects empty:
```bash
grep "finance/ledger/entries" /tmp/dtoscan.txt   # should be 400, not 404
```

---

## PART 2 — The honest final table (no fixes, just truth)

### 2a — Cleanup the stray artifacts first
```bash
ls -la apps/web/apps 2>/dev/null && echo "STRAY DIR EXISTS"
rm -rf apps/web/apps        # accidental nested dir from an earlier command
rm -f cookies.txt           # stray session cookie in repo root
git status --short
```
Confirm `apps/web/apps/` is gone and nothing important was removed.

### 2b — Every suite, one more time, all green together
```bash
cd apps/api
for s in auth dto-validation integrations-security soft-delete-references dto-coverage; do
  npx jest --config test/jest-e2e.json test/$s.e2e-spec.ts 2>&1 | grep -E "Tests:|Test Suites:"
  echo "  ^ $s"
done
```
Paste each summary line.

### 2c — Fill this table from EVIDENCE gathered across all rounds. Use "Unknown"
freely — it is the correct answer for anything never exercised.

| module | verified how | demo-ready? | known issues |
|---|---|---|---|
| auth / login | auth.e2e 7/7, live login works | | |
| tenant isolation | telemetry 401 proof; runAsTenant everywhere | | 449 runAsSystem bypasses untriaged |
| loads / dispatch | ? | | |
| fleet / vehicles | ? | | |
| finance (money DTOs) | 4 endpoints validated + positive control | | valid 2xx needs real FK seed |
| admin / users | ? | | 79 endpoints never exercised |
| telemetry ingress | fixed + proven | | CSRF blocks external providers? |
| everything else | Part 1 scan | | |

Fill every cell honestly. "Unknown" where there is no evidence.

### 2d — The three things most likely to break first in a demo, and how you'd
notice each. Be specific (which screen, which action, what the failure looks like).

### 2e — Final state
```bash
git status --short
git log --oneline -8
```

---

## The one thing I cannot do and you must
Revoke + reissue at the provider: RAZORPAY, TWILIO, RESEND, MAPBOX, MINIO. The
values are in git history (pre-b829b1f). Until revoked they are live. This is the
last real P0 and it is not a code change. One line each: done or not.
