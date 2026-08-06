import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('fuel-management')
export class FuelManagementProcessor {
  private readonly logger = new Logger(FuelManagementProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('process-fuel-transaction')
  async handleFuelCardSync(job: Job) {
    const {
      provider,
      cardId,
      vehicleNumber,
      liters,
      amount,
      timestamp,
      companyId,
    } = job.data;

    this.logger.log(`Syncing ${provider} fuel data for ${vehicleNumber}`);

    const vehicle = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findFirst({
        where: { companyId, licensePlate: vehicleNumber },
      }),
    );

    if (!vehicle) return { error: 'Vehicle not found' };

    // Find the active trip to allocate expense
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findFirst({
        where: { companyId, vehicleId: vehicle.id, status: 'IN_TRANSIT' },
      }),
    );

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.expense.create({
        data: {
          companyId,
          tripId: trip?.id,
          amount,
          type: 'FUEL',
          date: new Date(timestamp),
          status: trip ? 'RECONCILED' : 'UNALLOCATED',
          notes: `Fuel auto-matched`,
        },
      }),
    );

    // Anomaly Detection Rule (Mock): If mileage is abnormally low, alert
    // E.g., comparing recent odometer vs liters.
    this.logger.log(`Fuel transaction saved for ${vehicleNumber}`);
  }
}
