# PariLink — Janmashtami hardening. PROVE tenant isolation (#3) and RBAC (#4).

Owner priorities #3 and #4. Both currently UNVERIFIED, both are demo-killers for a
real client. Follow the owner's rule: find -> root cause -> attack test -> run
against the real server -> verify DB state -> document. A 404 with no positive
control proves nothing.

Rules: raw output only. One entity/role at a time. NEVER weaken a guard to pass.
A CRITICAL failure = stop and flag, do not silently fix. "NOT DONE" is allowed.

Adjust route names / role names below to what the code actually uses — you can
read the controllers; I'm giving the pattern, not guessing your exact paths.

---

## SETUP — two companies, real tokens
Seed has admin_a@parilink.com (tenant-a) and admin_b@parilink.com (tenant-b).
```bash
cd ~/Desktop/PariLink
login(){ curl -s -c /tmp/ck_$1.txt localhost:8080/api/v1/health >/dev/null
  local c=$(grep XSRF-TOKEN /tmp/ck_$1.txt|awk '{print $7}')
  curl -s -X POST localhost:8080/api/v1/auth/login -H "X-XSRF-TOKEN: $c" -b /tmp/ck_$1.txt \
    -H 'Content-Type: application/json' -d "{\"email\":\"$2\",\"password\":\"$3\"}" | jq -r '.access_token'; }
A=$(login a admin_a@parilink.com password123)
B=$(login b admin_b@parilink.com password123)
echo "A=${A:0:10}  B=${B:0:10}"
```
If those aren't valid, print the seed's real tenant-a / tenant-b admin emails and
use those instead. Confirm A and B are in DIFFERENT companyIds before continuing:
```bash
curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $A" | jq '.companyId'
curl -s localhost:8080/api/v1/auth/me -H "Authorization: Bearer $B" | jq '.companyId'
```

---

## PART A — Tenant isolation across the CORE entities (#3)
Entities: customers, vehicles, drivers, loads, trips, invoices, payments, documents.
For each: grab one of B's real record ids, then attack it as A. Required per entity:
  - B reads own id  -> 200   (POSITIVE CONTROL — mandatory)
  - A reads B's id  -> 404/403
  - A updates B's id-> 404/403
  - A deletes B's id-> 404/403
  - DB check: B's row unchanged / not soft-deleted

Template (customers — repeat for every entity, fixing the path + table name):
```bash
BID=$(curl -s localhost:8080/api/v1/customers -H "Authorization: Bearer $B" | jq -r '.data[0].id')
echo "target B customer: $BID"
curl -s -o /dev/null -w "  B reads own:   %{http_code}\n" localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $B"
curl -s -o /dev/null -w "  A reads  B:    %{http_code}\n" localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A"
curl -s -o /dev/null -w "  A updates B:   %{http_code}\n" -X PATCH localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A" -H "Content-Type: application/json" -d '{"name":"HACKED"}'
curl -s -o /dev/null -w "  A deletes B:   %{http_code}\n" -X DELETE localhost:8080/api/v1/customers/$BID -H "Authorization: Bearer $A"
psql -U parilink -d parilink_db -h localhost -c "SELECT id,name,\"deletedAt\" FROM \"Customer\" WHERE id='$BID';"
```
Paste the 4 status lines + DB row for ALL 8 entities. Any `A reads/updates/deletes B`
returning 2xx, or any DB row that changed, is a CRITICAL tenant IDOR. Flag it.

List-leak check (no id needed) — A must never see B's rows:
```bash
for e in customers loads invoices; do
  echo -n "A's $e companyIds: "
  curl -s localhost:8080/api/v1/$e -H "Authorization: Bearer $A" | jq -c '[.data[].companyId]|unique'
done
```
Must print only A's own companyId for each.

Storage (#7 preview): if a document download endpoint exists, A fetches B's
document id -> must be 403/404, not the file.

---

## PART B — RBAC: a dispatcher is not an accountant (#4)
Owner's rule: dispatcher does operations, NOT finance/admin/destructive.

### B1 — get a dispatcher and an accountant in Company A
If the seed already has role-varied users, use them and say which. Otherwise
create them as admin A (use the REAL create-user route + role names from the code):
```bash
# example only — replace with the real route/roles
curl -s -X POST localhost:8080/api/v1/admin/users/invite -H "Authorization: Bearer $A" \
  -H "X-XSRF-TOKEN: $(grep XSRF /tmp/ck_a.txt|awk '{print $7}')" -b /tmp/ck_a.txt \
  -H "Content-Type: application/json" -d '{"email":"disp_a@parilink.com","role":"DISPATCHER","password":"password123"}'
```
Then: `DISP=$(login disp disp_a@parilink.com password123)` and same for `ACCT`.

### B2 — prove the walls (expected in comments)
```bash
echo "== dispatcher SHOULD reach operations (expect 2xx) =="
curl -s -o /dev/null -w "  disp loads:      %{http_code}\n" localhost:8080/api/v1/loads -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  disp trips:      %{http_code}\n" localhost:8080/api/v1/trips -H "Authorization: Bearer $DISP"

echo "== dispatcher must NOT reach finance/admin (expect 403) =="
curl -s -o /dev/null -w "  disp invoices:   %{http_code}\n" localhost:8080/api/v1/finance/invoices -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  disp payments:   %{http_code}\n" localhost:8080/api/v1/finance/payments -H "Authorization: Bearer $DISP"
curl -s -o /dev/null -w "  disp ledger POST:%{http_code}\n" -X POST localhost:8080/api/v1/finance/ledger/entries -H "Authorization: Bearer $DISP" -H "Content-Type: application/json" -d '{}'
curl -s -o /dev/null -w "  disp make-user:  %{http_code}\n" -X POST localhost:8080/api/v1/admin/users/invite -H "Authorization: Bearer $DISP" -H "Content-Type: application/json" -d '{}'

echo "== accountant: finance yes, user-admin no =="
curl -s -o /dev/null -w "  acct invoices:   %{http_code}\n" localhost:8080/api/v1/finance/invoices -H "Authorization: Bearer $ACCT"
curl -s -o /dev/null -w "  acct make-user:  %{http_code}\n" -X POST localhost:8080/api/v1/admin/users/invite -H "Authorization: Bearer $ACCT" -H "Content-Type: application/json" -d '{}'
```
Dispatcher reaching finance with anything but 401/403 is an RBAC bypass — the
owner named this exact class. Flag it, don't paper over it.

---

## Report
Table A: entity | B-reads-own | A-reads-B | A-writes-B | A-deletes-B | DB intact?
Table B: role | endpoint | expected | actual | pass?
Then: count of CRITICAL isolation failures + CRITICAL RBAC failures, each listed
by name. No "all passed" line unless every row above it is pasted.
