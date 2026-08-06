import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerFinanceService {
  private readonly logger = new Logger(CustomerFinanceService.name);

  constructor(private prisma: PrismaService) {}

  async getInvoices(companyId: string, customerId: string) {
    if (!customerId)
      throw new UnauthorizedException('Customer context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: {
          companyId,
          customerId,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          payments: true,
        },
      }),
    );
  }

  async getAccountSummary(companyId: string, customerId: string) {
    if (!customerId)
      throw new UnauthorizedException('Customer context missing');

    const invoices = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: { companyId, customerId },
        select: { amount: true, status: true },
      }),
    );

    const totalInvoiced = invoices.reduce(
      (acc, inv) => acc + (inv.amount || 0),
      0,
    );
    const totalOutstanding = invoices
      .filter((inv) => inv.status !== 'PAID')
      .reduce((acc, inv) => acc + (inv.amount || 0), 0);

    return {
      totalInvoiced,
      totalOutstanding,
      invoiceCount: invoices.length,
      overdueCount: invoices.filter((inv) => inv.status === 'OVERDUE').length,
    };
  }
}
