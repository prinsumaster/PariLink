SET enable_seqscan = OFF;
EXPLAIN ANALYZE
SELECT "id", "status", "dueDate" 
FROM "public"."Invoice"
WHERE "companyId" = '8960d9e2-c40c-4e65-8f8d-babd7c0967f3'
  AND "status" = 'OVERDUE'
  AND "deletedAt" IS NULL
ORDER BY "dueDate" DESC
LIMIT 50;
