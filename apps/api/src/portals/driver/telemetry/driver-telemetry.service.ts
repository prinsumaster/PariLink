import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DriverTelemetryService {
  private readonly logger = new Logger(DriverTelemetryService.name);

  constructor(private prisma: PrismaService) {}

  async logLocation(
    companyId: string,
    driverId: string,
    tripId: string,
    latitude: number,
    longitude: number,
  ) {
    if (!driverId) throw new UnauthorizedException('Driver context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.locationHistory.create({
        data: {
          companyId,
          tripId,
          driverId,
          latitude,
          longitude,
        },
      }),
    );
  }
}
