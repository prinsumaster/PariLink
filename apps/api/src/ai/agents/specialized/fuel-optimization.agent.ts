import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FuelOptimizationAgent extends BaseAgent {
  readonly agentName = 'FuelOptimizationAgent';
  readonly roleDescription =
    'Analyzes fuel consumption, topography, and real-time fuel prices. Recommends optimal refueling stops and efficient driving patterns.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'optimize_fuel_route',
      description:
        'Optimize fuel consumption for active trips. Input: {"companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          potentialSavings: 350.0,
          recommendations: [
            {
              tripId: 'TRP-1129',
              action:
                'Refuel at Pilot Travel Center (Exit 45) instead of current planned stop',
              savings: 45.2,
              confidence: 0.92,
            },
          ],
        });
      },
    }),
  ];
}
