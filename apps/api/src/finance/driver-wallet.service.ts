import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DriverWalletService {
  constructor(private readonly prisma: PrismaService) {}

  async getWalletBalance(companyId: string, driverId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Calculate pending advances, deductions, expenses, and pending settlements
      const expenses = await tx.expense.aggregate({
        where: { companyId, driverId, status: 'APPROVED' },
        _sum: { amount: true },
      });

      const settlements = await tx.settlement.aggregate({
        where: { companyId, driverId, status: { in: ['DRAFT', 'APPROVED'] } },
        _sum: { netPayable: true },
      });

      // Simple pseudo balance calculation
      return {
        pendingReimbursements: expenses._sum.amount || 0,
        pendingSettlements: settlements._sum.netPayable || 0,
        totalBalance:
          (expenses._sum.amount || 0) + (settlements._sum.netPayable || 0),
      };
    });
  }

  async submitExpense(companyId: string, data: any, driverId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.expense.create({
        data: {
          companyId,
          driverId,
          tripId: data.tripId,
          type: data.type,
          amount: data.amount,
          date: new Date(data.date),
          notes: data.notes,
          status: 'PENDING',
        },
      });
    });
  }

  async getExpenses(companyId: string, driverId?: string, status?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (driverId) where.driverId = driverId;
      if (status) where.status = status;
      return tx.expense.findMany({ where, orderBy: { createdAt: 'desc' } });
    });
  }

  async approveExpense(companyId: string, expenseId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.expense.update({
        where: { id: expenseId, companyId },
        data: { status: 'APPROVED' },
      });
    });
  }

  async generateSettlement(
    companyId: string,
    driverId: string,
    periodStart: Date,
    periodEnd: Date,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Find all approved expenses within period to reimburse
      const expenses = await tx.expense.findMany({
        where: {
          companyId,
          driverId,
          status: 'APPROVED',
          date: { gte: periodStart, lte: periodEnd },
        },
      });

      if (expenses.length === 0) {
        throw new NotFoundException(
          'No approved expenses found for this period',
        );
      }

      // Mark expenses as SETTLED atomically to prevent concurrent double-settlement
      const expenseIds = expenses.map((e) => e.id);
      const updatedExpenses = await tx.expense.updateMany({
        where: { id: { in: expenseIds }, status: 'APPROVED', companyId },
        data: { status: 'SETTLED' },
      });

      if (updatedExpenses.count !== expenses.length) {
        throw new ConflictException(
          'Concurrent settlement generation detected. Some expenses were already settled.',
        );
      }

      const totalReimbursements = expenses.reduce(
        (acc, exp) => acc + exp.amount,
        0,
      );

      // In real scenario we'd also pull trip revenue percentages or per-mile pay
      const basePay = 1000; // Mock base pay
      const deductions = 50; // Mock deductions
      const advances = 100; // Mock advances

      const netPayable = basePay + totalReimbursements - deductions - advances;

      return tx.settlement.create({
        data: {
          companyId,
          driverId,
          amount: basePay + totalReimbursements,
          type: 'BI_WEEKLY',
          status: 'DRAFT',
          periodStart,
          periodEnd,
          advances,
          deductions,
          netPayable,
        },
      });
    });
  }

  async getSettlements(companyId: string, driverId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (driverId) where.driverId = driverId;
      return tx.settlement.findMany({ where, orderBy: { createdAt: 'desc' } });
    });
  }
}
