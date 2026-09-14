import { Injectable} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class InvoicingService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private prisma: PrismaService) {}

  async generateInvoice(
    companyId: string,
    customerId: string,
    amount: string,
    invoiceNumber: string,
  ) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.create({
        data: {
          companyId,
          customerId,
          amount: parseFloat(amount),
          invoiceNumber,
          status: 'DRAFT',
        },
      }),
    );
  }

  async getInvoices(companyId: string) {
    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findMany({
        where: { companyId },
        include: {
          customer: { select: { name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }
}
