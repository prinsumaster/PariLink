#!/bin/bash
# CP4(d) — prove the FK-linked EXISTS policies bite.
#
# Same pattern as cp2-rls-bite-check.sh, but for tables with no companyId of
# their own, whose policy resolves tenancy through a parent FK.
#
# Run AFTER `npx prisma migrate deploy` has applied
# 20260831174500_enable_rls_fk_linked_auth_money.
#
# Usage:  bash test/cp4-fk-rls-bite-check.sh
set -euo pipefail

DB=parilink-test-db
ADMIN="docker exec $DB psql -U postgres -d postgres -t -A"
TEST="docker exec $DB psql -U parilink_test -d postgres -t -A"

echo "=== 0. connected as? (MUST be parilink_test|f) ==="
$TEST -c "SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;"
echo

echo "=== 1. RLS enabled AND forced on the 7 FK-linked tables? (all must be t|t) ==="
$TEST -c "SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class
          WHERE relname IN ('RefreshToken','BackupCode','WebAuthnCredential',
                            'TrustedDevice','SsoSession','OAuthToken','InvoiceLineItem')
          ORDER BY relname;"
echo

A=$($ADMIN -c "SELECT id FROM \"Company\" ORDER BY \"createdAt\" LIMIT 1;")
B=$($ADMIN -c "SELECT id FROM \"Company\" ORDER BY \"createdAt\" DESC LIMIT 1;")
if [ "$A" = "$B" ]; then echo "FATAL: need two distinct companies seeded"; exit 1; fi
echo "tenant A = $A"
echo "tenant B = $B"
echo

echo "=== 2. seed one RefreshToken per tenant, owned via that tenant's User ==="
for T in "$A" "$B"; do
  U=$($ADMIN -c "SELECT id FROM \"User\" WHERE \"companyId\"='$T' LIMIT 1;")
  if [ -z "$U" ]; then echo "  no user for $T — skipping"; continue; fi
  $ADMIN -c "INSERT INTO \"RefreshToken\" (id,token,\"userId\",\"expiresAt\",\"lastActiveAt\",\"familyId\",history,\"createdAt\",\"updatedAt\")
             VALUES ('cp4-rt-$T','cp4-token-$T','$U', now() + interval '7 days', now(), gen_random_uuid()::text, '[]'::jsonb, now(), now())
             ON CONFLICT (id) DO NOTHING;" > /dev/null
  echo "  seeded RefreshToken for $T (user $U)"
done
echo

echo "=== 3. ground truth, RLS bypassed ==="
TOTAL=$($ADMIN -c "SELECT count(*) FROM \"RefreshToken\";")
XA=$($ADMIN -c "SELECT count(*) FROM \"RefreshToken\" rt JOIN \"User\" u ON u.id=rt.\"userId\" WHERE u.\"companyId\"='$A';")
XB=$($ADMIN -c "SELECT count(*) FROM \"RefreshToken\" rt JOIN \"User\" u ON u.id=rt.\"userId\" WHERE u.\"companyId\"='$B';")
echo "  RefreshToken total across all tenants = $TOTAL"
echo "  actually owned by A = $XA"
echo "  actually owned by B = $XB"
echo

echo "=== 4. THE TEST: same connection, same query, only the tenant setting changes ==="
CA=$($TEST -c "SET app.current_company_id = '$A'; SELECT count(*) FROM \"RefreshToken\";" | tail -1)
CB=$($TEST -c "SET app.current_company_id = '$B'; SELECT count(*) FROM \"RefreshToken\";" | tail -1)
echo "  as tenant A: sees $CA   (A owns $XA)"
echo "  as tenant B: sees $CB   (B owns $XB)"
if [ "$CA" = "$XA" ] && [ "$CB" = "$XB" ]; then
  echo "  PASS — EXISTS policy resolves tenancy through the parent correctly"
else
  echo "  FAIL — FK-linked policy is not filtering"
fi
echo

echo "=== 5. fail-closed check: no tenant context set at all ==="
CN=$($TEST -c "RESET app.current_company_id; SELECT count(*) FROM \"RefreshToken\";" | tail -1)
echo "  with no app.current_company_id: sees $CN   (expected 0 — fails closed)"
[ "$CN" = "0" ] && echo "  PASS" || echo "  FAIL — rows visible with no tenant context"
echo

echo "=== 6. the auth path must still work: runAsSystem equivalent ==="
CS=$($TEST -c "SET app.bypass_rls = 'on'; SELECT count(*) FROM \"RefreshToken\";" | tail -1)
echo "  with app.bypass_rls='on': sees $CS   (expected $TOTAL — login/refresh unaffected)"
[ "$CS" = "$TOTAL" ] && echo "  PASS" || echo "  FAIL — bypass path broken, auth would break"
