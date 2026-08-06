import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class RevenueLeakageAgent extends BaseAgent {
  readonly agentName = 'RevenueLeakageAgent';
  readonly roleDescription =
    'Audits accessorial charges, detention time, toll mismatches, and unbilled expenses. Recommends invoice adjustments to capture lost revenue.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'audit_revenue_leakage',
      description:
        'Audit unbilled detention and accessorials. Input: {"companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          unbilledRevenueFound: 1250.0,
          recommendations: [
            {
              loadId: 'LOD-9921',
              issue: 'Unbilled 3 hours detention at receiver',
              action: 'Add $150 detention charge to invoice',
              confidence: 0.98,
            },
          ],
        });
      },
    }),
  ];
}
