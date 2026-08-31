#!/bin/bash
# CP2 — prove the new RLS policies actually bite.
#
# A migration that applies cleanly is not a working policy. This connects as
# parilink_test (NOT postgres), seeds one row per tenant into FuelEntry and
# TripDesk, then flips app.current_company_id between the two tenants and
# checks that each only ever sees its own row.
#
# Run AFTER `npx prisma migrate deploy` has applied
# 20260831173000_enable_rls_new_fleet_models.
#
# Usage:  bash test/cp2-rls-bite-check.sh
set -euo pipefail

DB=parilink-test-db
PSQL_ADMIN="docker exec $DB psql -U postgres -d postgres -t -A"
PSQL_TEST="docker exec $DB psql -U parilink_test -d postgres -t -A"

echo "=== 0. who am I connecting as? ==="
$PSQL_TEST -c "SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;"
echo "    (MUST read parilink_test|f — if it says postgres|t, everything below is meaningless)"
echo

echo "=== 1. is RLS enabled AND forced on the new tables? ==="
$PSQL_TEST -c "SELECT relname, relrowsecurity, relforcerowsecurity FROM pg_class
               WHERE relname IN ('FuelEntry','TripDesk','Trip','Invoice','Vehicle') ORDER BY relname;"
echo "    (all must be t|t)"
echo

echo "=== 2. seed one row per tenant (as system, RLS bypassed for setup) ==="
A=$($PSQL_ADMIN -c "SELECT id FROM \"Company\" ORDER BY \"createdAt\" LIMIT 1;")
B=$($PSQL_ADMIN -c "SELECT id FROM \"Company\" ORDER BY \"createdAt\" DESC LIMIT 1;")
if [ "$A" = "$B" ]; then echo "FATAL: need two distinct companies seeded; found only one ($A)"; exit 1; fi
echo "tenant A = $A"
echo "tenant B = $B"

for T in "$A" "$B"; do
  TRIP=$($PSQL_ADMIN -c "SELECT id FROM \"Trip\" WHERE \"companyId\"='$T' LIMIT 1;")
  VEH=$($PSQL_ADMIN -c  "SELECT id FROM \"Vehicle\" WHERE \"companyId\"='$T' LIMIT 1;")
  DRV=$($PSQL_ADMIN -c  "SELECT id FROM \"Driver\" WHERE \"companyId\"='$T' LIMIT 1;")
  if [ -z "$TRIP" ] || [ -z "$VEH" ] || [ -z "$DRV" ]; then
    echo "  (skipping FuelEntry seed for $T — needs an existing trip/vehicle/driver)"
  else
    $PSQL_ADMIN -c "INSERT INTO \"FuelEntry\" (id,\"companyId\",\"tripId\",\"vehicleId\",\"driverId\",litres,amount,\"variancePct\",\"filledAt\",\"createdAt\",\"updatedAt\")
                    VALUES ('cp2-fe-$T', '$T', '$TRIP', '$VEH', '$DRV', 100, 9000, 30, now(), now(), now())
                    ON CONFLICT (id) DO NOTHING;" > /dev/null
    $PSQL_ADMIN -c "INSERT INTO \"TripDesk\" (id,\"companyId\",\"tripId\",desk,status,\"createdAt\",\"updatedAt\")
                    VALUES ('cp2-td-$T', '$T', '$TRIP', 'DISPATCH', 'PENDING', now(), now())
                    ON CONFLICT (id) DO NOTHING;" > /dev/null
    echo "  seeded rows for $T"
  fi
done
echo

echo "=== 3. totals with RLS bypassed (the ground truth) ==="
for TBL in FuelEntry TripDesk; do
  TOTAL=$($PSQL_ADMIN -c "SELECT count(*) FROM \"$TBL\";")
  echo "  $TBL total (all tenants) = $TOTAL"
done
echo

echo "=== 4. THE TEST: same connection, same query, only the tenant setting changes ==="
for TBL in FuelEntry TripDesk; do
  echo "--- $TBL ---"
  CA=$($PSQL_TEST -c "SET app.current_company_id = '$A'; SELECT count(*) FROM \"$TBL\";" | tail -1)
  CB=$($PSQL_TEST -c "SET app.current_company_id = '$B'; SELECT count(*) FROM \"$TBL\";" | tail -1)
  XA=$($PSQL_ADMIN -c "SELECT count(*) FROM \"$TBL\" WHERE \"companyId\"='$A';")
  XB=$($PSQL_ADMIN -c "SELECT count(*) FROM \"$TBL\" WHERE \"companyId\"='$B';")
  echo "  as tenant A: sees $CA   (A actually owns $XA)"
  echo "  as tenant B: sees $CB   (B actually owns $XB)"
  if [ "$CA" = "$XA" ] && [ "$CB" = "$XB" ]; then
    echo "  PASS — each tenant sees exactly its own rows"
  else
    echo "  FAIL — RLS is not filtering this table"
  fi
done
