import { Injectable, UnauthorizedException} from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerAnalyticsService {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  constructor(private prisma: PrismaService) {}

  async getDashboardKpis(companyId: string, customerId: string) {
    if (!customerId)
      throw new UnauthorizedException('Customer context missing');

    const [activeLoads, totalDelivered, totalInvoices] = await Promise.all([
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.count({
          where: {
            companyId,
            customerId,
            status: { in: ['DISPATCHED', 'IN_TRANSIT'] },
          },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.load.count({
          where: { companyId, customerId, status: 'DELIVERED' },
        }),
      ),
      this.prisma.runAsTenant(companyId, async (tx) =>
        tx.invoice.aggregate({
          where: { companyId, customerId, status: { not: 'PAID' } },
          _sum: { amount: true },
        }),
      ),
    ]);

    return {
      activeLoads,
      totalDelivered,
      outstandingBalance: totalInvoices._sum?.amount || 0,
      onTimeDeliveryRate: 98.5, // Mock for now, would aggregate from IntelligenceRiskAssessment
    };
  }
}
