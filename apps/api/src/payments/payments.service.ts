import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPayments(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const data = await tx.payment.findMany({
        where: { companyId },
        orderBy: { paymentDate: 'desc' },
        include: {
          invoice: { select: { invoiceNumber: true } },
        },
      });
      return {
        data,
        total: data.length,
        meta: { total: data.length, page: 1, lastPage: 1 },
      };
    });
  }

  async getPaymentsByInvoice(companyId: string, invoiceId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.payment.findMany({
        where: { invoiceId, companyId },
        orderBy: { paymentDate: 'desc' },
      });
    });
  }

  async recordPayment(companyId: string, payload: any) {
    const { invoiceId, amount, method, referenceNumber, paymentDate, notes } =
      payload;

    if (amount <= 0) {
      throw new BadRequestException('Payment amount must be greater than zero');
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Lock/Check Invoice Balance first — enforce companyId to prevent IDOR
      const invoice = await tx.invoice.findFirst({
        where: { id: invoiceId, companyId },
        include: { payments: true },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');

      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = invoice.amount - totalPaid;

      if (amount > balance && invoice.status !== 'PAID') {
        throw new BadRequestException(
          `Payment of ${amount} exceeds remaining balance of ${balance}`,
        );
      }

      // 2. Create the payment record
      const payment = await tx.payment.create({
        data: {
          companyId,
          invoiceId,
          amount,
          method,
          referenceNumber,
          paymentDate: new Date(paymentDate),
          notes,
        },
      });

      // 3. Update invoice status if fully paid
      if (totalPaid + amount >= invoice.amount && invoice.status !== 'PAID') {
        await tx.invoice.update({
          where: { id: invoiceId },
          data: { status: 'PAID' },
        });
      }

      return payment;
    });
  }
}
