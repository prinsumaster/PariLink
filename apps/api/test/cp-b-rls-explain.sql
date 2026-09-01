-- B(c) -- EXPLAIN ANALYZE for the five heaviest tenant-scoped queries, to
-- measure what the 16 new RLS policies actually cost.
--
-- Run as parilink_test (NOT postgres -- a superuser bypasses RLS and the
-- numbers would be meaningless), with a real tenant id substituted for :A.
--
--   docker exec -i parilink-test-db psql -U parilink_test -d postgres \
--     -v A="'<tenant-a-uuid>'" -f apps/api/test/cp-b-rls-explain.sql
--
-- What to look for in each plan:
--   * "Seq Scan" on a table with an RLS policy -> the companyId predicate is
--     not using an index. Expect Index Scan / Bitmap Index Scan.
--   * A SubPlan or "Filter: (SubPlan N)" on the EXISTS-policy tables means
--     the subquery runs PER ROW. It should be an Index Scan on the parent PK.
--   * Compare "Planning Time" against "Execution Time": RLS predicates are
--     added at plan time, so a large planning cost on a simple query is a
--     signal the policy expression is expensive to plan.
--   * Rows Removed by Filter -- a high count means the policy is filtering
--     after the fact rather than being pushed into the index scan.

\timing on
SET app.current_company_id = :A;

\echo '=== 1. DISPATCH LIST (Trip, RLS on companyId) ==='
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, "tripNumber", status, "createdAt"
FROM "Trip"
WHERE "deletedAt" IS NULL
ORDER BY "createdAt" DESC
LIMIT 50;

\echo '=== 2. PER-TRUCK P&L (TruckProfitability, RLS on companyId) ==='
EXPLAIN (ANALYZE, BUFFERS)
SELECT "vehicleId", month, SUM("totalRevenue") AS revenue, SUM("totalCost") AS cost
FROM "TruckProfitability"
GROUP BY "vehicleId", month
ORDER BY month DESC
LIMIT 100;

\echo '=== 3. ANOMALIES FEED (FuelEntry + 3 joins, RLS on all four) ==='
EXPLAIN (ANALYZE, BUFFERS)
SELECT fe.id, fe."variancePct", v."licensePlate", d."firstName", t."tripNumber"
FROM "FuelEntry" fe
LEFT JOIN "Vehicle" v ON v.id = fe."vehicleId"
LEFT JOIN "Driver"  d ON d.id = fe."driverId"
LEFT JOIN "Trip"    t ON t.id = fe."tripId"
WHERE fe."filledAt" >= now() - interval '30 days'
ORDER BY fe."variancePct" DESC
LIMIT 100;

\echo '=== 4. INVOICE LIST + LINE ITEMS (InvoiceLineItem uses an EXISTS policy) ==='
EXPLAIN (ANALYZE, BUFFERS)
SELECT i.id, i."invoiceNumber", i.status, count(li.id) AS line_items
FROM "Invoice" i
LEFT JOIN "InvoiceLineItem" li ON li."invoiceId" = i.id
WHERE i."deletedAt" IS NULL
GROUP BY i.id
ORDER BY i."createdAt" DESC
LIMIT 50;

\echo '=== 5. LORRY RECEIPT LOOKUP (LorryReceipt -- indexes added 20260901140000) ==='
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, "lrNumber", "consigneeName", "totalAmount", status
FROM "LorryReceipt"
WHERE "deletedAt" IS NULL
ORDER BY date DESC
LIMIT 50;

\echo '=== 6. CONTROL: same Trip query with RLS bypassed, for comparison ==='
SET app.bypass_rls = 'on';
EXPLAIN (ANALYZE, BUFFERS)
SELECT id, "tripNumber", status, "createdAt"
FROM "Trip"
WHERE "deletedAt" IS NULL
ORDER BY "createdAt" DESC
LIMIT 50;
RESET app.bypass_rls;
