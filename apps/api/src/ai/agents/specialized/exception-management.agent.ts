import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class ExceptionManagementAgent extends BaseAgent {
  readonly agentName = 'ExceptionManagementAgent';
  readonly roleDescription =
    'Orchestrates cross-functional responses to operational exceptions (e.g., driver sickness, missing documents, rejected freight). Recommends workflow escalations.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'manage_exceptions',
      description: 'Process active exceptions. Input: {"companyId": "string"}',
      func: async (input: string) => {
        return JSON.stringify({
          activeExceptions: 1,
          recommendations: [
            {
              exceptionId: 'EXC-401',
              issue: 'Missing POD document for Load LOD-5012',
              action: 'Auto-email driver to upload POD via mobile app',
              confidence: 0.9,
            },
          ],
        });
      },
    }),
  ];
}
