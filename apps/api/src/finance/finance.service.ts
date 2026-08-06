import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateExpenseDto,
  CreateSettlementDto,
  CreateVendorBillDto,
  CreatePaymentDto,
} from './dto/finance.dto';

@Injectable()
export class FinanceService {
  constructor(private prisma: PrismaService) {}

  async getInvoices(companyId: string, query: any = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (query.status) {
      where.status = query.status;
    }

    const [invoices, total] = await this.prisma.runAsTenant(
      companyId,
      async (tx) => {
        return Promise.all([
          tx.invoice.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: 'desc' },
          }),
          tx.invoice.count({ where }),
        ]);
      },
    );

    return { data: invoices, total, page, limit };
  }

  async getExpenses(companyId: string, query: any = {}) {
    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 20;
    const skip = (page - 1) * limit;

    const where: any = { companyId };
    if (query.type) {
      where.type = query.type;
    }

    const [expenses, total] = await this.prisma.runAsTenant(
      companyId,
      async (tx) => {
        return Promise.all([
          tx.expense.findMany({
            where,
            skip,
            take: limit,
            orderBy: { date: 'desc' },
          }),
          tx.expense.count({ where }),
        ]);
      },
    );

    return { data: expenses, total, page, limit };
  }

  async createExpense(companyId: string, dto: CreateExpenseDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Validate driver and trip
      if (dto.driverId) {
        const driver = await tx.driver.findFirst({
          where: { id: dto.driverId },
        });
        if (!driver) throw new NotFoundException('Driver not found');
      }
      if (dto.tripId) {
        const trip = await tx.trip.findFirst({ where: { id: dto.tripId } });
        if (!trip) throw new NotFoundException('Trip not found');
      }

      return tx.expense.create({
        data: {
          companyId,
          type: dto.type,
          amount: dto.amount,
          date: new Date(dto.date),
          notes: dto.notes,
          tripId: dto.tripId,
          driverId: dto.driverId,
        },
      });
    });
  }

  async createSettlement(companyId: string, dto: CreateSettlementDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await tx.driver.findFirst({ where: { id: dto.driverId } });
      if (!driver) throw new NotFoundException('Driver not found');

      const netPayable =
        dto.amount - (dto.advances || 0) - (dto.deductions || 0);

      const settlement = await tx.settlement.create({
        data: {
          companyId,
          driverId: dto.driverId,
          type: dto.type,
          amount: dto.amount,
          periodStart: new Date(dto.periodStart),
          periodEnd: new Date(dto.periodEnd),
          advances: dto.advances || 0,
          deductions: dto.deductions || 0,
          netPayable,
          status: 'DRAFT',
        },
      });

      return settlement;
    });
  }

  async createVendorBill(companyId: string, dto: CreateVendorBillDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vendor = await tx.vendor.findFirst({ where: { id: dto.vendorId } });
      if (!vendor) throw new NotFoundException('Vendor not found');

      const bill = await tx.vendorBill.create({
        data: {
          companyId,
          vendorId: dto.vendorId,
          billNumber: dto.billNumber,
          amount: dto.amount,
          dueDate: dto.dueDate ? new Date(dto.dueDate) : null,
          status: 'DRAFT',
        },
      });

      return bill;
    });
  }

  async recordPayment(companyId: string, dto: CreatePaymentDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const invoice = await tx.invoice.findFirst({
        where: { id: dto.invoiceId },
      });
      if (!invoice) throw new NotFoundException('Invoice not found');
      if (invoice.status === 'DRAFT' || invoice.status === 'VOIDED') {
        throw new BadRequestException('Cannot pay a DRAFT or VOIDED invoice');
      }

      // Check current payments
      const existingPayments = await tx.payment.findMany({
        where: { invoiceId: dto.invoiceId },
      });
      const paidAmount =
        existingPayments.reduce((sum, p) => sum + p.amount, 0) + dto.amount;

      const payment = await tx.payment.create({
        data: {
          companyId,
          invoiceId: dto.invoiceId,
          amount: dto.amount,
          method: dto.method,
          referenceNumber: dto.referenceNumber,
          paymentDate: new Date(dto.paymentDate),
          notes: dto.notes,
        },
      });

      // Update invoice status if fully paid
      if (paidAmount >= invoice.amount) {
        await tx.invoice.update({
          where: { id: dto.invoiceId },
          data: { status: 'PAID' },
        });
      }

      // LEDGER INTEGRATION (Double Entry for Payment Receipt)
      // Debit: Bank/Cash (1000)
      // Credit: Accounts Receivable (1200)

      const bankAccount = await tx.account.upsert({
        where: { companyId_code: { companyId, code: '1000' } },
        update: {},
        create: {
          companyId,
          name: 'Bank Account',
          code: '1000',
          type: 'ASSET',
        },
      });

      const arAccount = await tx.account.upsert({
        where: { companyId_code: { companyId, code: '1200' } },
        update: {},
        create: {
          companyId,
          name: 'Accounts Receivable',
          code: '1200',
          type: 'ASSET',
        },
      });

      await tx.journalEntry.create({
        data: {
          companyId,
          referenceType: 'PAYMENT',
          referenceId: payment.id,
          description: `Payment Receipt for Invoice ${invoice.invoiceNumber}`,
          status: 'POSTED',
          lines: {
            create: [
              {
                companyId,
                accountId: bankAccount.id,
                debit: payment.amount,
                credit: 0,
                description: 'Bank/Cash',
              },
              {
                companyId,
                accountId: arAccount.id,
                debit: 0,
                credit: payment.amount,
                description: 'AR reduction',
              },
            ],
          },
        },
      });

      return payment;
    });
  }
}
