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

-- PREFLIGHT. The note above says "run as parilink_test, not postgres". A
-- comment is not a guard -- run this as a superuser and every plan below is
-- RLS-free and proves nothing, while looking perfectly healthy. Abort instead.
DO $$
BEGIN
  IF current_setting('is_superuser') = 'on'
     OR (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user) THEN
    RAISE EXCEPTION
      'Refusing to run: connected as % (superuser=%, bypassrls=%). '
      'RLS is not applied to this role, so every plan below would be '
      'measured without the policy. Reconnect as parilink_app or parilink_test.',
      current_user,
      current_setting('is_superuser'),
      (SELECT rolbypassrls FROM pg_roles WHERE rolname = current_user);
  END IF;
END $$;

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
SELECT "vehicleId", month, SUM("revenue") AS revenue, SUM("fuelCost" + "tollCost" + "maintCost" + "driverCost" + "otherCost") AS cost
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

\echo '=== 6. ASSERTION: no policy may still carry the bypass_rls disjunct ==='
-- This block used to SET app.bypass_rls='on' and re-run the Trip query as a
-- "control". That control is dead: 20260902000000_drop_bypass_rls removed the
-- disjunct from all 219 policies and moved the escape hatch to the
-- parilink_sys BYPASSRLS role, so the GUC is now inert and both legs plan
-- IDENTICALLY. Any delta it printed was noise.
--
-- What CP3 actually needs is the fallback it already describes -- if
-- companyId is still landing in Filter, find the policy that still has the
-- OR. Ask the catalog directly rather than grepping migration files, because
-- the database is the thing that matters and a file can disagree with it.
SELECT count(*) FILTER (WHERE qual LIKE '%bypass_rls%')  AS policies_still_carrying_bypass,
       count(*)                                          AS total_policies
FROM pg_policies
WHERE schemaname = 'public';

\echo '--- any offenders, by table (empty is the pass condition) ---'
SELECT tablename, policyname
FROM pg_policies
WHERE schemaname = 'public' AND qual LIKE '%bypass_rls%'
ORDER BY tablename;
