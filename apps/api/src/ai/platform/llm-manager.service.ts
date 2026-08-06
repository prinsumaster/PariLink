import { Injectable, Logger } from '@nestjs/common';
import { ModelRouterService } from './model-router.service';
import {
  BaseMessage,
  HumanMessage,
  SystemMessage,
} from '@langchain/core/messages';
import { AiObservabilityService } from '../observability/observability.service';
import { AiGovernanceService } from '../governance/governance.service';

// Prompt template registry
const PROMPT_TEMPLATES: Record<string, string> = {
  logistics_analyst: `You are an expert logistics analyst for PariLink, an enterprise freight and logistics platform.
You have deep knowledge of supply chains, freight operations, dispatch, fleet management, and warehouse operations.
Always be concise, data-driven, and actionable in your responses.`,

  support_agent: `You are a helpful support agent for PariLink.
You assist users with platform questions, troubleshooting, and operational guidance.
Be empathetic, clear, and guide users to solutions efficiently.`,

  compliance_officer: `You are a compliance officer AI for PariLink.
You evaluate operations against regulatory requirements (FMCSA, DOT, HOS, IFTA).
Always cite regulations clearly and flag risks explicitly.`,

  developer: `You are an expert developer assistant for the PariLink platform.
You know the TypeScript/NestJS backend, Next.js frontend, Prisma schema, and all platform APIs.
Provide accurate, typed code examples and architectural guidance.`,

  finance: `You are a financial analysis AI for PariLink logistics operations.
You analyze invoices, factoring, P&L, and cost center performance.
Always provide numerical accuracy and flag anomalies.`,

  default: `You are PariLink Copilot, an enterprise AI assistant for logistics and operations.
You help dispatchers, drivers, warehouse operators, finance teams, and administrators.
Be precise, professional, and action-oriented.`,
};

@Injectable()
export class LlmManagerService {
  private readonly logger = new Logger(LlmManagerService.name);

  constructor(
    private readonly modelRouter: ModelRouterService,
    private readonly observabilityService: AiObservabilityService,
    private readonly governance: AiGovernanceService,
  ) {}

  /**
   * Standard text generation — awaits full response
   */
  async generateResponse(
    systemPrompt: string,
    userQuery: string,
    context: any = {},
    preferredProvider?: string,
    templateKey?: string,
  ): Promise<string> {
    const startTime = Date.now();
    const resolvedSystem = templateKey
      ? (PROMPT_TEMPLATES[templateKey] || PROMPT_TEMPLATES.default) +
        '\n\n' +
        systemPrompt
      : systemPrompt;

    // Security: Sanitize input for Prompt Injection
    const sanitizedQuery = this.governance.sanitizeInput(userQuery);

    try {
      const model = await this.modelRouter.getBestModel(preferredProvider);
      const entry = this.modelRouter.getModelEntry(preferredProvider);

      const messages: BaseMessage[] = [
        new SystemMessage(
          resolvedSystem +
            (Object.keys(context).length
              ? `\n\nContext:\n${JSON.stringify(context, null, 2)}`
              : ''),
        ),
        new HumanMessage(sanitizedQuery),
      ];

      const response = await model.invoke(messages);
      const duration = Date.now() - startTime;

      const responseText =
        typeof response.content === 'string'
          ? response.content
          : JSON.stringify(response.content);

      // Security: Validate output
      const validation = this.governance.validateOutput(responseText);
      if (!validation.valid) {
        this.logger.warn('LLM generated output violating policies.');
      }

      // Estimate cost from token approximation (chars / 4 ≈ tokens)
      const approxInputTokens = Math.ceil(
        messages
          .map((m) =>
            typeof m.content === 'string'
              ? m.content.length
              : JSON.stringify(m.content).length,
          )
          .reduce((a, b) => a + b, 0) / 4,
      );
      const approxOutputTokens = Math.ceil(responseText.length / 4);
      const inputCost = entry
        ? (approxInputTokens / 1000) * entry.costPerInputToken
        : 0;
      const outputCost = entry
        ? (approxOutputTokens / 1000) * entry.costPerOutputToken
        : 0;

      await this.observabilityService.logMetrics({
        modelProvider: entry?.provider || 'Fallback',
        latencyMs: duration,
        promptTokens: approxInputTokens,
        completionTokens: approxOutputTokens,
        cost: inputCost + outputCost,
        success: true,
      });

      return validation.valid
        ? responseText
        : 'Output blocked by Security Policy.';
    } catch (error: any) {
      const duration = Date.now() - startTime;
      await this.observabilityService.logMetrics({
        modelProvider: preferredProvider || 'Fallback',
        latencyMs: duration,
        promptTokens: 0,
        completionTokens: 0,
        cost: 0,
        success: false,
      });
      this.logger.error(`LLM Generation Failed: ${error.message}`);
      throw error;
    }
  }

  /**
   * Streaming generation — yields text chunks as they arrive
   */
  async *generateStreamResponse(
    systemPrompt: string,
    userQuery: string,
    context: any = {},
    preferredProvider?: string,
  ): AsyncIterable<string> {
    const model = await this.modelRouter.getBestModel(preferredProvider);

    const messages: BaseMessage[] = [
      new SystemMessage(
        systemPrompt +
          (Object.keys(context).length
            ? `\n\nContext:\n${JSON.stringify(context, null, 2)}`
            : ''),
      ),
      new HumanMessage(userQuery),
    ];

    const stream = await model.stream(messages);

    for await (const chunk of stream) {
      const text =
        typeof chunk.content === 'string'
          ? chunk.content
          : JSON.stringify(chunk.content);
      if (text) yield text;
    }
  }

  /**
   * Returns all registered prompt templates
   */
  getPromptTemplates(): Record<string, string> {
    return { ...PROMPT_TEMPLATES };
  }

  /**
   * Returns the model registry summary
   */
  getModelRegistry() {
    return this.modelRouter.getModelRegistry();
  }

  /**
   * Retrieves the raw BaseChatModel instance (for Agent Executors)
   */
  async getModel(preferredProvider?: string) {
    return this.modelRouter.getBestModel(preferredProvider);
  }
}
