import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';

@Injectable()
export class PaymentsService {
  constructor(private prisma: PrismaService) {}

  async getPayments(companyId: string, page = 1, limit = 10) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { skip, take } = getPaginationParams(page, limit);

      const [data, total] = await Promise.all([
        tx.payment.findMany({
          where: { companyId },
          skip,
          take,
          orderBy: { paymentDate: 'desc' },
          include: {
            invoice: { select: { invoiceNumber: true } },
          },
        }),
        tx.payment.count({ where: { companyId } }),
      ]);

      return createPaginationResponse(data, total, page, limit);
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

    if (
      typeof amount !== 'number' ||
      isNaN(amount) ||
      !isFinite(amount) ||
      amount <= 0
    ) {
      throw new BadRequestException(
        'Payment amount must be a valid positive number',
      );
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Lock/Check Invoice Balance first — enforce companyId to prevent IDOR
      const invoice = await tx.invoice.findFirst({
        where: { id: invoiceId, companyId },
        include: { payments: true },
      });

      if (!invoice) throw new NotFoundException('Invoice not found');

      if (referenceNumber) {
        const duplicate = await tx.payment.findFirst({
          where: { companyId, referenceNumber },
        });
        if (duplicate)
          throw new BadRequestException(
            `Duplicate payment reference: ${referenceNumber}`,
          );
      }

      const totalPaid = invoice.payments.reduce((sum, p) => sum + p.amount, 0);
      const balance = invoice.amount - totalPaid;

      if (amount > balance && invoice.status !== 'PAID') {
        throw new BadRequestException(
          `Payment of ${amount} exceeds remaining balance of ${balance}`,
        );
      }

      // 2. Optimistic Locking: Touch the invoice to prevent concurrent modifications
      const newStatus =
        totalPaid + amount >= invoice.amount ? 'PAID' : invoice.status;
      await this.prisma.updateWithOcc(
        tx,
        'invoice',
        invoiceId,
        invoice.updatedAt,
        { status: newStatus },
      );

      // 3. Create the payment record
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

      return payment;
    });
  }
}
