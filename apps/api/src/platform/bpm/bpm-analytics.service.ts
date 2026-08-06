import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  IAnalyticsProvider,
  AnalyticsRegistryService,
} from '../analytics/analytics-registry.service';

export interface ProcessAnalyticsResult {
  averageCompletionTimeHours: number;
  slaCompliancePercentage: number;
  automationPercentage: number;
  manualPercentage: number;
  failureRate: number;
  escalationRate: number;
  bottlenecks: string[];
}

@Injectable()
export class BpmAnalyticsService implements OnModuleInit, IAnalyticsProvider {
  private readonly logger = new Logger(BpmAnalyticsService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly analyticsRegistry: AnalyticsRegistryService,
  ) {}

  onModuleInit() {
    this.analyticsRegistry.register(this);
  }

  getDomainName(): string {
    return 'bpm';
  }

  async getAnalytics(companyId: string, timeframe: string): Promise<any> {
    return this.getProcessAnalytics(companyId, timeframe);
  }

  /**
   * Evaluates enterprise workflow efficiency.
   */
  async getProcessAnalytics(
    companyId: string,
    processDefinitionId: string,
    periodDays = 30,
  ): Promise<ProcessAnalyticsResult> {
    this.logger.log(`Evaluating BPM Analytics for ${processDefinitionId}`);

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Mock metrics generation. In reality, these aggregate via the EventStore
      // over 'PROCESS_INSTANCE' streams matching the definitionId.

      // Mock Analytics indicating high automation
      return {
        averageCompletionTimeHours: 1.5, // 1 hr 30 mins from start to end
        slaCompliancePercentage: 98.2, // 98.2% completed within SLA
        automationPercentage: 85.0, // 85% System Tasks / Rules
        manualPercentage: 15.0, // 15% Human Tasks
        failureRate: 0.5, // 0.5% ended in ERROR state
        escalationRate: 2.1, // 2.1% required manager intervention
        bottlenecks: ['Finance_Approval_Node', 'Vendor_Verification_Node'],
      };
    });
  }
}
