import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { LlmManagerService } from '../platform/llm-manager.service';
import { ContextEngineService } from '../context/context-engine.service';
import { PromptProtectionService } from '../platform/prompt-protection.service';
import { AiGovernanceService } from '../governance/governance.service';
import { AiObservabilityService } from '../observability/observability.service';
import { EnterpriseMemoryService } from '../memory/memory.service';
import { EnterpriseRagService } from '../rag/rag.service';
import { BaseAgent } from './base.agent';
import { DispatcherAgent } from './specialized/dispatcher.agent';
import { FleetManagerAgent } from './specialized/fleet-manager.agent';
import { IntegrationAgent } from './specialized/integration.agent';
import { WarehouseAgent } from './specialized/warehouse.agent';
import { FinanceAgent } from './specialized/finance.agent';
import { ComplianceAgent } from './specialized/compliance.agent';
import { SupportAgent } from './specialized/support.agent';
import { DeveloperAgent } from './specialized/developer.agent';
import { AnalyticsAgent } from './specialized/analytics.agent';
import { MarketplaceAgent } from './specialized/marketplace.agent';
import { OperationsAgent } from './specialized/operations.agent';

@Injectable()
export class AgentOrchestratorService implements OnModuleInit {
  private readonly logger = new Logger(AgentOrchestratorService.name);
  private agents: Map<string, BaseAgent> = new Map();

  constructor(
    private readonly prisma: PrismaService,
    private readonly llmManager: LlmManagerService,
    private readonly contextEngine: ContextEngineService,
    private readonly promptProtection: PromptProtectionService,
    private readonly governance: AiGovernanceService,
    private readonly observability: AiObservabilityService,
    private readonly memory: EnterpriseMemoryService,
    private readonly rag: EnterpriseRagService,
    // ─── Specialized Agents ────────────────────────────────────────
    private readonly dispatcherAgent: DispatcherAgent,
    private readonly fleetAgent: FleetManagerAgent,
    private readonly integrationAgent: IntegrationAgent,
    private readonly warehouseAgent: WarehouseAgent,
    private readonly financeAgent: FinanceAgent,
    private readonly complianceAgent: ComplianceAgent,
    private readonly supportAgent: SupportAgent,
    private readonly developerAgent: DeveloperAgent,
    private readonly analyticsAgent: AnalyticsAgent,
    private readonly marketplaceAgent: MarketplaceAgent,
    private readonly operationsAgent: OperationsAgent,
  ) {}

  onModuleInit() {
    // Register all 11 specialized agents
    const allAgents: BaseAgent[] = [
      this.dispatcherAgent,
      this.fleetAgent,
      this.integrationAgent,
      this.warehouseAgent,
      this.financeAgent,
      this.complianceAgent,
      this.supportAgent,
      this.developerAgent,
      this.analyticsAgent,
      this.marketplaceAgent,
      this.operationsAgent,
    ];

    for (const agent of allAgents) {
      this.registerAgent(agent);
    }
    this.logger.log(
      `Agent Orchestrator initialized with ${this.agents.size} agents: [${Array.from(this.agents.keys()).join(', ')}]`,
    );
  }

  registerAgent(agent: BaseAgent) {
    this.agents.set(agent.agentName, agent);
    this.logger.log(`Registered agent: ${agent.agentName}`);
  }

