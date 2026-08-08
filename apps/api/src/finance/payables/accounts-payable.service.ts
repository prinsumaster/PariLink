import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
    const paymentAmount = parseFloat(amount);
    if (isNaN(paymentAmount) || paymentAmount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    return await this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Atomically mark invoice as PAID if not already paid
      const invoiceUpdate = await tx.invoice.updateMany({
        where: { id: invoiceId, companyId, status: { not: 'PAID' } },
        data: { status: 'PAID' },
      });

      if (invoiceUpdate.count === 0) {
        throw new BadRequestException(
          'Invoice is already paid or does not exist',
        );
      }

      // 3. Create the payment
      const payment = await tx.payment.create({
        data: {
          companyId,
          invoiceId,
          amount: paymentAmount,
          method,
          paymentDate: new Date(),
        },
      });

      // Payment is now successfully recorded atomically

      return payment;
    });
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
