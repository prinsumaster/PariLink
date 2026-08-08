import { Processor, Process } from '@nestjs/bull';
import type { Job } from 'bull';
import { PrismaService } from '../../prisma/prisma.service';
import { Logger } from '@nestjs/common';

@Processor('fastag-reconciliation')
export class FastagReconciliationProcessor {
  private readonly logger = new Logger(FastagReconciliationProcessor.name);

  constructor(private prisma: PrismaService) {}

  @Process('reconcile-toll')
  async handleTollDeduction(job: Job) {
    const { vehicleNumber, tollPlazaId, amount, timestamp, companyId } =
      job.data;

    if (
      typeof amount !== 'number' ||
      isNaN(amount) ||
      amount <= 0 ||
      !isFinite(amount)
    ) {
      this.logger.error(`Invalid toll amount for ${vehicleNumber}: ${amount}`);
      return;
    }

    this.logger.log(
      `Reconciling FASTag deduction for ${vehicleNumber} at ${tollPlazaId}`,
    );

    // 1. Find the vehicle
    const vehicle = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vehicle.findFirst({
        where: { companyId, licensePlate: vehicleNumber },
      }),
    );

    if (!vehicle) {
      this.logger.error(
        `Vehicle ${vehicleNumber} not found for FASTag reconciliation.`,
      );
      return;
    }

    // 2. Find the active trip for this vehicle at the time of the deduction
    // Assuming IN_TRANSIT and matching timestamp bounds
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findFirst({
        where: {
          companyId,
          vehicleId: vehicle.id,
          status: 'IN_TRANSIT',
          // In a real scenario, check if timestamp is between trip start and end
        },
      }),
    );

    if (!trip) {
      this.logger.warn(
        `No active trip found for ${vehicleNumber}. Tagging as unallocated expense.`,
      );
      // Record as unallocated expense
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.expense.create({
          data: {
            companyId,
            amount,
            type: 'TOLL',
            date: new Date(timestamp),
            status: 'UNALLOCATED',
            notes: `FASTag deduction at ${tollPlazaId}`,
          },
        }),
      );
      return;
    }

    // 3. Auto-Reconcile against the Trip
    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.expense.create({
        data: {
          companyId,
          tripId: trip.id,
          amount,
          type: 'TOLL',
          date: new Date(timestamp),
          status: 'RECONCILED',
          notes: `FASTag auto-matched for Trip ${trip.id} at ${tollPlazaId}`,
        },
      }),
    );

    this.logger.log(
      `Successfully reconciled ₹${amount} toll to Trip ${trip.id}`,
    );
  }
}
