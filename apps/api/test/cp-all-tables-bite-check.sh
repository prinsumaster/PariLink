#!/bin/bash
# Tenant isolation across EVERY policy-bearing table it can find a pair of
# rows for -- not one table per script.
#
# WHY THIS EXISTS: cp2, cp4, cp-a and run-e2e each test exactly one table
# (FuelEntry, InvoiceLineItem, WarehouseZone, Trip). Four of 224. Their names
# promise 9, 7, 30 and "the e2e suites". Running all four green and reporting
# "every isolation check passes" is a coverage claim of 1.8%.
#
# Same three-leg logic as those scripts, extended to four legs so BOTH tenants
# carry a positive control: a tenant seeing 0 rows proves nothing unless it
# owns rows to see, because a missing GRANT produces the same 0.
#
# It does not seed. It asks the BYPASSRLS role for a row owned by A and a row
# owned by B on each table, and skips tables where both tenants do not already
# own one -- reporting the skip rather than silently counting it as a pass.

PGHOST_="${PGHOST_:-localhost}"
PGPORT_="${PGPORT_:-5434}"
PGDB_="${PGDB_:-parilink_test}"
SYS_USER="${SYS_USER:-parilink_sys}"
APP_USER="${APP_USER:-parilink_app}"
SYS_PW="${SYS_PW:-password}"
APP_PW="${APP_PW:-password}"
COMPANY_A="${COMPANY_A:?set COMPANY_A}"
COMPANY_B="${COMPANY_B:?set COMPANY_B}"

sys() { PGPASSWORD="$SYS_PW" psql -U "$SYS_USER" -h "$PGHOST_" -p "$PGPORT_" -d "$PGDB_" -t -A -c "$1" 2>&1 | grep -v '^SET$' | tail -1 | tr -d '\n'; }
app() { PGPASSWORD="$APP_PW" psql -U "$APP_USER" -h "$PGHOST_" -p "$PGPORT_" -d "$PGDB_" -t -A -c "$1" 2>&1 | grep -v '^SET$' | tail -1 | tr -d '\n'; }

echo "=== all-tables RLS bite check ==="
IDENT=$(app "SELECT current_user||' superuser='||current_setting('is_superuser')||' bypassrls='||(SELECT rolbypassrls FROM pg_roles WHERE rolname=current_user)")
echo "app role: $IDENT"
case "$IDENT" in
  *"superuser=on"*|*"bypassrls=t"*)
    echo "ABORT: the app role bypasses RLS. Every result below would be a false pass."
    exit 2;;
esac

# Every table with a companyId column and a tenant_isolation_policy.
TABLES=$(sys "SELECT string_agg(DISTINCT p.tablename, ' ' ORDER BY p.tablename)
              FROM pg_policies p
              JOIN information_schema.columns c
                ON c.table_name = p.tablename AND c.column_name = 'companyId'
              WHERE p.schemaname='public' AND p.policyname='tenant_isolation_policy'")

TOTAL=0; PASS=0; FAIL=0; SKIP=0; NOID=0; FAILED_TABLES=""
for T in $TABLES; do
  TOTAL=$((TOTAL+1))
  # A table keyed by something other than a plain `id` (VehicleCurrentPosition
  # is keyed by vehicleId) would make every query below a syntax error and
  # report as FAIL. That is a script limitation, not a policy defect -- say so.
  HAS_ID=$(sys "SELECT count(*) FROM information_schema.columns WHERE table_name='$T' AND column_name='id'")
  if [ "$HAS_ID" != "1" ]; then
    NOID=$((NOID+1)); printf "  %-34s SKIP  (no plain id column -- needs a per-table key)\n" "$T"; continue
  fi
  RA=$(sys "SELECT id FROM \"$T\" WHERE \"companyId\"='$COMPANY_A' LIMIT 1")
  RB=$(sys "SELECT id FROM \"$T\" WHERE \"companyId\"='$COMPANY_B' LIMIT 1")
  if [ -z "$RA" ] || [ -z "$RB" ] || [ "${RA:0:5}" = "ERROR" ] || [ "${RB:0:5}" = "ERROR" ]; then
    SKIP=$((SKIP+1)); printf "  %-34s SKIP  (A owns:%s B owns:%s)\n" "$T" "${RA:-none}" "${RB:-none}"; continue
  fi
  AA=$(app "SET app.current_company_id='$COMPANY_A'; SELECT count(*) FROM \"$T\" WHERE id='$RA'")
  AB=$(app "SET app.current_company_id='$COMPANY_A'; SELECT count(*) FROM \"$T\" WHERE id='$RB'")
  BB=$(app "SET app.current_company_id='$COMPANY_B'; SELECT count(*) FROM \"$T\" WHERE id='$RB'")
  BA=$(app "SET app.current_company_id='$COMPANY_B'; SELECT count(*) FROM \"$T\" WHERE id='$RA'")
  NC=$(app "SELECT count(*) FROM \"$T\"")
  if [ "$AA" = "1" ] && [ "$AB" = "0" ] && [ "$BB" = "1" ] && [ "$BA" = "0" ] && [ "$NC" = "0" ]; then
    PASS=$((PASS+1)); printf "  %-34s ok    A/A=%s A/B=%s B/B=%s B/A=%s no-ctx=%s\n" "$T" "$AA" "$AB" "$BB" "$BA" "$NC"
  else
    FAIL=$((FAIL+1)); FAILED_TABLES="$FAILED_TABLES $T"
    printf "  %-34s FAIL  A/A=%s A/B=%s B/B=%s B/A=%s no-ctx=%s  (want 1 0 1 0 0)\n" "$T" "$AA" "$AB" "$BB" "$BA" "$NC"
  fi
done

echo ""
echo "tables with a companyId policy: $TOTAL   tested: $((PASS+FAIL))   passed: $PASS   failed: $FAIL   skipped (no row pair): $SKIP   skipped (no id column): $NOID"
[ -n "$FAILED_TABLES" ] && echo "failed:$FAILED_TABLES"
echo ""
echo "NOTE: 'skipped' is not 'passed'. A skipped table has no row owned by one"
echo "of the two tenants, so nothing was proven about it either way."
[ "$FAIL" -eq 0 ] && echo "PASS" && exit 0
echo "FAIL"; exit 1
