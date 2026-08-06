import { Injectable, Logger, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerTrackingService {
  private readonly logger = new Logger(CustomerTrackingService.name);

  constructor(private prisma: PrismaService) {}

  async getTrackingLink(companyId: string, customerId: string, loadId: string) {
    if (!customerId)
      throw new UnauthorizedException('Customer context missing');

    const load = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findFirst({
        where: { id: loadId, companyId, customerId },
        include: {
          trip: {
            select: {
              id: true,
              status: true,
              vehicle: { select: { licensePlate: true } },
              driver: {
                select: { firstName: true, lastName: true, phone: true },
              },
            },
          },
        },
      }),
    );

    if (!load) {
      throw new UnauthorizedException('Invalid load or unauthorized');
    }

    // Return tracking information and ETA
    return {
      loadId: load.id,
      origin: load.originCity,
      destination: load.destinationCity,
      status: load.status,
      trip: load.trip,
      liveTrackingUrl: `https://track.parilink.com/${load.id}`,
      etaPrediction: {
        predictedTime: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // Mock 2 days
        confidenceScore: 0.89,
      },
    };
  }
}
