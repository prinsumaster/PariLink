import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerLoadsService {
  private readonly logger = new Logger(CustomerLoadsService.name);

  constructor(private prisma: PrismaService) {}

  async getActiveLoads(companyId: string, customerId: string) {
    if (!customerId)
      throw new UnauthorizedException('Customer context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findMany({
        where: {
          companyId,
          customerId,
          status: { in: ['DISPATCHED', 'IN_TRANSIT'] },
        },
        include: {
          trip: {
            select: {
              id: true,
              status: true,
              vehicleId: true,
              driverId: true,
              vehicle: { select: { licensePlate: true, type: true } },
            },
          },
        },
      }),
    );
  }

  async getLoadHistory(companyId: string, customerId: string) {
    if (!customerId)
      throw new UnauthorizedException('Customer context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.load.findMany({
        where: {
          companyId,
          customerId,
          status: { in: ['DELIVERED', 'COMPLETED', 'CANCELLED'] },
        },
        orderBy: { updatedAt: 'desc' },
        take: 50,
      }),
    );
  }
}
