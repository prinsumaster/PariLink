import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IoTService {
  private readonly logger = new Logger(IoTService.name);

  constructor(private prisma: PrismaService) {}

  async ingestTelemetry(providerId: string, payload: any) {
    // In production, this would parse provider-specific formats (e.g. LocoNav, Samsara)
    // and potentially push to a BullMQ queue for async processing.

    // For now, assume a generic payload format:
    // { vehicleId, latitude, longitude, speed, fuelLevel, timestamp }

    // Example: Log to VehicleLocation for real-time map plotting
    if (payload.vehicleId && payload.latitude && payload.longitude) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.vehicleLocation.create({
          data: {
            companyId: 'UNKNOWN_COMPANY', // In prod, this would map from the provider settings
            provider: providerId,
            providerVehicleId: payload.vehicleId,
            vehicleId: payload.vehicleId,
            latitude: payload.latitude,
            longitude: payload.longitude,
            speed: payload.speed || 0,
            heading: payload.heading || 0,
            gpsTimestamp: payload.timestamp
              ? new Date(payload.timestamp)
              : new Date(),
          },
        }),
      );
    }

    return { status: 'ingested' };
  }
}
