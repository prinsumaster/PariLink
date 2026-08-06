import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DriverTripsService {
  private readonly logger = new Logger(DriverTripsService.name);

  constructor(private prisma: PrismaService) {}

  async getActiveTrip(companyId: string, driverId: string) {
    if (!driverId) throw new UnauthorizedException('Driver context missing');

    // Find trips that are dispatched or in transit for the driver
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findFirst({
        where: {
          companyId,
          driverId,
          status: { in: ['PLANNED', 'DISPATCHED', 'IN_TRANSIT'] },
        },
        include: {
          vehicle: { select: { licensePlate: true, type: true } },
          loads: {
            include: {
              customer: { select: { name: true, phone: true } },
            },
          },
        },
        orderBy: { createdAt: 'asc' }, // Get the oldest active trip first
      }),
    );

    return trip;
  }

  async updateTripStatus(
    companyId: string,
    driverId: string,
    tripId: string,
    status: string,
    location: any,
  ) {
    if (!driverId) throw new UnauthorizedException('Driver context missing');

    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId, driverId },
      }),
    );

    if (!trip) {
      throw new UnauthorizedException('Trip not found or access denied');
    }

    // Optionally log location in LocationHistory here

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.update({
        where: { id: tripId },
        data: { status },
      }),
    );
  }
}
