import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class CapacityPlanningAgent extends BaseAgent {
  readonly agentName = 'CapacityPlanningAgent';
  readonly roleDescription =
    'Forecasts seasonal load volumes and analyzes fleet availability. Recommends leasing additional capacity or bidding aggressively on spot markets to fill empty backhauls.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'forecast_capacity',
      description:
        'Forecast fleet capacity requirements. Input: {"companyId": "string", "horizonDays": 14}',
      func: async (input: string) => {
        return JSON.stringify({
          shortfallPredicted: true,
          shortfallRegion: 'Midwest',
          recommendation: 'Lease 5 additional dry vans for Q3 peak season',
          confidence: 0.79,
        });
      },
    }),
  ];
}
