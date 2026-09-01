import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';

/**
 * Creates the upcoming monthly partitions for VehicleLocation.
 *
 * WHY THIS IS NOT OPTIONAL
 * VehicleLocation is RANGE-partitioned on gpsTimestamp
 * (20260901150000_partition_vehicle_location). An INSERT whose gpsTimestamp
 * falls outside every defined partition FAILS -- it is not queued, not
 * redirected, it errors. Without this job, telemetry ingest breaks at
 * 00:00 on the first of whichever month runs out of partitions. That is a
 * scheduled outage with a known date, which is the worst kind to leave
 * undocumented.
 *
 * The migration seeds the current month plus three. This job keeps two
 * months of headroom rolling forward, so a single missed run is survivable
 * and the alerting below has time to be noticed.
 *
 * WHERE IT RUNS
 * As a @Cron in the API container via @nestjs/schedule, which this codebase
 * already uses for its other schedulers (operations.scheduler.ts,
 * business-health.scheduler.ts). That means it runs in EVERY replica. The
 * work is idempotent -- CREATE TABLE IF NOT EXISTS PARTITION OF, and
 * PostgreSQL serialises the concurrent attempts -- so N replicas racing is
 * harmless, just wasteful. If replica count grows, move it to a BullMQ
 * repeatable job so exactly one worker owns it; the Redis instance BullMQ
 * needs is already deployed.
 *
 * IF IT FAILS ANYWAY
 * The migration also creates VehicleLocation_default as a catch-all, so
 * inserts land there rather than erroring -- ingest degrades instead of
 * stopping. That is a safety net, not a plan:
 *   - the default partition is one unbounded heap, so it loses the
 *     partition-pruning benefit for every query touching those dates;
 *   - and it cannot be detached cheaply later. Moving rows out of DEFAULT
 *     into a proper partition requires creating the partition, which
 *     PostgreSQL will not allow while overlapping rows sit in DEFAULT --
 *     they must be copied out, deleted, and copied back, under lock.
 * So: rows in DEFAULT are a page-worthy alarm, not a shrug.
 */
@Injectable()
export class PartitionMaintenanceService implements OnModuleInit {
  private readonly logger = new Logger(PartitionMaintenanceService.name);
  private static readonly MONTHS_AHEAD = 2;

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Is VehicleLocation actually a partitioned table?
   *
   * The partitioning was split out of 20260901150000 after it hit
   * P3018 (ALTER TABLE ... RENAME does not rename constraints, so the old
   * table kept the name "VehicleLocation_pkey" and the new one collided with
   * it). That migration now creates only the index and
   * VehicleCurrentPosition; NO migration currently partitions
   * VehicleLocation.
   *
   * So every operation in this service is a no-op until partitioning lands:
   * CREATE TABLE ... PARTITION OF errors with "is not partitioned", and
   * VehicleLocation_default does not exist. Guarding on relkind='p' means
   * this service can be registered now and simply starts working when the
   * partitioning migration is applied, instead of erroring on every boot and
   * every cron fire.
   */
  private async isPartitioned(): Promise<boolean> {
    const rows = await this.prisma.runAsSystem(
      'partition maintenance: is VehicleLocation partitioned',
      async (tx) =>
        tx.$queryRawUnsafe<{ partitioned: boolean }[]>(
          `SELECT (relkind = 'p') AS partitioned FROM pg_class
           WHERE relname = 'VehicleLocation' LIMIT 1;`,
        ),
    );
    return rows?.[0]?.partitioned === true;
  }

  /** Startup check -- loud, immediate, and before any traffic arrives. */
  async onModuleInit(): Promise<void> {
    try {
      await this.ensurePartitions();
      await this.warnIfNextMonthMissing();
      await this.warnIfDefaultPartitionHasRows();
    } catch (err) {
      // Never block boot on this: a failure here must be visible, not fatal.
      this.logger.error(
        `[PARTITIONS] Startup partition check failed: ${(err as Error).message}`,
      );
    }
  }

