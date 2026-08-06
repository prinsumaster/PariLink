import { Injectable, Logger } from '@nestjs/common';
import { KnowledgeGraphService } from '../knowledge/knowledge-graph.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ContextEngineService {
  private readonly logger = new Logger(ContextEngineService.name);

  constructor(
    private readonly knowledgeGraph: KnowledgeGraphService,
    private readonly prisma: PrismaService,
  ) {}

  /**
   * Builds the ultimate "System Prompt" + "Data Context" payload for the AI model.
   * This ensures the AI never hallucinates, as it only reasons over explicitly provided context.
   */
  async buildAiContext(
    companyId: string,
    entityType: string,
    entityId: string,
    additionalContext?: any,
  ): Promise<string> {
    this.logger.debug(
      `Building Context Window for ${entityType} [${entityId}]`,
    );

    // 1. Fetch Knowledge Graph
    const graph = await this.knowledgeGraph.buildEntityGraph(
      companyId,
      entityType,
      entityId,
    );

    // 2. Fetch Recent Unresolved Anomalies across the company to provide situational awareness
    const activeAnomalies = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.aiAnomaly.findMany({
          where: { companyId, status: 'UNRESOLVED' },
          select: { category: true, severity: true, description: true },
          take: 5,
        }),
    );

    // 3. Fetch Operational Metadata (e.g. Current Time, Active Subsystems)
    const systemState = {
      timestamp: new Date().toISOString(),
      tenantId: companyId,
      activeAlerts: activeAnomalies.length,
    };

    // 4. Serialize into Markdown format (LLMs parse Markdown structure extremely well)
    return this.serializeToMarkdown(
      systemState,
      graph,
      activeAnomalies,
      additionalContext,
    );
  }

  private serializeToMarkdown(
    systemState: any,
    graph: any,
    anomalies: any[],
    extra: any,
  ): string {
    return `
# SYSTEM CONTEXT
Time: ${systemState.timestamp}
Active Anomalies in Tenant: ${systemState.activeAlerts}

# KNOWLEDGE GRAPH (${graph.root?.type || 'Unknown'})
## Target Entity
\`\`\`json
${JSON.stringify(graph.root?.data || {}, null, 2)}
\`\`\`

## Relationships
\`\`\`json
${JSON.stringify(graph.relationships || {}, null, 2)}
\`\`\`

# ACTIVE ANOMALIES
${anomalies.map((a) => `- [${a.severity}] ${a.category}: ${a.description}`).join('\n') || 'None'}

# ADDITIONAL CONTEXT
\`\`\`json
${JSON.stringify(extra || {}, null, 2)}
\`\`\`

---
Analyze the above context. DO NOT hallucinate external facts. Base all recommendations strictly on the provided graphs and states.
`;
  }
}
