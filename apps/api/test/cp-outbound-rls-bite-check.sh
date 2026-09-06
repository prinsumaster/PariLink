#!/bin/bash
# Tenant isolation for OutboundOrder / OutboundOrderItem.
# Same three-leg shape as cp2/cp4/cp-a, extended to four legs so BOTH tenants
# have a positive control: a tenant seeing 0 rows proves nothing unless that
# tenant owns rows to see -- a missing GRANT produces the same 0.
#
# Connection defaults match the other bite checks; override via env to point
# at another database.
PGHOST_="${PGHOST_:-localhost}"
PGPORT_="${PGPORT_:-5434}"
PGDB_="${PGDB_:-parilink_test}"
SYS_USER="${SYS_USER:-parilink_sys}"
APP_USER="${APP_USER:-parilink_app}"
SYS_PW="${SYS_PW:-password}"
APP_PW="${APP_PW:-password}"

COMPANY_A="${COMPANY_A:?set COMPANY_A}"
COMPANY_B="${COMPANY_B:?set COMPANY_B}"
ROW_A="${ROW_A:?set ROW_A (an OutboundOrder owned by A)}"
ROW_B="${ROW_B:?set ROW_B (an OutboundOrder owned by B)}"
ITEM_A="${ITEM_A:?set ITEM_A}"
ITEM_B="${ITEM_B:?set ITEM_B}"

# psql echoes "SET" for the SET statement, so take the LAST output line --
# the same reason the other bite checks pipe through grep -o '[0-9]*'.
app() { PGPASSWORD="$APP_PW" psql -U "$APP_USER" -h "$PGHOST_" -p "$PGPORT_" -d "$PGDB_" -t -A -c "$1" 2>&1 | grep -v '^SET$' | tail -1 | tr -d '\n'; }
sys() { PGPASSWORD="$SYS_PW" psql -U "$SYS_USER" -h "$PGHOST_" -p "$PGPORT_" -d "$PGDB_" -t -A -c "$1" 2>&1 | grep -v '^SET$' | tail -1 | tr -d '\n'; }

FAIL=0
check() { # label, actual, expected
  if [ "$2" = "$3" ]; then printf "  %-38s %s  ok\n" "$1" "$2"
  else printf "  %-38s %s  EXPECTED %s  <-- FAIL\n" "$1" "$2" "$3"; FAIL=1; fi
}

echo "=== outbound RLS bite check ==="
echo "role: $(app "SELECT current_user||' superuser='||rolsuper||' bypassrls='||rolbypassrls FROM pg_roles WHERE rolname=current_user")"
echo "rows: A=$ROW_A  B=$ROW_B"

check "sys sees A's order"        "$(sys "SELECT count(*) FROM \"OutboundOrder\" WHERE id='$ROW_A'")" 1
check "sys sees B's order"        "$(sys "SELECT count(*) FROM \"OutboundOrder\" WHERE id='$ROW_B'")" 1

check "A reads A's order"         "$(app "SET app.current_company_id='$COMPANY_A'; SELECT count(*) FROM \"OutboundOrder\" WHERE id='$ROW_A'")" 1
check "A reads B's order"         "$(app "SET app.current_company_id='$COMPANY_A'; SELECT count(*) FROM \"OutboundOrder\" WHERE id='$ROW_B'")" 0
check "B reads B's order"         "$(app "SET app.current_company_id='$COMPANY_B'; SELECT count(*) FROM \"OutboundOrder\" WHERE id='$ROW_B'")" 1
check "B reads A's order"         "$(app "SET app.current_company_id='$COMPANY_B'; SELECT count(*) FROM \"OutboundOrder\" WHERE id='$ROW_A'")" 0

check "A reads A's item"          "$(app "SET app.current_company_id='$COMPANY_A'; SELECT count(*) FROM \"OutboundOrderItem\" WHERE id='$ITEM_A'")" 1
check "A reads B's item"          "$(app "SET app.current_company_id='$COMPANY_A'; SELECT count(*) FROM \"OutboundOrderItem\" WHERE id='$ITEM_B'")" 0
check "B reads B's item"          "$(app "SET app.current_company_id='$COMPANY_B'; SELECT count(*) FROM \"OutboundOrderItem\" WHERE id='$ITEM_B'")" 1
check "B reads A's item"          "$(app "SET app.current_company_id='$COMPANY_B'; SELECT count(*) FROM \"OutboundOrderItem\" WHERE id='$ITEM_A'")" 0

check "no tenant context"         "$(app "SELECT count(*) FROM \"OutboundOrder\"")" 0
check "A cannot INSERT as B"      "$(app "SET app.current_company_id='$COMPANY_A'; INSERT INTO \"OutboundOrder\"(id,\"companyId\",\"orderNumber\",status,\"updatedAt\") VALUES ('bite-evil','$COMPANY_B','EVIL','PENDING',now())" | grep -c 'row-level security')" 1
app "SET app.current_company_id='$COMPANY_A'; UPDATE \"OutboundOrder\" SET status='DISPATCHED' WHERE id='$ROW_B'" >/dev/null
check "B's order untouched by A"  "$(sys "SELECT status FROM \"OutboundOrder\" WHERE id='$ROW_B'")" "PENDING"

if [ $FAIL -eq 0 ]; then echo "PASS"; exit 0; else echo "FAIL"; exit 1; fi
