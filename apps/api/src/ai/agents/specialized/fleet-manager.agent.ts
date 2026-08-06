import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';

@Injectable()
export class FleetManagerAgent extends BaseAgent {
  readonly agentName = 'FleetManagerAgent';
  readonly roleDescription =
    'Expert fleet manager capable of diagnosing vehicle health, predicting maintenance, and tracking utilization.';

  constructor(llmManager: LlmManagerService) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'predict_maintenance',
      description:
        'Predicts when a vehicle needs maintenance. Input should be {"vehicleId": "string"}',
      func: async (input: string) => {
        // Phase 5 & 6 Mock Implementation
        const parsed = JSON.parse(input);
        return `Vehicle ${parsed.vehicleId} requires an oil change in 4,500 miles. Brake pads are at 40% health.`;
      },
    }),
    new DynamicTool({
      name: 'locate_vehicle',
      description:
        'Returns the current GPS coordinates of a vehicle. Input should be {"vehicleId": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `Vehicle ${parsed.vehicleId} is currently at 34.0522° N, 118.2437° W (Los Angeles).`;
      },
    }),
  ];
}
