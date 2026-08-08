import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
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

  async processIncomingTelemetry(payload: StandardTelemetryPayload) {
    this.logger.log(
      `Received telemetry from App ${payload.appId} for Company ${payload.companyId}`,
    );

    // In a real system, secretKey would be validated securely
    // For now, let's verify the installation exists
    const installation = await this.prisma.runAsSystem(async (tx) =>
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
    if (creds?.secretKey && creds.secretKey !== payload.secretKey) {
      throw new UnauthorizedException('Invalid telemetry secret key');
    }

    // Process each record
    let successCount = 0;
    for (const record of payload.records) {
      try {
        await this.prisma.runAsSystem(async (tx) =>
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

        // Push event to DomainEvent (Outbox)
        await this.prisma.runAsSystem(async (tx) =>
          tx.domainEvent.create({
            data: {
              eventType: 'VehicleLocationReceived',
              streamId: record.providerVehicleId,
              streamType: 'Vehicle',
              companyId: payload.companyId,
              version: 1,
              payload: record as any,
            },
          }),
        );
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
