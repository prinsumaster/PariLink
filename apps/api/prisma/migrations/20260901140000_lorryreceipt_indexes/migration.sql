-- LorryReceipt had NO indexes at all -- no @@index on companyId, loadId or
-- lrNumber. Every read of it was a sequential scan, and 20260831173000 has
-- since put an RLS policy on it whose USING clause filters on companyId, so
-- the policy predicate was a seq scan too. One lorry receipt is generated per
-- load, so this table grows with dispatch volume.
--
-- Added now, while the table is small. The same CREATE INDEX on a large
-- table takes an ACCESS EXCLUSIVE lock for its duration; CONCURRENTLY cannot
-- be used here because Prisma wraps each migration in a transaction.
--
-- [companyId, deletedAt] matches the real query shape: the soft-delete
-- middleware injects `deletedAt: null` into every findMany/findFirst, so
-- companyId alone would leave the second predicate unindexed. This mirrors
-- the [companyId, deletedAt] pattern already used elsewhere in this schema.
-- [companyId, lrNumber] serves LR lookup by number, which is always
-- tenant-scoped. [loadId] serves the FK join.
--
-- (companyId, lrNumber) is UNIQUE, not a plain index. schema.prisma declares
-- @@unique([companyId, lrNumber]); this migration previously created a plain
-- index, so the two disagreed and `prisma migrate dev` would have generated a
-- surprise migration for the constraint. Resolved here in favour of the
-- constraint: an LR number is a legal document identifier and duplicates
-- within a company are a data-integrity bug.
--
-- The guard below runs FIRST and aborts with the offending rows listed if any
-- duplicates exist. Without it, the failure is a bare constraint violation
-- that names one row and tells you nothing about the scale of the problem.
-- Migrating is the right moment to find out, but not by guessing.

CREATE INDEX IF NOT EXISTS "LorryReceipt_companyId_deletedAt_idx" ON "LorryReceipt"("companyId", "deletedAt");
DO $$
DECLARE
  dupes int;
  sample text;
BEGIN
  SELECT count(*) INTO dupes FROM (
    SELECT 1 FROM "LorryReceipt"
    GROUP BY "companyId", "lrNumber" HAVING count(*) > 1
  ) d;

  IF dupes > 0 THEN
    SELECT string_agg(format('%s/%s x%s', "companyId", "lrNumber", n), ', ')
      INTO sample
      FROM (
        SELECT "companyId", "lrNumber", count(*) AS n
        FROM "LorryReceipt"
        GROUP BY "companyId", "lrNumber" HAVING count(*) > 1
        LIMIT 10
      ) s;
    RAISE EXCEPTION
      'Cannot add UNIQUE (companyId, lrNumber): % duplicate group(s) exist. First 10: %. '
      'Deduplicate before migrating -- an LR number is a legal document id and '
      'duplicates within a company are a data-integrity bug, not a schema problem.',
      dupes, sample;
  END IF;
END
$$;

DROP INDEX IF EXISTS "LorryReceipt_companyId_lrNumber_idx";
CREATE UNIQUE INDEX IF NOT EXISTS "LorryReceipt_companyId_lrNumber_key" ON "LorryReceipt"("companyId", "lrNumber");
CREATE INDEX IF NOT EXISTS "LorryReceipt_loadId_idx" ON "LorryReceipt"("loadId");
