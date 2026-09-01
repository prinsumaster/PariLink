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
-- NOT added, deliberately: a UNIQUE constraint on (companyId, lrNumber).
-- An LR number is a legal document identifier and almost certainly should be
-- unique per company, but adding the constraint would fail the migration if
-- duplicates already exist. That needs a duplicate check against real data
-- first, then its own migration.

CREATE INDEX IF NOT EXISTS "LorryReceipt_companyId_deletedAt_idx" ON "LorryReceipt"("companyId", "deletedAt");
CREATE INDEX IF NOT EXISTS "LorryReceipt_companyId_lrNumber_idx" ON "LorryReceipt"("companyId", "lrNumber");
CREATE INDEX IF NOT EXISTS "LorryReceipt_loadId_idx" ON "LorryReceipt"("loadId");
