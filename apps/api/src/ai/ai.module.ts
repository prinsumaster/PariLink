import { Module, forwardRef } from '@nestjs/common';
import { KnowledgeGraphService } from './knowledge/knowledge-graph.service';
import { ContextEngineService } from './context/context-engine.service';
import { MockAIProvider } from './providers/mock-ai.provider';
import { RecommendationEngineService } from './recommendation/recommendation.service';
import { PredictionEngineService } from './prediction/prediction.service';
import { AnomalyDetectionService } from './anomaly/anomaly.service';
import { EnterpriseRagService } from './rag/rag.service';
import { EmbeddingPipelineService } from './rag/embedding-pipeline.service';
import { AgentOrchestratorService } from './agents/agent-orchestrator.service';
import { AiGovernanceService } from './governance/governance.service';
import { AiObservabilityService } from './observability/observability.service';
import { AiController } from './ai.controller';
import { CopilotService } from './copilot/copilot.service';
import { CopilotObservabilityService } from './copilot/copilot-observability.service';
import { ExecutiveBriefingService } from './copilot/executive-briefing.service';
import { CopilotRecommendationEngine } from './copilot/copilot-recommendation.engine';
import { AiCopilotChatService } from './copilot/copilot-chat.service';
import { SqlGeneratorService } from './copilot/sql-generator.service';
import { WorkflowGeneratorService } from './workflow-generator.service';
import { LlmManagerService } from './platform/llm-manager.service';
import { ModelRouterService } from './platform/model-router.service';
import { AiCacheService } from './platform/ai-cache.service';
import { PromptProtectionService } from './platform/prompt-protection.service';
// ─── Specialized Agents ─────────────────────────────────────────────────────
import { DispatcherAgent } from './agents/specialized/dispatcher.agent';
import { PromptGuardService } from './security/prompt-guard.service';
import { FleetManagerAgent } from './agents/specialized/fleet-manager.agent';
import { IntegrationAgent } from './agents/specialized/integration.agent';
import { WarehouseAgent } from './agents/specialized/warehouse.agent';
import { FinanceAgent } from './agents/specialized/finance.agent';
import { ComplianceAgent } from './agents/specialized/compliance.agent';
import { SupportAgent } from './agents/specialized/support.agent';
import { DeveloperAgent } from './agents/specialized/developer.agent';
import { AnalyticsAgent } from './agents/specialized/analytics.agent';
import { MarketplaceAgent } from './agents/specialized/marketplace.agent';
import { OperationsAgent } from './agents/specialized/operations.agent';
import { ShipmentDelayAgent } from './agents/specialized/shipment-delay.agent';
import { FleetHealthAgent } from './agents/specialized/fleet-health.agent';
import { DriverSafetyAgent } from './agents/specialized/driver-safety.agent';
import { FuelOptimizationAgent } from './agents/specialized/fuel-optimization.agent';
import { MaintenancePredictionAgent } from './agents/specialized/maintenance-prediction.agent';
import { CapacityPlanningAgent } from './agents/specialized/capacity-planning.agent';
import { CustomerSlaRiskAgent } from './agents/specialized/customer-sla-risk.agent';
import { RevenueLeakageAgent } from './agents/specialized/revenue-leakage.agent';
import { ExceptionManagementAgent } from './agents/specialized/exception-management.agent';
// ─── New V37 Services ───────────────────────────────────────────────────────
import { EnterpriseMemoryService } from './memory/memory.service';
import { WorkflowExecutionService } from './workflow/workflow-execution.service';
// ─── Platform Modules ────────────────────────────────────────────────────────
import { PlatformModule } from '../platform/platform.module';

const ALL_AGENTS = [
  DispatcherAgent,
  FleetManagerAgent,
  IntegrationAgent,
  WarehouseAgent,
  FinanceAgent,
  ComplianceAgent,
  SupportAgent,
  DeveloperAgent,
  AnalyticsAgent,
  MarketplaceAgent,
  OperationsAgent,
  ShipmentDelayAgent,
  FleetHealthAgent,
  DriverSafetyAgent,
  FuelOptimizationAgent,
  MaintenancePredictionAgent,
  CapacityPlanningAgent,
  CustomerSlaRiskAgent,
  RevenueLeakageAgent,
  ExceptionManagementAgent,
];

@Module({
  imports: [PlatformModule],
  controllers: [AiController],
  providers: [
    // ─── Platform ───────────────────────────────────────────────
    LlmManagerService,
    ModelRouterService,
    AiCacheService,
    PromptProtectionService,
    PromptGuardService,
    MockAIProvider,
    // ─── Knowledge ──────────────────────────────────────────────
    KnowledgeGraphService,
    ContextEngineService,
    EnterpriseRagService,
    EmbeddingPipelineService,
    // ─── Memory ─────────────────────────────────────────────────
    EnterpriseMemoryService,
    // ─── Governance & Observability ──────────────────────────────
    AiGovernanceService,
    AiObservabilityService,
    // ─── Intelligence Engines ───────────────────────────────────
    RecommendationEngineService,
    PredictionEngineService,
    AnomalyDetectionService,
    // ─── Copilot ────────────────────────────────────────────────
    CopilotService,
    CopilotObservabilityService,
    ExecutiveBriefingService,
    CopilotRecommendationEngine,
    AiCopilotChatService,
    SqlGeneratorService,
    // ─── Agents ─────────────────────────────────────────────────
    ...ALL_AGENTS,
    AgentOrchestratorService,
    // ─── Workflows ──────────────────────────────────────────────
    WorkflowGeneratorService,
    WorkflowExecutionService,
  ],
  exports: [
    // Core services used by other modules
    LlmManagerService,
    ModelRouterService,
    AiCacheService,
    PromptProtectionService,
    KnowledgeGraphService,
    ContextEngineService,
    EnterpriseRagService,
    EmbeddingPipelineService,
    EnterpriseMemoryService,
    AiGovernanceService,
    AiObservabilityService,
    RecommendationEngineService,
    PredictionEngineService,
    AnomalyDetectionService,
    CopilotService,
    CopilotObservabilityService,
    ExecutiveBriefingService,
    CopilotRecommendationEngine,
    AiCopilotChatService,
    SqlGeneratorService,
    AgentOrchestratorService,
    WorkflowGeneratorService,
    WorkflowExecutionService,
  ],
})
export class AiModule {}
