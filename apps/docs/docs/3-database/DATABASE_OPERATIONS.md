# Database Operations Guide (GA)

## 1. Connection Pooling & Scaling
- **PgBouncer**: For workloads exceeding 500 concurrent connections, PgBouncer is required. It sits between the Node.js API and PostgreSQL to manage transaction pooling.
- **Prisma Configuration**: `DATABASE_URL` uses the `pgbouncer=true` query parameter when hitting a PgBouncer instance, ensuring Prisma doesn't rapidly open/close expensive native DB connections.

## 2. Backups and Point-in-Time Recovery (PITR)
- **Nightly Snapshots**: Full automated EBS/Disk snapshots are taken nightly.
- **WAL Archiving**: Continuous WAL (Write-Ahead Log) archiving via `pgBackRest` or `wal-g` allows for Point-in-Time Recovery down to the minute.
- **Retention**: 30 days for daily snapshots, 7 days for granular WAL data.

## 3. Maintenance Operations
- **Vacuum Strategy**: Postgres Auto-vacuum is tuned to trigger more aggressively on heavily updated tables (like `Trips` and `Loads`) to prevent transaction ID wraparound and table bloat.
- **Index Maintenance**: Weekly `REINDEX CONCURRENTLY` tasks are scheduled during the Sunday low-traffic window to resolve index fragmentation.
- **Query Profiling**: Enable `pg_stat_statements` to constantly monitor and identify missing indexes or expensive sequential scans.

## 4. Migrations & Rollbacks
- Prisma Migrations (`npx prisma migrate deploy`) are executed automatically during CI/CD.
- **Rollback Plan**: Prisma does not support native down-migrations. If a deployment fails post-migration, the data model remains at the new version while the application rolls back. All schema changes must be backwards-compatible (e.g., adding columns without `NOT NULL` defaults in existing tables).
