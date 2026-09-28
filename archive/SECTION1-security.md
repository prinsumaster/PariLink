# PariLink — Section 1: P0 Security (for Antigravity)

This is the ship-blocking phase. Everything before was additive — a thin proof just
meant a half-working feature. Here, a security fix that is claimed-but-not-proven is
WORSE than not doing it, because it creates false confidence about a live risk. So the
proof bar is the highest of the whole project.

## Hard rules (read before starting)
- **One item, one proof, then the next.** Paste RAW output. A described result is not a
  result.
- **A 404 proves nothing on its own.** Isolation requires the POSITIVE CONTROL: the
  owner (B) gets 200 on the SAME record the attacker (A) gets 404/403 on, and the DB
  row is shown intact. A wall of 404s without the matching 200s could just mean the
  records don't exist.
- **Never weaken a guard, a check, or a test assertion to go green.** This already
  happened once (`expect(permissions)` → `expect(permissions || [])`). On a security
  control that is the exact failure that ships a hole. If a test fails, fix the CODE.
- **Do not mark an item done without its pasted proof above it.** "NOT DONE" is always
  acceptable; a false "done" on security is not.
- Sequence: 1 secrets → 2 isolation → 3 RBAC → 4 storage → 5 runAsSystem triage →
  6 deps. Do them in this order.

### Login helper (used throughout)
```bash
cd ~/Desktop/PariLink
login(){ curl -s -c /tmp/ck_$1.txt localhost:8080/api/v1/health >/dev/null
  local c=$(grep XSRF-TOKEN /tmp/ck_$1.txt|awk '{print $7}')
  curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck_$1.txt \
    -H 'Content-Type: application/json' -d "{\"email\":\"$2\",\"password\":\"$3\"}" | jq -r '.access_token'; }
A=$(login a admin_a@parilink.com password123)   # tenant-a admin — adjust email to the real seed
B=$(login b admin_b@parilink.com password123)   # tenant-b admin
echo "A company:"; curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $A" | jq '.companyId'
echo "B company:"; curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $B" | jq '.companyId'
# ^ these MUST be two different companyIds before you continue
```
If admin_a/admin_b aren't valid, print the real tenant-a and tenant-b admin emails from
the seed and use those. Both users must be in DIFFERENT companies.

---

## 1 — Leaked secrets (partly human — only you can finish it)
- Confirm untracked: `git ls-tree -r HEAD --name-only | grep -E '\.env\.bak|token\.json|\.auth'`
  → should print nothing (removed in commit b829b1f).
- **REVOKE + REISSUE at each provider — this is not code and cannot be skipped:**
  RAZORPAY, TWILIO, RESEND, MAPBOX, MINIO. The leaked values are still LIVE at the
  providers and still in git history. Put new values only in the untracked `.env`.
  Report one line each: revoked / not done.
