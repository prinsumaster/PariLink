// @ts-nocheck
import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Processor('reporting-queue', { concurrency: 5 })
export class ReportingProcessor extends WorkerHost {
  private readonly logger = new Logger(ReportingProcessor.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    const { companyId, templateId, executionId, userId, filters } = job.data;
    this.logger.log(
      `Generating report ${executionId} for template ${templateId}`,
    );

    try {
      // 1. Update status to PROCESSING
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.reportExecution.update({
          where: { id: executionId },
          data: { status: 'PROCESSING' },
        }),
      );

      // 2. Fetch data based on template type (Mocked for integration)
      const template = await this.prisma.runAsSystem(async (tx) =>
        tx.reportTemplate.findUnique({ where: { id: templateId } }),
      );

      if (!template) throw new Error('Template missing');

      // (Simulate PDF/Excel Generation here with puppeteer or exceljs)
      const mockFileUrl = `https://s3.amazonaws.com/parilink-reports/${companyId}/${executionId}.${template.format.toLowerCase()}`;

      // 3. Mark COMPLETED
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.reportExecution.update({
          where: { id: executionId },
          data: {
            status: 'COMPLETED',
            fileUrl: mockFileUrl,
            completedAt: new Date(),
          },
        }),
      );

      // 4. Audit Log
      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'REPORTING',
        streamId: executionId,
        eventType: 'ReportExecuted',
        payload: { fileUrl: mockFileUrl, format: template.format },
        userId,
      });

      this.logger.log(`Report ${executionId} generated successfully`);
      return { fileUrl: mockFileUrl };
    } catch (error) {
      this.logger.error(`Report execution failed: ${error}`);
      await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.reportExecution.update({
          where: { id: executionId },
          data: {
            status: 'FAILED',
            errorMsg: error instanceof Error ? error.message : String(error),
            completedAt: new Date(),
          },
        }),
      );
      throw error;
    }
  }
}
