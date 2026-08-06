import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DriverSettlementService {
  constructor(private prisma: PrismaService) {}

  async calculateSettlement(tripId: string, companyId: string) {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId },
        include: { expenses: true, vehicle: true, driver: true },
      }),
    );

    if (!trip || trip.companyId !== companyId)
      throw new Error('Trip not found');

    let totalAdvance = 0;
    let totalToll = 0;
    let totalFuel = 0;
    let totalCashExpenses = 0;

    trip.expenses.forEach((exp: any) => {
      if (exp.category === 'ADVANCE') totalAdvance += exp.amount;
      if (exp.category === 'TOLL') totalToll += exp.amount;
      if (exp.category === 'FUEL') totalFuel += exp.amount;
      if (exp.category === 'CASH') totalCashExpenses += exp.amount;
    });

    // Example logic: Driver is paid a fixed rate per trip, minus any advances they took
    const tripBasePay = 1500;

    // The driver owes the company the cash advance, but gets reimbursed for approved cash expenses
    const netSettlement = tripBasePay - totalAdvance + totalCashExpenses;

    const settlementRecord = {
      tripId,
      driverId: trip.driverId,
      basePay: tripBasePay,
      deductions: totalAdvance,
      reimbursements: totalCashExpenses,
      netPayable: netSettlement,
      status: 'PENDING_APPROVAL', // Requires Maker/Checker via @RequireApproval()
    };

    return settlementRecord;
  }
}