- History purge (decision, don't rush): `git filter-repo --path .env.bak --path
  token.json --invert-paths`, then rotate JWT keys + encryption keys too (they leaked).
  Only do the rewrite if you can coordinate the force-push.

## 2 — Prove tenant isolation across the 8 core entities  ← the priority
For EACH of: customers, vehicles, drivers, loads, trips, invoices, payments, documents.
Grab one of B's real record ids, then attack it as A. Template (customers — repeat for
every entity, changing the path and the psql table name):
```bash
BID=$(curl -s localhost:8080/api/v1/customers -H "Authorization: Bearer $B" | jq -r '.data[0].id')
echo "target (B's customer): $BID"
curl -s -o /dev/null -w "  B reads own (want 200): %{http_code}\n"      localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $B"
curl -s -o /dev/null -w "  A reads  B (want 404/403): %{http_code}\n"   localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A"
curl -s -o /dev/null -w "  A PATCH  B (want 404/403): %{http_code}\n" -X PATCH  localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A" -H "Content-Type: application/json" -d '{"name":"HACKED"}'
curl -s -o /dev/null -w "  A DELETE B (want 404/403): %{http_code}\n" -X DELETE localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A"
psql -U parilink -d parilink_db -h localhost -c "SELECT id, name, \"deletedAt\" FROM \"Customer\" WHERE id='$BID';"
```
Required per entity: **B reads own = 200** (positive control), A read/patch/delete =
404/403, and the DB row is UNCHANGED (name not 'HACKED', deletedAt still null). Paste the
five lines + the DB row for all 8 entities as one table.

Also the list-leak check — A must never see B's rows:
```bash
for e in customers loads invoices; do
  echo -n "A's $e companyIds: "; curl -s localhost:8080/api/v1/$e -H "Authorization: Bearer $A" | jq -c '[.data[].companyId]|unique'
done
```
Must print only A's own companyId. **Any A→2xx on B's record, any changed DB row, or B's
companyId showing in A's list = CRITICAL. Stop, fix that first, re-prove.**

## 3 — Prove RBAC (a dispatcher is not an accountant)
Create a DISPATCHER and an ACCOUNTANT role+user in Company A (use the real create-user
route + role names from the code; `Role.permissions` is a JSON array of colon perms like
`dispatch:read`, `finance:write`). Then:
```bash
DISP=$(login disp disp_a@parilink.com password123); ACCT=$(login acct acct_a@parilink.com password123)
echo "dispatcher SHOULD reach ops (want 2xx):"
curl -s -o /dev/null -w "  loads: %{http_code}\n"  localhost:8080/api/v1/loads  -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  trips: %{http_code}\n"  localhost:8080/api/v1/trips  -H "Authorization: Bearer $DISP"
echo "dispatcher must NOT reach finance/admin (want 403):"
curl -s -o /dev/null -w "  invoices:  %{http_code}\n" localhost:8080/api/v1/finance/invoices -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  payments:  %{http_code}\n" localhost:8080/api/v1/finance/payments -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  ledger:    %{http_code}\n" -X POST localhost:8080/api/v1/finance/ledger/entries -H "Authorization: Bearer $DISP" -H "Content-Type: application/json" -d '{}'
curl -s -o /dev/null -w "  make-user: %{http_code}\n" -X POST localhost:8080/api/v1/admin/users/invite   -H "Authorization: Bearer $DISP" -H "Content-Type: application/json" -d '{}'
```
A dispatcher reaching finance or user-admin with anything but 401/403 is an RBAC bypass —
name it and fix the guard, do not adjust the test.

## 4 — Storage (MinIO) tenant isolation
As A, try to fetch B's document by id and by direct object key — must be 403/404, never
the file:
```bash
BDOC=$(curl -s localhost:8080/api/v1/documents -H "Authorization: Bearer $B" | jq -r '.data[0].id')
curl -s -o /dev/null -w "A gets B's document: %{http_code} (want 404/403)\n" localhost:8080/api/v1/documents/$BDOC -H "Authorization: Bearer $A"
```
Confirm object keys are namespaced by companyId and the download re-checks ownership (a
signed URL that anyone can replay is not isolation).

## 5 — Triage the 449 RLS bypasses (real work, not a checkbox)
```bash
grep -rho "runAsSystem(\s*'[^']*'" apps/api/src --include=*.ts | sort | uniq -c | sort -rn
```
→ 448 share `'System operation or legacy bypass'`. Each is a decision: genuinely
cross-tenant (keep, give a real reason) vs accidentally-bypassed (convert to
`runAsTenant(companyId, …)`). Start with NON-admin modules (telemetry, integrations/sync,
billing, marketplace) — admin services legitimately span tenants; operational ones must
not. After converting a module, re-run item 2's isolation test for its entity to prove it.
Report how many you classified and converted this pass — do not claim all 449 in one go.

## 6 — Dependency vulnerabilities
```bash
npm audit --workspace=apps/api | tail -5
npm audit --workspace=apps/web | tail -5
```
- `passport-saml@3.2.4` on the live SSO path pulls vulnerable xml-crypto → @xmldom/xmldom
  (no transitive fix). Migrate to `@node-saml/passport-saml` v5 (breaking — test SSO
  login after), OR disable the SSO module and remove the dep if SSO isn't in pilot scope.
- `npm audit fix` the non-breaking criticals/highs; list what's left needing `--force`.
  Many highs are in Tier-3 deps (langchain, deck.gl, docusaurus) — removing those hidden
  modules removes their vulns.
Paste `npm audit ... | tail -5` before and after.

---

## Report
Two tables: (2) entity · B-reads-own · A-reads · A-writes · A-deletes · DB-intact?
and (3) role · endpoint · expected · actual · pass? Then: count of CRITICAL isolation and
RBAC failures (listed by name), the runAsSystem triage count, and the before/after
`npm audit` lines. No "Section 1 complete" line unless every proof above it is pasted —
and the five key revocations are answered done/not-done.
