"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AiModule = void 0;
var common_1 = require("@nestjs/common");
var knowledge_graph_service_1 = require("./knowledge/knowledge-graph.service");
var context_engine_service_1 = require("./context/context-engine.service");
var mock_ai_provider_1 = require("./providers/mock-ai.provider");
var recommendation_service_1 = require("./recommendation/recommendation.service");
var prediction_service_1 = require("./prediction/prediction.service");
var anomaly_service_1 = require("./anomaly/anomaly.service");
var rag_service_1 = require("./rag/rag.service");
var embedding_pipeline_service_1 = require("./rag/embedding-pipeline.service");
var agent_orchestrator_service_1 = require("./agents/agent-orchestrator.service");
var governance_service_1 = require("./governance/governance.service");
var observability_service_1 = require("./observability/observability.service");
var ai_controller_1 = require("./ai.controller");
var copilot_service_1 = require("./copilot/copilot.service");
var copilot_observability_service_1 = require("./copilot/copilot-observability.service");
var executive_briefing_service_1 = require("./copilot/executive-briefing.service");
var copilot_recommendation_engine_1 = require("./copilot/copilot-recommendation.engine");
var copilot_chat_service_1 = require("./copilot/copilot-chat.service");
var sql_generator_service_1 = require("./copilot/sql-generator.service");
var workflow_generator_service_1 = require("./workflow-generator.service");
var llm_manager_service_1 = require("./platform/llm-manager.service");
var model_router_service_1 = require("./platform/model-router.service");
var ai_cache_service_1 = require("./platform/ai-cache.service");
var prompt_protection_service_1 = require("./platform/prompt-protection.service");
// ─── Specialized Agents ─────────────────────────────────────────────────────
var dispatcher_agent_1 = require("./agents/specialized/dispatcher.agent");
var prompt_guard_service_1 = require("./security/prompt-guard.service");
var fleet_manager_agent_1 = require("./agents/specialized/fleet-manager.agent");
var integration_agent_1 = require("./agents/specialized/integration.agent");
var warehouse_agent_1 = require("./agents/specialized/warehouse.agent");
var finance_agent_1 = require("./agents/specialized/finance.agent");
var compliance_agent_1 = require("./agents/specialized/compliance.agent");
var support_agent_1 = require("./agents/specialized/support.agent");
var developer_agent_1 = require("./agents/specialized/developer.agent");
var analytics_agent_1 = require("./agents/specialized/analytics.agent");
var marketplace_agent_1 = require("./agents/specialized/marketplace.agent");
var operations_agent_1 = require("./agents/specialized/operations.agent");
var shipment_delay_agent_1 = require("./agents/specialized/shipment-delay.agent");
var fleet_health_agent_1 = require("./agents/specialized/fleet-health.agent");
var driver_safety_agent_1 = require("./agents/specialized/driver-safety.agent");
var fuel_optimization_agent_1 = require("./agents/specialized/fuel-optimization.agent");
var maintenance_prediction_agent_1 = require("./agents/specialized/maintenance-prediction.agent");
var capacity_planning_agent_1 = require("./agents/specialized/capacity-planning.agent");
var customer_sla_risk_agent_1 = require("./agents/specialized/customer-sla-risk.agent");
var revenue_leakage_agent_1 = require("./agents/specialized/revenue-leakage.agent");
var exception_management_agent_1 = require("./agents/specialized/exception-management.agent");
// ─── New V37 Services ───────────────────────────────────────────────────────
var memory_service_1 = require("./memory/memory.service");
var workflow_execution_service_1 = require("./workflow/workflow-execution.service");
// ─── Platform Modules ────────────────────────────────────────────────────────
var platform_module_1 = require("../platform/platform.module");
var ALL_AGENTS = [
    dispatcher_agent_1.DispatcherAgent,
    fleet_manager_agent_1.FleetManagerAgent,
    integration_agent_1.IntegrationAgent,
    warehouse_agent_1.WarehouseAgent,
    finance_agent_1.FinanceAgent,
    compliance_agent_1.ComplianceAgent,
    support_agent_1.SupportAgent,
    developer_agent_1.DeveloperAgent,
    analytics_agent_1.AnalyticsAgent,
    marketplace_agent_1.MarketplaceAgent,
    operations_agent_1.OperationsAgent,
    shipment_delay_agent_1.ShipmentDelayAgent,
    fleet_health_agent_1.FleetHealthAgent,
    driver_safety_agent_1.DriverSafetyAgent,
    fuel_optimization_agent_1.FuelOptimizationAgent,
    maintenance_prediction_agent_1.MaintenancePredictionAgent,
    capacity_planning_agent_1.CapacityPlanningAgent,
    customer_sla_risk_agent_1.CustomerSlaRiskAgent,
    revenue_leakage_agent_1.RevenueLeakageAgent,
    exception_management_agent_1.ExceptionManagementAgent,
];
var AiModule = function () {
    var _classDecorators = [(0, common_1.Module)({
            imports: [platform_module_1.PlatformModule],
            controllers: [ai_controller_1.AiController],
            providers: __spreadArray(__spreadArray([
                // ─── Platform ───────────────────────────────────────────────
                llm_manager_service_1.LlmManagerService,
                model_router_service_1.ModelRouterService,
                ai_cache_service_1.AiCacheService,
                prompt_protection_service_1.PromptProtectionService,
                prompt_guard_service_1.PromptGuardService,
                mock_ai_provider_1.MockAIProvider,
                // ─── Knowledge ──────────────────────────────────────────────
                knowledge_graph_service_1.KnowledgeGraphService,
                context_engine_service_1.ContextEngineService,
                rag_service_1.EnterpriseRagService,
                embedding_pipeline_service_1.EmbeddingPipelineService,
                // ─── Memory ─────────────────────────────────────────────────
                memory_service_1.EnterpriseMemoryService,
                // ─── Governance & Observability ──────────────────────────────
                governance_service_1.AiGovernanceService,
                observability_service_1.AiObservabilityService,
                // ─── Intelligence Engines ───────────────────────────────────
                recommendation_service_1.RecommendationEngineService,
                prediction_service_1.PredictionEngineService,
                anomaly_service_1.AnomalyDetectionService,
                // ─── Copilot ────────────────────────────────────────────────
                copilot_service_1.CopilotService,
                copilot_observability_service_1.CopilotObservabilityService,
                executive_briefing_service_1.ExecutiveBriefingService,
                copilot_recommendation_engine_1.CopilotRecommendationEngine,
                copilot_chat_service_1.AiCopilotChatService,
                sql_generator_service_1.SqlGeneratorService
            ], ALL_AGENTS, true), [
                agent_orchestrator_service_1.AgentOrchestratorService,
                // ─── Workflows ──────────────────────────────────────────────
                workflow_generator_service_1.WorkflowGeneratorService,
                workflow_execution_service_1.WorkflowExecutionService,
            ], false),
            exports: [
                // Core services used by other modules
                llm_manager_service_1.LlmManagerService,
                model_router_service_1.ModelRouterService,
                ai_cache_service_1.AiCacheService,
                prompt_protection_service_1.PromptProtectionService,
                knowledge_graph_service_1.KnowledgeGraphService,
                context_engine_service_1.ContextEngineService,
                rag_service_1.EnterpriseRagService,
                embedding_pipeline_service_1.EmbeddingPipelineService,
                memory_service_1.EnterpriseMemoryService,
                governance_service_1.AiGovernanceService,
                observability_service_1.AiObservabilityService,
                recommendation_service_1.RecommendationEngineService,
                prediction_service_1.PredictionEngineService,
                anomaly_service_1.AnomalyDetectionService,
                copilot_service_1.CopilotService,
                copilot_observability_service_1.CopilotObservabilityService,
                executive_briefing_service_1.ExecutiveBriefingService,
                copilot_recommendation_engine_1.CopilotRecommendationEngine,
                copilot_chat_service_1.AiCopilotChatService,
                sql_generator_service_1.SqlGeneratorService,
                agent_orchestrator_service_1.AgentOrchestratorService,
                workflow_generator_service_1.WorkflowGeneratorService,
                workflow_execution_service_1.WorkflowExecutionService,
            ],
        })];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var AiModule = _classThis = /** @class */ (function () {
        function AiModule_1() {
        }
        return AiModule_1;
    }());
    __setFunctionName(_classThis, "AiModule");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        AiModule = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return AiModule = _classThis;
}();
exports.AiModule = AiModule;
