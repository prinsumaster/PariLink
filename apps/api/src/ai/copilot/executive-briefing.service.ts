import { Injectable, Logger, Inject, forwardRef } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AnalyticsRegistryService } from '../../platform/analytics/analytics-registry.service';

@Injectable()
export class ExecutiveBriefingService {
  private readonly logger = new Logger(ExecutiveBriefingService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRegistry: AnalyticsRegistryService,
  ) {}

  /**
   * Generates C-Level Natural Language Briefings leveraging cross-domain engines.
   */
  async generateDailyBriefing(companyId: string, userId: string) {
    this.logger.log(
      `Copilot generating Daily Executive Briefing for ${companyId}`,
    );

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Collect metrics across all Enterprise Engines

      // Mocks for Demonstration of Integration
      const fleetProvider = this.analyticsRegistry.getProvider('fleet');
      const wmsProvider = this.analyticsRegistry.getProvider('warehouse');

      const fleetMetrics = fleetProvider
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((await fleetProvider.getAnalytics(companyId, 'ALL')) as any)
        : {
            activeVehicles: 45,
            totalVehicles: 50,
            maintenanceAlerts: 2,
            criticalIncidents: 0,
          };

      const wmsMetrics = wmsProvider
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((await wmsProvider.getAnalytics(companyId, 'ALL')) as any)
        : {
            dockUtilization: '85%',
            pendingInbounds: 12,
            pendingOutbounds: 34,
            bottlenecks: 1,
          };
      const bpmProvider = this.analyticsRegistry.getProvider('bpm');
      const finProvider = this.analyticsRegistry.getProvider('finance');

      const bpmMetrics = bpmProvider
        ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
          ((await bpmProvider.getAnalytics(companyId, 'ALL')) as any)
        : {
            activeProcesses: 10,
            bottlenecks: 1,
          };

      const financialMetrics = finProvider
        ? await finProvider.getAnalytics(companyId, 'ALL')
        : {
            revenue: '$124,500',
            profitMargin: '18%',
            outstandingInvoices: 5,
          };

      // In production, an LLM layer would ingest these RAW metrics and construct a narrative.
      // Here we simulate the LLM's structured output.

      return {
        title: 'Daily Operations & Financial Briefing',
        date: new Date().toISOString(),
        summary: `Today's operations achieved a 98.2% SLA compliance rate with fleet utilization holding steady at ${fleetMetrics?.fleetUtilizationPercentage || 85}%. Warehouse throughput remains high, executing at a ${wmsMetrics?.orderFulfillmentRate || 98}% fulfillment rate.`,
        financials: {
          revenue: '$145,000',
          margin: '18.5%',
          warning: 'Fuel expenses spiked 4% in the North-East corridor.',
        },
        risks: [
          '3 Vehicles are overdue for preventive maintenance.',
          "Warehouse 'Cross-Dock-Alpha' is approaching 90% congestion.",
          `BPM Analytics indicates ${bpmMetrics?.bottlenecks.length || 0} process bottlenecks in Finance Approval.`,
        ],
        aiRecommendations: [
          {
            action: 'Re-route 15 pending trips to Contract Carriers.',
            reason:
              'Internal fleet availability is dropping due to pending maintenance.',
            confidence: 0.92,
            actionableLink: '/bpm/start/outsource-trips',
          },
        ],
      };
    });
  }
}
