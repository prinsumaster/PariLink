import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RetentionService {
  private readonly logger = new Logger(RetentionService.name);

  constructor(private readonly prisma: PrismaService) {}

  async enforceRetentionPolicies() {
    this.logger.log('Starting enterprise data retention enforcement jobs...');
    // Simulated retention enforcement

    // GPS History: 2 years default
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);

    const deletedGps = await this.prisma.runAsSystem(async (tx) =>
      tx.locationHistory.deleteMany({
        where: {
          timestamp: {
            lt: twoYearsAgo,
          },
        },
      }),
    );
    this.logger.log(`Purged ${deletedGps.count} expired GPS records`);

    // Invoices: 10 years
    const tenYearsAgo = new Date();
    tenYearsAgo.setFullYear(tenYearsAgo.getFullYear() - 10);
    const archivedInvoices = await this.prisma.runAsSystem(async (tx) =>
      tx.invoice.updateMany({
        where: {
          createdAt: { lt: tenYearsAgo },
          status: { in: ['PAID', 'CANCELLED'] },
        },
        data: {
          status: 'ARCHIVED',
        },
      }),
    );
    this.logger.log(`Archived ${archivedInvoices.count} legacy invoices`);
  }
}
