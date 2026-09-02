#!/bin/bash
# B(c) — measure what RLS costs on the five heaviest read paths.
#
# Run as parilink_test (NOT postgres) with a tenant context set, so the
# policies are actually in the plan. Run AFTER seeding enough rows to be
# meaningful -- on an empty table every plan is a seq scan and tells you
# nothing.
#
# What to look for in each plan:
#   - "Seq Scan" on a large table            -> missing or unused index
#   - the companyId predicate as "Filter:"   -> index NOT used, rows scanned
#     then discarded. Want "Index Cond:" instead.
#   - "SubPlan" / "InitPlan" on EXISTS policies -> per-row parent lookup;
#     acceptable only if it is an Index Scan on the parent PK
#   - rows-removed-by-filter >> rows-returned -> the policy is doing the
#     filtering the index should have done
#
# Usage:  bash test/rls-explain-analyze.sh '<tenant-a-company-id>'
set -euo pipefail

TENANT="${1:?usage: rls-explain-analyze.sh <companyId>}"
DB=parilink-test-db
RUN="docker exec -i $DB psql -U parilink_test -d postgres"

run() {
  echo ""
  echo "=============================================================="
  echo "  $1"
  echo "=============================================================="
  $RUN <<SQL
SELECT set_config('app.current_company_id', '$TENANT';
EXPLAIN (ANALYZE, BUFFERS, COSTS)
$2
SQL
}

echo "### connected as (must be parilink_test|f):"
$RUN -t -A -c "SELECT current_user, usesuper FROM pg_user WHERE usename = current_user;"

run "1. DISPATCH LIST — trips by status, the operations screen" \
"SELECT t.id, t.\"tripNumber\", t.status, t.\"createdAt\"
 FROM \"Trip\" t
 WHERE t.status IN ('PLANNED','IN_TRANSIT')
 ORDER BY t.\"createdAt\" DESC
 LIMIT 50;"

run "2. PER-TRUCK P&L — TruckProfitability aggregate" \
"SELECT tp.\"vehicleId\", sum(tp.revenue) AS revenue, sum(tp.\"totalCost\") AS cost
 FROM \"TruckProfitability\" tp
 GROUP BY tp.\"vehicleId\"
 ORDER BY revenue DESC
 LIMIT 25;"

run "3. ANOMALIES FEED — the getAnomalies query, 30-day window with joins" \
"SELECT fe.id, fe.\"variancePct\", v.\"licensePlate\", d.\"firstName\", tr.\"tripNumber\"
 FROM \"FuelEntry\" fe
 LEFT JOIN \"Vehicle\" v  ON v.id  = fe.\"vehicleId\"
 LEFT JOIN \"Driver\"  d  ON d.id  = fe.\"driverId\"
 LEFT JOIN \"Trip\"    tr ON tr.id = fe.\"tripId\"
 WHERE fe.\"filledAt\" >= now() - interval '30 days'
 ORDER BY fe.\"variancePct\" DESC
 LIMIT 100;"

run "4. INVOICE LIST — with line items, exercises the FK-linked EXISTS policy" \
"SELECT i.id, i.\"invoiceNumber\", i.status, count(li.id) AS lines
 FROM \"Invoice\" i
 LEFT JOIN \"InvoiceLineItem\" li ON li.\"invoiceId\" = i.id
 GROUP BY i.id, i.\"invoiceNumber\", i.status
 ORDER BY i.\"createdAt\" DESC
 LIMIT 50;"

run "5. LORRY RECEIPT LIST — the table that had NO indexes before 20260901120000" \
"SELECT lr.id, lr.\"lrNumber\", lr.status, lr.\"totalAmount\"
 FROM \"LorryReceipt\" lr
 WHERE lr.status = 'GENERATED'
 ORDER BY lr.date DESC
 LIMIT 50;"

echo ""
echo "### index usage after the run — idx_scan=0 means the index is never chosen:"
$RUN -c "SELECT relname, indexrelname, idx_scan
         FROM pg_stat_user_indexes
         WHERE relname IN ('Trip','TruckProfitability','FuelEntry','Invoice','InvoiceLineItem','LorryReceipt')
         ORDER BY relname, idx_scan DESC;"

echo ""
echo "### sequential scans accumulated — high seq_scan on a large table is the red flag:"
$RUN -c "SELECT relname, seq_scan, seq_tup_read, idx_scan, n_live_tup
         FROM pg_stat_user_tables
         WHERE relname IN ('Trip','TruckProfitability','FuelEntry','Invoice','InvoiceLineItem','LorryReceipt','VehicleLocation')
         ORDER BY seq_tup_read DESC;"
