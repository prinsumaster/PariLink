import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VehicleLifecycleService {
  private readonly logger = new Logger(VehicleLifecycleService.name);

  constructor(private prisma: PrismaService) {}

  async getFleetStatus(companyId: string) {
    // Returns active vehicles vs out of service
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.groupBy({
        by: ['status'],
        where: { companyId },
        _count: { _all: true },
      }),
    );
  }

  async onboardVehicle(companyId: string, data: any) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.create({
        data: {
          ...data,
          companyId,
          status: 'AVAILABLE',
        },
      }),
    );
  }
}
