import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CustomerSlaRiskAgent extends BaseAgent {
  readonly agentName = 'CustomerSlaRiskAgent';
  readonly roleDescription =
    'Monitors customer contracts, volume commitments, and delivery performance. Predicts SLA breaches before they occur and recommends proactive recovery actions.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'analyze_sla_risk',
      description:
        'Analyze SLA risks across top customers. Input: {"companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          highRiskContracts: 1,
          details: [
            {
              customer: 'Acme Corp',
              metric: 'On-Time Delivery',
              current: '94%',
              required: '95%',
              recommendation: 'Prioritize Acme Corp loads for team drivers',
              confidence: 0.85,
            },
          ],
        });
      },
    }),
  ];
}
