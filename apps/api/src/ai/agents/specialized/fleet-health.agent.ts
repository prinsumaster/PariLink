import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class FleetHealthAgent extends BaseAgent {
  readonly agentName = 'FleetHealthAgent';
  readonly roleDescription =
    'Monitors vehicle telemetry and engine fault codes. Predicts vehicle breakdowns and recommends immediate service actions before critical failure.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'check_fleet_health',
      description: 'Evaluate health of fleet. Input: {"companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          criticalAlerts: 2,
          recommendations: [
            {
              vehicleId: 'TRK-102',
              issue: 'Engine Coolant Temp High',
              action: 'Schedule immediate maintenance',
              confidence: 0.95,
            },
          ],
        });
      },
    }),
  ];
}
