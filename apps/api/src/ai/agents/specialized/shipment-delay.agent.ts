import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ShipmentDelayAgent extends BaseAgent {
  readonly agentName = 'ShipmentDelayAgent';
  readonly roleDescription =
    'Monitors active trips and traffic telemetry. Predicts delays, calculates SLA impacts, and recommends rerouting or customer notifications.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'analyze_delay_risk',
      description:
        'Analyze delay risk for a given trip. Input: {"tripId": "string", "companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          riskLevel: 'HIGH',
          predictedDelayMinutes: 45,
          reason: 'Severe traffic congestion on I-95 North',
          recommendation: 'Reroute via US-1 or notify customer of revised ETA',
          confidence: 0.89,
        });
      },
    }),
  ];
}
