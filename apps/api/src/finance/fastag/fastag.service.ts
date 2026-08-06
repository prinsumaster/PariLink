import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class FastagService {
  private readonly logger = new Logger(FastagService.name);

  constructor(private prisma: PrismaService) {}

  async syncTollTransactions(
    companyId: string,
    accountId: string,
    payload: any,
  ) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tollTransaction.create({
        data: {
          companyId,
          accountId,
          tollPlazaName: payload.tollPlazaName,
          amount: parseFloat(payload.amount),
          transactionDate: new Date(payload.transactionDate),
          referenceNo: payload.referenceNo,
        },
      }),
    );
  }

  async getTransactions(companyId: string) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.tollTransaction.findMany({
        where: { companyId },
        orderBy: { transactionDate: 'desc' },
        take: 50,
      }),
    );
  }
}
