import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class SandboxService {
  private readonly logger = new Logger(SandboxService.name);

  constructor(private readonly prisma: PrismaService) {}

  async generateMockData(companyId: string, userId: string) {
    this.logger.log(`Generating mock data for company ${companyId}`);

    // Check if we already have mock data generated to prevent duplicates
    const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driver.findFirst({
        where: {
          companyId,
          firstName: 'Mock',
          lastName: { startsWith: 'Driver' },
        },
      }),
    );

    if (existing) {
      return {
        status: 'SKIPPED',
        message: 'Mock data already exists for this company.',
      };
    }

    await this.prisma.$transaction(async (tx) => {
      // 1. Create Mock Drivers
      const driver1 = await tx.driver.create({
        data: {
          companyId,
          firstName: 'Mock',
          lastName: 'Driver 1',
          status: 'ACTIVE',
          licenseNumber: 'MD-123456',
        },
      });

      // 2. Create Mock Vehicles
      const vehicle1 = await tx.vehicle.create({
        data: {
          companyId,
          type: 'TRUCK',
          licensePlate: 'MOCK-01',
          status: 'ACTIVE',
        },
      });

      // 3. Create Mock Trips
      await tx.trip.create({
        data: {
          companyId,
          tripNumber: 'TRP-MOCK-001',
          status: 'DISPATCHED',
          driverId: driver1.id,
          vehicleId: vehicle1.id,
          route: {
            origin: {
              address: '123 Tech Lane, San Francisco, CA',
              lat: 37.7749,
              lng: -122.4194,
            },
            destination: {
              address: '456 Innovation Blvd, Austin, TX',
              lat: 30.2672,
              lng: -97.7431,
            },
          },
          startDate: new Date(),
        },
      });
    });

    return { status: 'SUCCESS', message: 'Mock data successfully generated.' };
  }
}
