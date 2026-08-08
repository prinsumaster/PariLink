import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface SettlementContext {
  companyId: string;
  driverId?: string;
  vendorId?: string;
  tripIds: string[];
  advances?: number;
  deductions?: number;
  bonuses?: number;
}

@Injectable()
export class SettlementEngine {
  private readonly logger = new Logger(SettlementEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Automatically calculates and generates Settlements for Drivers and Vendors.
   */
  async generateSettlement(ctx: SettlementContext) {
    this.logger.log(
      `Generating settlement for Driver/Vendor in Company ${ctx.companyId}`,
    );

    return this.prisma.runAsTenant(ctx.companyId, async (tx) => {
      // 1. Aggregate pay from completed trips
      const trips = await tx.trip.findMany({
        where: { id: { in: ctx.tripIds } },
        include: { loads: true },
      });

      if (trips.length === 0) {
        throw new Error('No valid trips found for settlement');
      }

      // 2. Validate that NO trips are already settled
      const alreadySettled = trips.filter((t) => t.settlementId !== null);
      if (alreadySettled.length > 0) {
        this.logger.error(`Attempt to double-settle trips: ${alreadySettled.map(t => t.id).join(', ')}`);
        throw new Error('One or more trips are already settled');
      }

      let grossPay = 0;
      for (const trip of trips) {
        // Dummy logic: flat rate or distance rate depending on employment type
        // Real logic would check Driver profile (Company vs Owner Operator)
        grossPay += (trip.actualDistance || trip.estimatedDistance || 0) * 1.5; // $1.50 per mile/km payout
      }

      const netPayable =
        grossPay +
        (ctx.bonuses || 0) -
        (ctx.advances || 0) -
        (ctx.deductions || 0);

      // 3. Create the Settlement Record and Link Trips Atomically
      if (ctx.driverId) {
        const settlement = await tx.settlement.create({
          data: {
            companyId: ctx.companyId,
            driverId: ctx.driverId,
            type: 'DRIVER_PAY',
            amount: grossPay,
            advances: ctx.advances || 0,
            deductions: ctx.deductions || 0,
            netPayable,
            periodStart: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Weekly
            periodEnd: new Date(),
            status: 'PENDING_APPROVAL',
            trips: {
              connect: trips.map(t => ({ id: t.id }))
            }
          },
        });
        return settlement;
      }

      return null;
    });
  }
}
