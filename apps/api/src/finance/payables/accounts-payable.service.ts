import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AccountsPayableService {
  private readonly logger = new Logger(AccountsPayableService.name);

  constructor(private prisma: PrismaService) {}

  async processPayment(
    companyId: string,
    invoiceId: string,
    amount: string,
    method: string,
  ) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.payment.create({
        data: {
          companyId,
          invoiceId,
          amount: parseFloat(amount),
          method,
          paymentDate: new Date(),
        },
      }),
    );
  }

  async getPayments(companyId: string) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.payment.findMany({
        where: { companyId },
        include: {
          invoice: { select: { invoiceNumber: true } },
        },
        orderBy: { paymentDate: 'desc' },
      }),
    );
  }
}
