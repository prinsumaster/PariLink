import { Injectable} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class VehicleLifecycleService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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

  async getLocations(companyId: string) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicleLocation.findMany({
        where: { companyId },
        orderBy: { gpsTimestamp: 'asc' },
        take: 200,
      }),
    );
  }
}
