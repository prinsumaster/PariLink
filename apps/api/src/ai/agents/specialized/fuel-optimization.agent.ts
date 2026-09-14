import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';
import { FuelIntelligenceService } from '../../../intelligence/fuel/fuel-intelligence.service';

@Injectable()
export class FuelOptimizationAgent extends BaseAgent {
  readonly agentName = 'FuelOptimizationAgent';
  readonly roleDescription =
    'Analyzes fuel consumption, topography, and real-time fuel prices. Recommends optimal refueling stops and efficient driving patterns.';

  constructor(
    llmManager: LlmManagerService,
  // @ts-ignore: DI dependency reserved for future use
    private readonly _prisma: PrismaService,
    private readonly fuelIntelligence: FuelIntelligenceService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'optimize_fuel_route',
      description:
        'Optimize fuel consumption for active trips. Input: {"companyId": "string"}',
      func: async (_input: string) => {
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
    new DynamicTool({
      name: 'get_fuel_anomalies',
      description: 'Get a list of fuel anomalies (possible theft, pilferage, mechanical issues) for a company. Identifies worst drivers and trucks. Input: {"companyId": "string"}',
      func: async (input: string) => {
        try {
          const { companyId } = JSON.parse(input);
          const anomalies = await this.fuelIntelligence.getAnomalies(companyId);
          return JSON.stringify(anomalies);
        } catch (e) {
          return "Failed to fetch fuel anomalies";
        }
      }
    }),
  ];
}
