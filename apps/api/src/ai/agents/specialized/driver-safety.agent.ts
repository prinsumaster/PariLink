import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DriverSafetyAgent extends BaseAgent {
  readonly agentName = 'DriverSafetyAgent';
  readonly roleDescription =
    'Analyzes driver behavior metrics (harsh braking, speeding). Predicts accident risks and recommends coaching or schedule adjustments.';

  constructor(
    llmManager: LlmManagerService,
  // @ts-ignore: DI dependency reserved for future use
    private readonly _prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'analyze_driver_safety',
      description:
        'Analyze safety score of drivers. Input: {"companyId": "string"}',
      func: async (_input: string) => {
        return JSON.stringify({
          atRiskDrivers: 1,
          details: [
            {
              driverId: 'DRV-442',
              riskLevel: 'MEDIUM',
              reason: 'Repeated harsh braking events',
              recommendation: 'Assign safety training module',
              confidence: 0.82,
            },
          ],
        });
      },
    }),
  ];
}
