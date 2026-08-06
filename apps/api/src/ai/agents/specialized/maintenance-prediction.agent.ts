import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MaintenancePredictionAgent extends BaseAgent {
  readonly agentName = 'MaintenancePredictionAgent';
  readonly roleDescription =
    'Analyzes historical service records and OEM data. Predicts optimal maintenance windows to minimize downtime and prevent out-of-route mileage.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'predict_maintenance_needs',
      description:
        'Predict maintenance schedule needs. Input: {"companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          upcomingService: [
            {
              vehicleId: 'TRK-224',
              type: 'PM A',
              predictedDate: '2026-08-15',
              confidence: 0.88,
            },
          ],
        });
      },
    }),
  ];
}
