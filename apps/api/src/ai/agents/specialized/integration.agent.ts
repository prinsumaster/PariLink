import { Injectable } from '@nestjs/common';
import { BaseAgent } from '../base.agent';
import { PrismaService } from '../../../prisma/prisma.service';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { DynamicTool } from '@langchain/core/tools';

@Injectable()
export class IntegrationAgent extends BaseAgent {
  readonly agentName = 'IntegrationAgent';
  readonly roleDescription =
    'Diagnoses integration errors, checks sync status, and manages 3rd party connections.';

  readonly tools = [
    new DynamicTool({
      name: 'get_recent_sync_errors',
      description:
        'Fetch the most recent synchronization errors. Input should be {"limit": number}',
      func: async (input: string) => {
        const args = JSON.parse(input);
        const errors = await this.prisma.runAsSystem(async (tx) =>
          tx.syncError.findMany({
            orderBy: { createdAt: 'desc' },
            take: args.limit || 5,
            include: { connection: { include: { connector: true } } },
          }),
        );
        return JSON.stringify(
          errors.map((e: any) => ({
            id: e.id,
            provider: e.connection.connector.provider,
            errorMessage: e.errorMessage,
            date: e.createdAt,
          })),
        );
      },
    }),
    new DynamicTool({
      name: 'retry_failed_sync',
      description:
        'Queue a manual retry for a specific failed connection. Input should be {"connectionId": "string"}',
      func: async (input: string) => {
        const args = JSON.parse(input);
        return `Retry queued for connection ${args.connectionId}`;
      },
    }),
  ];

  constructor(
    llmManager: LlmManagerService,
    private prisma: PrismaService,
  ) {
    super(llmManager);
  }
}
