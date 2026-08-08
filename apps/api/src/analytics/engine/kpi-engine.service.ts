// @ts-nocheck
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

import { AuditService } from '../../platform/audit/audit.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class KpiEngineService {
  constructor(
    private prisma: PrismaService,
    private audit: AuditService,
    private eventStore: EventStoreService,
  ) {}

  async createKpi(companyId: string, userId: string, data: any) {
    const kpi = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.kpiDefinition.create({
        data: {
          companyId,
          name: data.name,
          description: data.description,
          formula: data.formula,
          targetValue: data.targetValue,
          alertThreshold: data.alertThreshold,
          createdBy: userId,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'analytics:kpi:create',
      entity: 'KpiDefinition',
      entityId: kpi.id,
      userId,
      companyId,
      details: { name: kpi.name },
    });

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'KPI_DEFINITION',
      streamId: kpi.id,
      eventType: 'KpiCreated',
      payload: { name: kpi.name, formula: kpi.formula },
      userId,
    });

    return kpi;
  }

  async listKpis(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.kpiDefinition.findMany({ where: { companyId } }),
    );
  }

  async recordCustomMetric(companyId: string, data: any, userId?: string) {
    const metric = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.customMetric.create({
        data: {
          companyId,
          name: data.name,
          value: data.value,
          dimension: data.dimension,
        },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'CUSTOM_METRIC',
      streamId: metric.id,
      eventType: 'MetricRecorded',
      payload: { name: metric.name, value: metric.value },
      userId,
    });

    return metric;
  }

  async generateTrendReport(companyId: string, kpiId: string, period: string) {
    const kpi = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.kpiDefinition.findUnique({ where: { id: kpiId, companyId } }),
    );
    if (!kpi) throw new NotFoundException('KPI not found');

    // MOCK DATA for trend generation based on formula
    const data = [
      { date: '2026-08-01', value: 120 },
      { date: '2026-08-02', value: 135 },
      { date: '2026-08-03', value: 125 },
    ];

    const report = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trendReport.create({
        data: {
          companyId,
          kpiId,
          metricName: kpi.name,
          period,
          data,
        },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'TREND_REPORT',
      streamId: report.id,
      eventType: 'TrendReportGenerated',
      payload: { kpiId, period },
    });

    return report;
  }

  async getTopPerformers(companyId: string, metric: string) {
    // E.g. get drivers with highest trip completion
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driverScore.findMany({
        where: { companyId },
        orderBy: { efficiencyScore: 'desc' },
        take: 10,
        include: { driver: true },
      }),
    );
  }

  async getBottomPerformers(companyId: string, metric: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.driverScore.findMany({
        where: { companyId },
        orderBy: { efficiencyScore: 'asc' },
        take: 10,
        include: { driver: true },
      }),
    );
  }
}
