import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class LedgerService {
  constructor(private prisma: PrismaService) {}

  async getChartOfAccounts(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.account.findMany({ orderBy: { code: 'asc' } });
    });
  }

  async getTrialBalance(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const accounts = await tx.account.findMany({ orderBy: { code: 'asc' } });

      const aggregations = await tx.journalLine.groupBy({
        by: ['accountId'],
        _sum: { debit: true, credit: true },
        where: { entry: { status: 'POSTED' } },
      });

      const aggMap = new Map(aggregations.map((a) => [a.accountId, a]));

      return accounts.map((account) => {
        const agg = aggMap.get(account.id);
        const totalDebit = agg?._sum?.debit || 0;
        const totalCredit = agg?._sum?.credit || 0;

        let balance = 0;
        if (account.type === 'ASSET' || account.type === 'EXPENSE') {
          balance = totalDebit - totalCredit;
        } else {
          balance = totalCredit - totalDebit;
        }

        return {
          accountId: account.id,
          code: account.code,
          name: account.name,
          type: account.type,
          totalDebit,
          totalCredit,
          balance,
        };
      });
    });
  }

  async getProfitAndLoss(
    companyId: string,
    startDate?: string,
    endDate?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const whereClause: any = { status: 'POSTED' };
      if (startDate || endDate) {
        whereClause.date = {};
        if (startDate) whereClause.date.gte = new Date(startDate);
        if (endDate) whereClause.date.lte = new Date(endDate);
      }

      const revAgg = await tx.journalLine.aggregate({
        _sum: { debit: true, credit: true },
        where: { account: { type: 'REVENUE' }, entry: whereClause },
      });

      const expAgg = await tx.journalLine.aggregate({
        _sum: { debit: true, credit: true },
        where: { account: { type: 'EXPENSE' }, entry: whereClause },
      });

      const totalRevenue = (revAgg._sum.credit || 0) - (revAgg._sum.debit || 0);
      const totalExpense = (expAgg._sum.debit || 0) - (expAgg._sum.credit || 0);

      return {
        totalRevenue,
        totalExpense,
        netIncome: totalRevenue - totalExpense,
      };
    });
  }
}
