// @ts-nocheck
import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { EventStoreService } from '../platform/digital-twin/event-store.service';
import { AuditService } from '../platform/audit/audit.service';

@Injectable()
export class ReportingService {
  private readonly logger = new Logger(ReportingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
    private readonly auditService: AuditService,
    @InjectQueue('reporting-queue') private readonly reportingQueue: Queue,
  ) {}

  async createTemplate(companyId: string, data: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const template = await tx.reportTemplate.create({
        data: {
          companyId,
          name: data.name,
          description: data.description,
          type: data.type,
          format: data.format || 'PDF',
          configuration: data.configuration,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Reporting',
          entityType: 'ReportTemplate',
          entityId: template.id,
          action: 'CREATE',
          details: { name: template.name, type: template.type },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'REPORTING',
        streamId: template.id,
        eventType: 'ReportTemplateCreated',
        payload: { name: template.name, type: template.type },
        userId,
      });

      return template;
    });
  }

  async listTemplates(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.reportTemplate.findMany({
        where: { companyId },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async createSchedule(companyId: string, data: any, userId: string) {
    return this.prisma.$transaction(async (tx) => {
      const template = await tx.reportTemplate.findUnique({
        where: { id: data.templateId, companyId },
      });
      if (!template) throw new NotFoundException('Template not found');

      const schedule = await tx.reportSchedule.create({
        data: {
          companyId,
          templateId: data.templateId,
          cronExpression: data.cronExpression,
          recipients: data.recipients,
          nextRunAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // Mock next run logic
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Reporting',
          entityType: 'ReportSchedule',
          entityId: schedule.id,
          action: 'CREATE',
          details: {
            templateId: data.templateId,
            cronExpression: schedule.cronExpression,
          },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'REPORTING',
        streamId: schedule.id,
        eventType: 'ReportScheduleCreated',
        payload: { cronExpression: schedule.cronExpression },
        userId,
      });

      return schedule;
    });
  }

  async listExecutions(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.reportExecution.findMany({
        where: { companyId },
        orderBy: { startedAt: 'desc' },
        take: 50,
        include: { template: true },
      }),
    );
  }

  async enqueueReportExecution(
    companyId: string,
    templateId: string,
    filters: any,
    userId: string,
  ) {
    const template = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.reportTemplate.findUnique({
        where: { id: templateId, companyId },
      }),
    );
    if (!template) throw new NotFoundException('Template not found');

    const execution = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.reportExecution.create({
        data: {
          companyId,
          templateId,
          status: 'PENDING',
        },
      }),
    );

    // Offload to BullMQ for PDF/Excel generation
    await this.reportingQueue.add('generate-report', {
      companyId,
      templateId,
      executionId: execution.id,
      filters,
      userId,
    });

    return execution;
  }
}
