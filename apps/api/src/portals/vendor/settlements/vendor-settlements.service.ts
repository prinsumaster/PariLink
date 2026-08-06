import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class VendorSettlementsService {
  private readonly logger = new Logger(VendorSettlementsService.name);

  constructor(private prisma: PrismaService) {}

  async getBills(companyId: string, vendorId: string) {
    if (!vendorId) throw new UnauthorizedException('Vendor context missing');

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vendorBill.findMany({
        where: {
          companyId,
          vendorId,
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async getDashboardKpis(companyId: string, vendorId: string) {
    if (!vendorId) throw new UnauthorizedException('Vendor context missing');

    const bills = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.vendorBill.findMany({
        where: { companyId, vendorId },
        select: { amount: true, status: true },
      }),
    );

    const pendingAmount = bills
      .filter((b) => b.status === 'PENDING' || b.status === 'APPROVED')
      .reduce((sum, b) => sum + b.amount, 0);

    const paidAmount = bills
      .filter((b) => b.status === 'PAID')
      .reduce((sum, b) => sum + b.amount, 0);

    return {
      pendingAmount,
      paidAmount,
      totalBills: bills.length,
    };
  }
}