  /**
   * Routes an intent to the most appropriate specialized agent.
   * Applies full governance pipeline: PII redaction → injection protection → routing → execution → output validation → audit.
   */
  async routeIntent(
    companyId: string,
    intent: string,
    domainEntity: string,
    entityId: string,
    userId?: string,
  ): Promise<{ response: string; agentName: string; citations?: any[] }> {
    this.logger.log(
      `Routing intent [${domainEntity}]: "${intent.substring(0, 80)}"`,
    );

    // 1. PII redaction
    const { redacted: redactedIntent } = this.governance.redactPii(intent);

    // 2. Prompt injection protection
    const safeIntent = this.governance.sanitizeInput(redactedIntent);

    // 3. Build entity context
    const context = await this.contextEngine.buildAiContext(
      companyId,
      domainEntity,
      entityId,
    );

    // 4. Retrieve conversation memory for continuity
    const conversationContext = entityId
      ? await this.memory.getConversationContext(entityId)
      : '';

    // 5. Retrieve workspace memory for org-level preferences
    const workspaceContext = await this.memory.getWorkspaceContext(companyId);

    // 6. RAG context from Knowledge Base (tenant-isolated)
    let ragContext = '';
    let citations: any[] = [];
    try {
      const ragResult = await this.rag.retrieveContext(safeIntent, {
        companyId,
        limit: 3,
      });
      ragContext = ragResult.context;
      citations = ragResult.citations;
    } catch {
      // RAG failure is non-blocking
    }

    // 7. Intelligent agent routing — LLM selects best agent based on intent
    const agentNames = Array.from(this.agents.keys()).join(', ');
    const routingPrompt = `You are an Agent Router for PariLink enterprise platform.
Available Agents: ${agentNames}
User Intent: ${safeIntent}
Domain Entity: ${domainEntity}

Select the SINGLE best agent name from the available agents list. 
Respond ONLY with the exact agent name, nothing else.`;

    let agentName: string;
    try {
      const routingResponse = await this.llmManager.generateResponse(
        routingPrompt,
        safeIntent,
      );
      agentName = routingResponse.trim().split('\n')[0].trim();
    } catch {
      // Fallback based on domain entity keyword matching
      agentName = this.keywordRoute(domainEntity, safeIntent);
    }

    // Validate the routed agent exists
    if (!this.agents.has(agentName)) {
      this.logger.warn(
        `Agent "${agentName}" not found — using keyword routing fallback`,
      );
      agentName = this.keywordRoute(domainEntity, safeIntent);
    }

    const agent = this.agents.get(agentName)!;

    // 8. Build enriched context for the agent
    const enrichedContext = {
      ...(typeof context === 'object' && context !== null ? context : {}),
      knowledgeBase: ragContext,
      conversationHistory: conversationContext,
      workspacePreferences: workspaceContext,
    };

    // 9. Execute via selected agent
    const response = await agent.process(safeIntent, enrichedContext);

    // 10. Output validation
    const { valid, violations } = this.governance.validateOutput(response);
    let finalResponse = response;
    if (!valid) {
      this.logger.warn(
        `Output policy violations: ${violations.map((v) => v.label).join(', ')}`,
      );
      finalResponse = `[Output filtered by AI Governance policy. Please rephrase your request.]`;
    }

    // 11. Audit log the interaction
    try {
      const agentRecord = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.aiAgent.findFirst(),
      );
      if (agentRecord) {
        await this.prisma.runAsTenant(companyId, async (tx) =>
          tx.aiInteractionLog.create({
            data: {
              agentId: agentRecord.id,
              prompt: safeIntent,
              response: finalResponse,
              userId,
              companyId,
              sessionId: entityId,
            },
          }),
        );
      }
    } catch {
      // Non-blocking
    }

    return { response: finalResponse, agentName, citations };
  }

  /**
   * Keyword-based fallback routing when LLM routing fails.
   */
  private keywordRoute(domain: string, intent: string): string {
    const combined = `${domain} ${intent}`.toLowerCase();
    if (combined.match(/warehouse|inventory|dock|pick|put.?away|scan/))
      return 'WarehouseAgent';
    if (combined.match(/invoice|billing|payment|factoring|revenue|p&l|cost/))
      return 'FinanceAgent';
    if (
      combined.match(/compliance|hos|hours.of.service|dot|fmcsa|inspection|reg/)
    )
      return 'ComplianceAgent';
    if (combined.match(/support|ticket|help|issue|problem|escalat/))
      return 'SupportAgent';
    if (combined.match(/developer|api|sdk|code|endpoint|webhook|plugin/))
      return 'DeveloperAgent';
    if (combined.match(/analytic|trend|kpi|metric|report|insight/))
      return 'AnalyticsAgent';
    if (combined.match(/marketplace|app|install|integration/))
      return 'MarketplaceAgent';
    if (combined.match(/fleet|vehicle|truck|trailer|maintenance/))
      return 'FleetManagerAgent';
    if (combined.match(/dispatch|load|route|driver|assign|trip/))
      return 'DispatcherAgent';
    if (combined.match(/operation|exception|delay|approval|health/))
      return 'OperationsAgent';
    return 'DispatcherAgent'; // Ultimate fallback
  }

  /**
   * List all registered agents with their capabilities
   */
  getAgentRegistry(): Array<{
    name: string;
    description: string;
    toolCount: number;
  }> {
    return Array.from(this.agents.values()).map((a) => ({
      name: a.agentName,
      description: a.roleDescription,
      toolCount: a.tools.length,
    }));
  }
}