  /** 03:10 on the 1st of every month, and again mid-month as a second chance. */
  @Cron('10 3 1,15 * *', { name: 'vehicle-location-partitions' })
  async scheduledEnsure(): Promise<void> {
    await this.ensurePartitions();
    await this.warnIfNextMonthMissing();
  }

  /**
   * Idempotent. Creates the current month plus MONTHS_AHEAD if absent.
   * Runs as system: this is DDL on a shared table, not tenant data.
   */
  async ensurePartitions(): Promise<string[]> {
    if (!(await this.isPartitioned())) {
      this.logger.warn(
        '[PARTITIONS] VehicleLocation is not a partitioned table -- skipping. ' +
          'The partitioning migration was split out of 20260901150000 after a ' +
          'P3018 constraint-name collision and has not been re-applied. Until ' +
          'it is, VehicleLocation grows unbounded (~7.2M rows/day at 10k ' +
          'trucks) and old telemetry cannot be dropped cheaply.',
      );
      return [];
    }
    const created: string[] = [];
    for (let i = 0; i <= PartitionMaintenanceService.MONTHS_AHEAD; i++) {
      const name = await this.createMonth(i);
      if (name) created.push(name);
    }
    if (created.length) {
      this.logger.log(`[PARTITIONS] Created: ${created.join(', ')}`);
    }
    return created;
  }

  private async createMonth(offset: number): Promise<string | null> {
    const rows = await this.prisma.runAsSystem(
      `partition maintenance: ensure VehicleLocation partition month+${offset}`,
      async (tx) =>
        tx.$queryRawUnsafe<{ created: boolean }[]>(`
          DO $$
          DECLARE
            m    date := (date_trunc('month', now()) + interval '${offset} month')::date;
            nxt  date := (date_trunc('month', now()) + interval '${offset + 1} month')::date;
            part text := 'VehicleLocation_' || to_char(m, 'YYYY_MM');
          BEGIN
            IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = part) THEN
              EXECUTE format(
                'CREATE TABLE %I PARTITION OF "VehicleLocation" FOR VALUES FROM (%L) TO (%L)',
                part, m, nxt);
            END IF;
          END $$;
          SELECT true AS created;
        `),
    );
    return rows?.length ? null : null;
  }

  /** The alarm that matters: next month must exist before next month starts. */
  async warnIfNextMonthMissing(): Promise<boolean> {
    if (!(await this.isPartitioned())) return true;
    const next = await this.prisma.runAsSystem(
      'partition maintenance: verify next month exists',
      async (tx) =>
        tx.$queryRawUnsafe<{ exists: boolean }[]>(`
          SELECT EXISTS (
            SELECT 1 FROM pg_class
            WHERE relname = 'VehicleLocation_' ||
                  to_char(date_trunc('month', now()) + interval '1 month', 'YYYY_MM')
          ) AS exists;
        `),
    );
    const ok = next?.[0]?.exists === true;
    if (!ok) {
      this.logger.error(
        '[PARTITIONS] NEXT MONTH PARTITION IS MISSING for VehicleLocation. ' +
          'Telemetry written after the month boundary will fall into ' +
          'VehicleLocation_default, which cannot be detached cheaply. ' +
          'Run PartitionMaintenanceService.ensurePartitions() now.',
      );
    }
    return ok;
  }

  /** Rows in DEFAULT mean either a missed run or a device with a bad clock. */
  async warnIfDefaultPartitionHasRows(): Promise<number> {
    if (!(await this.isPartitioned())) return 0;
    const rows = await this.prisma.runAsSystem(
      'partition maintenance: check default partition',
      async (tx) =>
        tx.$queryRawUnsafe<{ count: bigint }[]>(
          `SELECT count(*)::bigint AS count FROM "VehicleLocation_default";`,
        ),
    );
    const n = Number(rows?.[0]?.count ?? 0);
    if (n > 0) {
      this.logger.error(
        `[PARTITIONS] ${n} rows are sitting in VehicleLocation_default. ` +
          'Either a partition-creation run was missed, or a device is ' +
          'reporting a clock-skewed gpsTimestamp. These rows are not ' +
          'partition-pruned and block creating the partition that should ' +
          'own them.',
      );
    }
    return n;
  }
}
