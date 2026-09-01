/**
 * C(b) -- queued telemetry ingress. NOT WIRED IN. Nothing imports this and
 * no module registers it; it is a written design to be reviewed before it
 * replaces the current synchronous path.
 *
 * WHAT IT REPLACES
 * telemetry-ingress.service.ts currently does, per PING:
 *   runAsTenant(...) -> BEGIN; set_config; INSERT VehicleLocation; COMMIT
 *   runAsTenant(...) -> BEGIN; set_config; INSERT DomainEvent;    COMMIT
 * inside a sequential `for ... await` loop, after one more transaction for
 * the installation lookup. That is 2 transactions and 2 round trips per
 * ping. At 10,000 trucks pinging every 2 minutes -- 7.2M pings/day -- that
 * is ~14.4M transactions/day, ~167/sec sustained before any burst.
 *
 * WHAT THIS DOES INSTEAD
 *   verify HMAC (constant time) -> enqueue raw batch -> return 202
 *   worker drains up to 500 records -> ONE createMany per tenant
 *
 * Transactions per 500 pings: 2 (one createMany + one current-position
 * upsert) instead of 1000.
 */
import { InjectQueue, Processor, WorkerHost } from '@nestjs/bullmq';
import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { Queue, Job } from 'bullmq';
import * as crypto from 'crypto';
import { PrismaService } from '../../../prisma/prisma.service';

export const TELEMETRY_QUEUE = 'telemetry-ingress';

export interface TelemetryRecord {
  providerVehicleId: string;
  latitude: number;
  longitude: number;
  speed?: number;
  heading?: number;
  ignition?: boolean;
  gpsTimestamp: string;
}

export interface TelemetryJob {
  companyId: string;
  appId: string;
  provider: string;
  records: TelemetryRecord[];
}

/**
 * PRODUCER -- runs in the request path. Must stay O(1) in the number of
 * records: verify, enqueue, return. No database write happens here.
 */
@Injectable()
export class TelemetryIngressProducer {
  private readonly logger = new Logger(TelemetryIngressProducer.name);

  constructor(@InjectQueue(TELEMETRY_QUEUE) private readonly queue: Queue) {}

  /**
   * Replaces the current `creds.secretKey !== payload.secretKey` check, which
   * has two problems: the secret is sent in the request body (so it lands in
   * access logs and any proxy that logs bodies), and `!==` on a string is not
   * constant time, which leaks the secret a byte at a time under timing
   * analysis. HMAC over the raw body fixes both -- the secret never travels,
   * and timingSafeEqual does not short-circuit.
   */
  verifySignature(rawBody: Buffer, signatureHeader: string, secret: string): void {
    const expected = crypto.createHmac('sha256', secret).update(rawBody).digest();
    let provided: Buffer;
    try {
      provided = Buffer.from(signatureHeader.replace(/^sha256=/, ''), 'hex');
    } catch {
      throw new UnauthorizedException('Malformed signature');
    }
    // Length must match before timingSafeEqual, which throws on mismatch --
    // compare lengths separately so that check is not itself a side channel.
    if (provided.length !== expected.length || !crypto.timingSafeEqual(provided, expected)) {
      throw new UnauthorizedException('Invalid telemetry signature');
    }
  }

  /** Enqueue and return. The controller replies 202 immediately. */
  async enqueue(job: TelemetryJob): Promise<void> {
    await this.queue.add('batch', job, {
      removeOnComplete: 1000,
      removeOnFail: 5000,
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }
}

/**
 * WORKER -- runs out of band. One createMany per job instead of one INSERT
 * per record.
 */
@Processor(TELEMETRY_QUEUE, { concurrency: 4 })
export class TelemetryIngressWorker extends WorkerHost {
  private readonly logger = new Logger(TelemetryIngressWorker.name);
  private static readonly CHUNK = 500;

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async process(job: Job<TelemetryJob>): Promise<{ written: number }> {
    const { companyId, provider, records } = job.data;
    let written = 0;

    for (let i = 0; i < records.length; i += TelemetryIngressWorker.CHUNK) {
      const chunk = records.slice(i, i + TelemetryIngressWorker.CHUNK);

      await this.prisma.runAsTenant(companyId, async (tx) => {
        await tx.vehicleLocation.createMany({
          data: chunk.map((r) => ({
            companyId,
            provider,
            providerVehicleId: r.providerVehicleId,
            latitude: r.latitude,
            longitude: r.longitude,
            speed: r.speed,
            heading: r.heading,
            ignition: r.ignition,
            gpsTimestamp: new Date(r.gpsTimestamp),
          })),
          skipDuplicates: true,
        });

        // Current position: one row per vehicle, so the dispatch map never
        // reads history. Only the newest record per vehicle in this chunk
        // matters, and only if it is newer than what is stored -- the
        // WHERE on the DO UPDATE guards against an out-of-order batch
        // overwriting a fresher fix with a stale one.
        const newest = new Map<string, TelemetryRecord>();
        for (const r of chunk) {
          const prev = newest.get(r.providerVehicleId);
          if (!prev || new Date(r.gpsTimestamp) > new Date(prev.gpsTimestamp)) {
            newest.set(r.providerVehicleId, r);
          }
        }
        for (const r of newest.values()) {
          await tx.$executeRaw`
            INSERT INTO "VehicleCurrentPosition"
              ("companyId","providerVehicleId","provider","latitude","longitude",
               "speed","heading","ignition","gpsTimestamp","updatedAt")
            VALUES (${companyId}, ${r.providerVehicleId}, ${provider},
                    ${r.latitude}, ${r.longitude}, ${r.speed ?? null},
                    ${r.heading ?? null}, ${r.ignition ?? null},
                    ${new Date(r.gpsTimestamp)}, now())
            ON CONFLICT ("companyId","providerVehicleId") DO UPDATE SET
              "latitude"     = EXCLUDED."latitude",
              "longitude"    = EXCLUDED."longitude",
              "speed"        = EXCLUDED."speed",
              "heading"      = EXCLUDED."heading",
              "ignition"     = EXCLUDED."ignition",
              "gpsTimestamp" = EXCLUDED."gpsTimestamp",
              "updatedAt"    = now()
            WHERE "VehicleCurrentPosition"."gpsTimestamp" < EXCLUDED."gpsTimestamp"`;
        }
      });

      written += chunk.length;
    }

    return { written };
  }
}

/**
 * DELIBERATELY DROPPED: the per-ping DomainEvent write.
 *
 * The current code writes one DomainEvent row per ping, doubling the write
 * volume to ~14.4M rows/day for an outbox nothing is currently draining.
 * A position update is not a domain event -- it carries no decision and no
 * state transition. If downstream consumers need movement notifications,
 * emit on a threshold (geofence crossing, ignition change, stop start/end)
 * rather than per fix. That is a product decision, flagged not taken.
 */
