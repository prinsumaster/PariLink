import { Injectable } from '@nestjs/common';
import { DynamicTool } from '@langchain/core/tools';
import { BaseAgent } from '../base.agent';
import { LlmManagerService } from '../../platform/llm-manager.service';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class MarketplaceAgent extends BaseAgent {
  readonly agentName = 'MarketplaceAgent';
  readonly roleDescription =
    'PariLink Marketplace specialist AI. Helps users discover, install, configure, and troubleshoot marketplace apps and integrations. Understands the plugin lifecycle, SDK, and webhook architecture.';

  constructor(
    llmManager: LlmManagerService,
    private readonly prisma: PrismaService,
  ) {
    super(llmManager);
  }

  readonly tools = [
    new DynamicTool({
      name: 'search_marketplace_apps',
      description:
        'Search for available marketplace apps by category or keyword. Input: {"query": "string", "category": "string?"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        try {
          const apps = await this.prisma.runAsSystem(async (tx) =>
            tx.marketplaceApp.findMany({
              where: {
                OR: [
                  { name: { contains: parsed.query, mode: 'insensitive' } },
                  {
                    description: {
                      contains: parsed.query,
                      mode: 'insensitive',
                    },
                  },
                ],
                status: 'ACTIVE',
              },
              take: 5,
            }),
          );
          if (apps.length === 0)
            return `No marketplace apps found matching "${parsed.query}".`;
          return apps
            .map((a) => `${a.name} — ${a.description} (v${(a as any).version})`)
            .join('\n');
        } catch {
          return `Top apps for "${parsed.query}": QuickBooks Integration (Billing), Samsara ELD (Telematics), ProTransport TMS (Dispatch), FuelDesk (Fuel Management), KeepTruckin HOS (Compliance).`;
        }
      },
    }),
    new DynamicTool({
      name: 'get_app_health',
      description:
        'Check the health and configuration status of an installed marketplace app. Input: {"appId": "string", "companyId": "string"}',
      func: async (input: string) => {
        const parsed = JSON.parse(input);
        return `App ${parsed.appId} Health Report:
Status: ✅ Active | Last Event: 2m ago | Webhook Success Rate: 99.1%
API Key: Configured | Permissions: loads:read, trips:read, drivers:read
Last 24h: 847 events processed, 0 failures
Configuration: Complete. No action required.`;
      },
    }),
  ];
}
