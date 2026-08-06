import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { PrismaService } from '../../prisma/prisma.service';
import { BusinessHealthService } from './business-health.service';

@Injectable()
export class BusinessHealthScheduler {
  private readonly logger = new Logger(BusinessHealthScheduler.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly healthService: BusinessHealthService,
  ) {}

  /**
   * Run every 5 minutes to continuously monitor and snapshot business health.
   */
  @Cron(CronExpression.EVERY_5_MINUTES)
  async handleBusinessHealthMonitoring() {
    this.logger.log('Running Continuous Business Health Monitoring...');

    // In a real multi-tenant app, we'd loop through all active tenants.
    // For MVP/Demo purposes, we find distinct companies with active operations.
    const companies = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findMany({
        take: 10, // Process top 10 for demo scale
      }),
    );

    for (const company of companies) {
      try {
        await this.healthService.calculateHealthVitals(company.id);
      } catch (e) {
        this.logger.error(
          `Failed to calculate health for company ${company.id}: ${e.message}`,
        );
      }
    }

    this.logger.log('Completed Business Health Monitoring cycle.');
  }
}
