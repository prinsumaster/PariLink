import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import * as crypto from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';

export interface StandardTelemetryPayload {
  appId: string;
  secretKey: string;
  companyId: string;
  records: Array<{
    providerVehicleId: string;
    latitude: number;
    longitude: number;
    speed?: number;
    heading?: number;
    ignition?: boolean;
    gpsTimestamp: string;
  }>;
}

@Injectable()
export class TelemetryIngressService {
  private readonly logger = new Logger(TelemetryIngressService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * HMAC-SHA256 over the raw request body, compared in constant time.
   *
   * Replaces `creds.secretKey !== payload.secretKey`, which had three
   * separate problems:
   *   1. FAILED OPEN. The check was guarded by `creds?.secretKey &&`, so an
   *      installation with no secret configured skipped verification
   *      entirely -- anyone who knew a companyId and appId could post
   *      telemetry. That is the serious one.
   *   2. The secret travelled in the request body, so it landed in access
   *      logs, proxy logs and crash dumps.
   *   3. `!==` on a string short-circuits at the first differing byte,
   *      leaking length and prefix under timing analysis.
   *
   * Fails closed: a missing secret is a configuration error and is rejected,
   * not waved through. Same shape as request-signature.guard.ts.
   */
  private verifyTelemetrySignature(
    secret: string | undefined,
    rawBody: Buffer | undefined,
    signature: string | undefined,
  ): void {
    if (!secret) {
      this.logger.error(
        '[TELEMETRY] Rejected: no secretKey configured for this installation. ' +
          'Refusing to accept unauthenticated telemetry.',
      );
      throw new UnauthorizedException('Telemetry signing is not configured');
    }
    if (!rawBody || !signature) {
      throw new UnauthorizedException('Missing telemetry signature');
    }

    const expected = crypto
      .createHmac('sha256', secret)
      .update(rawBody)
      .digest();

    let provided: Buffer;
    try {
      provided = Buffer.from(signature.replace(/^sha256=/, ''), 'hex');
    } catch {
      throw new UnauthorizedException('Malformed telemetry signature');
    }

    // Compare lengths first: timingSafeEqual throws on a length mismatch, so
    // letting it throw would itself be a side channel.
    if (
      provided.length !== expected.length ||
      !crypto.timingSafeEqual(provided, expected)
    ) {
      throw new UnauthorizedException('Invalid telemetry signature');
    }
  }

  async processIncomingTelemetry(
    payload: StandardTelemetryPayload,
    rawBody?: Buffer,
    signature?: string,
  ) {
    this.logger.log(
      `Received telemetry from App ${payload.appId} for Company ${payload.companyId}`,
    );

    // In a real system, secretKey would be validated securely
    // For now, let's verify the installation exists
    const installation = await this.prisma.runAsTenant(payload.companyId, async (tx) =>
      tx.appInstallation.findUnique({
        where: {
          companyId_appId: {
            companyId: payload.companyId,
            appId: payload.appId,
          },
        },
        include: { app: true },
      }),
    );

    if (!installation || installation.status !== 'ACTIVE') {
      throw new UnauthorizedException('Invalid or inactive App Installation');
    }

    const creds = installation.credentials as any;
    this.verifyTelemetrySignature(creds?.secretKey, rawBody, signature);

    // Process each record
    let successCount = 0;
    for (const record of payload.records) {
      try {
        await this.prisma.runAsTenant(payload.companyId, async (tx) =>
          tx.vehicleLocation.create({
            data: {
              companyId: payload.companyId,
              provider: installation.app.provider,
              providerVehicleId: record.providerVehicleId,
              latitude: record.latitude,
              longitude: record.longitude,
              speed: record.speed,
              heading: record.heading,
              ignition: record.ignition,
              gpsTimestamp: new Date(record.gpsTimestamp),
            },
          }),
        );
        successCount++;

        // Keep VehicleCurrentPosition live -- the dispatch map reads it
        // instead of scanning history. The WHERE on DO UPDATE guards against
        // an out-of-order or replayed ping overwriting a fresher fix with a
        // stale one; Prisma's upsert cannot express that condition, so this
        // is raw.
        await this.prisma.runAsTenant(payload.companyId, async (tx) =>
          tx.$executeRaw`
            INSERT INTO "VehicleCurrentPosition"
              ("companyId","providerVehicleId","provider","latitude","longitude",
               "speed","heading","ignition","gpsTimestamp","updatedAt")
            VALUES (${payload.companyId}, ${record.providerVehicleId},
                    ${installation.app.provider}, ${record.latitude},
                    ${record.longitude}, ${record.speed ?? null},
                    ${record.heading ?? null}, ${record.ignition ?? null},
                    ${new Date(record.gpsTimestamp)}, now())
            ON CONFLICT ("companyId","providerVehicleId") DO UPDATE SET
              "latitude"     = EXCLUDED."latitude",
              "longitude"    = EXCLUDED."longitude",
              "speed"        = EXCLUDED."speed",
              "heading"      = EXCLUDED."heading",
              "ignition"     = EXCLUDED."ignition",
              "gpsTimestamp" = EXCLUDED."gpsTimestamp",
              "updatedAt"    = now()
            WHERE "VehicleCurrentPosition"."gpsTimestamp" < EXCLUDED."gpsTimestamp"`,
        );

        // The per-ping DomainEvent write was removed here.
        //
        // DomainEvent as a table IS consumed -- 7 read sites across
        // enterprise-event-bus.service.ts, event-store.service.ts and
        // occ.controller.ts -- so the outbox is not dead. But
        // 'VehicleLocationReceived' specifically had exactly ONE occurrence
        // in the codebase: this write. Nothing ever read it.
        //
        // At 10,000 trucks pinging every 2 minutes that was 7.2M rows/day of
        // an event nobody consumes, doubling telemetry write volume to
        // ~14.4M rows/day and adding a second transaction to every ping.
        //
        // A position fix is not a domain event -- it carries no decision and
        // no state transition. If downstream consumers need movement
        // signals, emit on thresholds (geofence crossing, ignition on/off,
        // stop start/end), not every fix.
      } catch (err) {
        this.logger.error(
          `Error processing record for ${record.providerVehicleId}`,
          err,
        );
      }
    }

    return { processed: successCount, total: payload.records.length };
  }
}
