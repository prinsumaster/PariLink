# Performance Tuning Guide

## Prisma Query Tuning
1. **Never use `findMany` + `include` for aggregations.** Always use `aggregate` or `groupBy`. 
   *Why?* Pulling 10,000 records into Node.js to sum an array causes V8 Garbage Collection pauses and OOM crashes.
2. **Beware of N+1 Queries.** Prisma does a good job of batching `include`, but if you use `.map()` in a service and fire multiple `findUnique` inside a `Promise.all()`, you will saturate the connection pool. Use `findMany` with an `in: []` clause instead.
3. **Pagination is Mandatory.** All lists must implement `skip` and `take`. The system defaults to `limit=10`.

## Memory & CPU Tuning
1. **Node.js Garbage Collection:** When running in Docker/Kubernetes, set `--max-old-space-size=2048` or appropriate relative to your Pod memory limit to prevent Node from hoarding memory and getting OOMKilled by the kernel.
2. **Compression:** GZIP compression is enabled. For JSON payloads > 100KB (e.g., fetching large routes), compression reduces network transfer time by 80% at the cost of slight CPU overhead.

## Database Tuning
1. **Connection String Parameters:** 
   `DATABASE_URL=postgresql://user:pass@host:5432/db?schema=public&connection_limit=10&pool_timeout=15`
2. **Indexes:** Use composite indexes on `[companyId, <frequently_filtered_field>]` to ensure Tenant-scoped queries don't trigger full table scans.
3. **LocationHistory Archival:** GPS pings grow infinitely. Implement a background CronJob to archive `LocationHistory` older than 6 months into cold storage (S3 parquet files) to keep the live DB lean.
