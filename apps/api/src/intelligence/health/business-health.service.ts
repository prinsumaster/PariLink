import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../../platform/events/event.service';
import { MetricsEngineService } from '../../analytics/engine/metrics-engine.service';

@Injectable()
export class BusinessHealthService {
  private readonly logger = new Logger(BusinessHealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
    private readonly metrics: MetricsEngineService,
  ) {}

  /**
   * Orchestrates the calculation of the Business Health Vitals
   */
  async calculateHealthVitals(companyId: string) {
    this.logger.log(
      `Calculating Business Health Vitals for company ${companyId}`,
    );

    // 1. Calculate Operational Health
    const operationalData = await this.calculateOperationalHealth(companyId);

    // 2. Calculate Financial Health
    const financialData = await this.calculateFinancialHealth(companyId);

    const snapshot = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.businessHealthSnapshot.create({
        data: {
          companyId,
          operationalScore: operationalData.score,
          financialScore: financialData.score,
          contributingFactors: {
            operational: operationalData.factors,
            financial: financialData.factors,
          },
        },
      }),
    );

    // 3. Fetch LIN Industry Benchmarks
    const benchmarks = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.linBenchmark.findMany(),
    );
    const benchmarkMap = benchmarks.reduce(
      (acc, b) => ({ ...acc, [b.metricName]: b.value }),
      {},
    );

    // 4. Emit Event for Realtime SSE Update
    this.eventService.publish('BusinessHealth.Updated', {
      tenantId: companyId,
      payload: {
        operationalScore: snapshot.operationalScore,
        financialScore: snapshot.financialScore,
        timestamp: snapshot.timestamp,
        factors: snapshot.contributingFactors,
        industryBenchmarks: benchmarkMap,
      },
    });

    return snapshot;
  }

  /**
   * Calculates Operational Health Score (0-100)
   */
  private async calculateOperationalHealth(companyId: string) {
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    // Factor 1: Fleet Utilization
    const fleetUtil = await this.metrics.getFleetUtilization(companyId);
    const utilizationScore = fleetUtil.percentage; // 0-100

    // Factor 2: Active AI Anomalies Penalty
    const activeAnomalies = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.operationalAnomaly.count({
          where: { companyId, status: 'OPEN' },
        }),
    );
    // Deduct 5 points per active anomaly, max deduction 30
    const anomalyPenalty = Math.min(activeAnomalies * 5, 30);

    // Factor 3: Morning Plan Exception Penalty
    const planExceptions = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.operationalPlanItem.count({
          where: {
            plan: { companyId, date: startOfDay },
            status: { in: ['NEEDS_APPROVAL', 'REQUIRES_HUMAN'] },
          },
        }),
    );
    // Deduct 2 points per unresolved exception, max deduction 20
    const exceptionPenalty = Math.min(planExceptions * 2, 20);

    // Factor 4: On-time Delivery Rate (Trips completed today vs delayed)
    const tripsToday = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findMany({
        where: { companyId, createdAt: { gte: startOfDay } },
      }),
    );
    const completedOrTransit = tripsToday.filter(
      (t) => t.status === 'COMPLETED' || t.status === 'IN_TRANSIT',
    ).length;
    const delayed = tripsToday.filter((t) => t.status === 'DELAYED').length;

    let onTimeScore = 100;
    if (tripsToday.length > 0) {
      onTimeScore = (completedOrTransit / tripsToday.length) * 100;
    }

    // Weighting Algorithm
    // Base is driven by On-time and Utilization, dragged down by unresolved exceptions
    const baseScore = utilizationScore * 0.4 + onTimeScore * 0.6;
    let finalScore = baseScore - anomalyPenalty - exceptionPenalty;

    // Clamp to 0-100
    finalScore = Math.max(0, Math.min(100, finalScore));

    return {
      score: finalScore,
      factors: {
        utilizationScore,
        onTimeScore,
        activeAnomalies,
        planExceptions,
      },
    };
  }

  /**
   * Calculates Financial Health Score (0-100)
   */
  private async calculateFinancialHealth(companyId: string) {
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Factor 1: Revenue Momentum (MTD)
    const revenueKpi = await this.metrics.getRevenueKPI(
      companyId,
      thirtyDaysAgo,
      now,
    );
    // Arbitrary target for health demo: $100k trailing 30 days is "100 score"
    const revenueTarget = 100000;
    const revenueScore = Math.min(
      (revenueKpi.value / revenueTarget) * 100,
      100,
    );

    // Factor 2: AR Aging (Unpaid Invoices)
    const unpaidInvoices = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.invoice.findMany({
          where: { companyId, status: 'ISSUED', dueDate: { lt: now } },
        }),
    );
    const totalArAging = unpaidInvoices.reduce(
      (sum, inv) => sum + (inv.amount || 0),
      0,
    );
    // Deduct points based on severity of overdue AR
    let arPenalty = 0;
    if (totalArAging > 50000) arPenalty = 30;
    else if (totalArAging > 10000) arPenalty = 15;

    // Weighting Algorithm
    let finalScore = revenueScore - arPenalty;
    // Default to a realistic baseline if brand new company
    if (revenueKpi.value === 0 && totalArAging === 0) {
      finalScore = 85;
    }

    // Clamp to 0-100
    finalScore = Math.max(0, Math.min(100, finalScore));

    return {
      score: finalScore,
      factors: {
        revenueValue: revenueKpi.value,
        revenueScore,
        totalArAging,
        arPenalty,
      },
    };
  }
}
