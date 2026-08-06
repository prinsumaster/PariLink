// Skipping strict type checking for LLM interfaces
import {
  ServiceUnavailableException,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { ChatOpenAI, AzureChatOpenAI } from '@langchain/openai';
import { ChatAnthropic } from '@langchain/anthropic';
import {
  BaseChatModel,
  SimpleChatModel,
} from '@langchain/core/language_models/chat_models';
import { BaseMessage } from '@langchain/core/messages';

class MockChatModel extends SimpleChatModel {
  constructor() {
    super({});
  }

  _llmType() {
    return 'mock-chat-model';
  }

  async _call(messages: BaseMessage[]): Promise<string> {
    const text = messages
      .map((m) =>
        typeof m.content === 'string' ? m.content : JSON.stringify(m.content),
      )
      .join(' ');
    if (text.includes('ping')) return 'pong';
    return `[Mock AI Response] Simulated response for testing without API keys. You said: "${text.substring(0, 50)}..."`;
  }
}

// Provider enum matching Prisma schema
export type AiProvider =
  | 'OPENAI'
  | 'ANTHROPIC'
  | 'GEMINI'
  | 'OLLAMA'
  | 'AZURE_OPENAI'
  | 'BEDROCK'
  | 'MOCK';

interface ModelEntry {
  model: BaseChatModel;
  provider: AiProvider;
  modelName: string;
  priority: number;
  costPerInputToken: number;
  costPerOutputToken: number;
}

@Injectable()
export class ModelRouterService implements OnModuleInit {
  private readonly logger = new Logger(ModelRouterService.name);

  // Ordered by priority (highest first)
  private activeModels: ModelEntry[] = [];

  // Pricing table (USD per 1K tokens) — updated manually or via config
  private static readonly PRICING: Record<
    string,
    { input: number; output: number }
  > = {
    'gpt-4o': { input: 0.005, output: 0.015 },
    'gpt-4o-mini': { input: 0.00015, output: 0.0006 },
    'gpt-3.5-turbo': { input: 0.0005, output: 0.0015 },
    'claude-3-5-sonnet-20241022': { input: 0.003, output: 0.015 },
    'claude-3-haiku-20240307': { input: 0.00025, output: 0.00125 },
    'gemini-1.5-pro': { input: 0.00125, output: 0.005 },
    'gemini-1.5-flash': { input: 0.000075, output: 0.0003 },
    default: { input: 0.001, output: 0.002 },
  };

  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.refreshModels();
  }

  async refreshModels() {
    this.activeModels = [];

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let configs: any[] = [];
    try {
      configs = await this.prisma.runAsSystem(async (tx) =>
        tx.aiModelConfig.findMany({
          where: { isActive: true },
          orderBy: { priority: 'desc' },
        }),
      );
    } catch {
      this.logger.warn(
        'Could not load AI model configs from DB — using fallback mock model.',
      );
    }

    for (const config of configs) {
      try {
        const details = config.config || {};
        let model: BaseChatModel | null = null;

        switch (config.provider as AiProvider) {
          case 'OPENAI':
            model = new ChatOpenAI({
              modelName: config.modelName,
              apiKey: details.apiKey || process.env.OPENAI_API_KEY,
              temperature: details.temperature ?? 0,
              maxTokens: details.maxTokens,
              streaming: false,
            });
            break;

          case 'ANTHROPIC':
            model = new ChatAnthropic({
              modelName: config.modelName,
              apiKey: details.apiKey || process.env.ANTHROPIC_API_KEY,
              temperature: details.temperature ?? 0,
              maxTokens: details.maxTokens,
            }) as any;
            break;

          case 'GEMINI':
            // Dynamic import to avoid crashing if package not installed
            try {
              const { ChatGoogleGenerativeAI } =
                await import('@langchain/google-genai');
              model = new ChatGoogleGenerativeAI({
                model: config.modelName,
                apiKey: details.apiKey || process.env.GOOGLE_AI_API_KEY,
                temperature: details.temperature ?? 0,
                maxOutputTokens: details.maxTokens,
              } as any);
            } catch {
              this.logger.warn(
                'Gemini provider: @langchain/google-genai not installed. Skipping.',
              );
            }
            break;

          case 'OLLAMA':
            try {
              // @ts-expect-error - Dynamic import for optional provider
              const { ChatOllama } = await import('@langchain/ollama');
              model = new ChatOllama({
                model: config.modelName,
                baseUrl:
                  details.baseUrl ||
                  process.env.OLLAMA_BASE_URL ||
                  'http://localhost:11434',
                temperature: details.temperature ?? 0,
              });
            } catch {
              this.logger.warn(
                'Ollama provider: @langchain/ollama not installed. Skipping.',
              );
            }
            break;

          case 'AZURE_OPENAI':
            model = new AzureChatOpenAI({
              azureOpenAIApiKey:
                details.apiKey || process.env.AZURE_OPENAI_API_KEY,
              azureOpenAIApiInstanceName:
                details.instanceName ||
                process.env.AZURE_OPENAI_INSTANCE_NAME ||
                'parilink',
              azureOpenAIApiDeploymentName:
                details.deploymentName || config.modelName,
              azureOpenAIApiVersion: details.apiVersion || '2024-02-01',
              temperature: details.temperature ?? 0,
              maxTokens: details.maxTokens,
            });
            break;

          default:
            this.logger.warn(`Unknown provider: ${config.provider}. Skipping.`);
        }

        if (model) {
          const pricing =
            ModelRouterService.PRICING[config.modelName] ||
            ModelRouterService.PRICING.default;
          this.activeModels.push({
            model,
            provider: config.provider as AiProvider,
            modelName: config.modelName,
            priority: config.priority,
            costPerInputToken: pricing.input,
            costPerOutputToken: pricing.output,
          });
          this.logger.log(
            `Registered model: ${config.provider}/${config.modelName} (priority=${config.priority})`,
          );
        }
      } catch (error: unknown) {
        this.logger.error(
          `Failed to initialize model ${config.provider}: ${(error as Error).message}`,
        );
      }
    }

    if (this.activeModels.length === 0) {
      this.logger.warn(
        'No active AI models found in DB or environment. Injecting Mock Chat Model fallback.',
      );
      this.activeModels.push({
        model: new MockChatModel(),
        provider: 'MOCK',
        modelName: 'mock-chat-model',
        priority: -1,
        costPerInputToken: 0,
        costPerOutputToken: 0,
      });
    }

    this.logger.log(`Active AI models: ${this.activeModels.length}`);
  }

  /**
   * Returns the highest-priority healthy model, with automatic failover.
   * If preferredProvider is given, tries that first before falling back.
   */
  async getBestModel(preferredProvider?: string): Promise<BaseChatModel> {
    if (this.activeModels.length === 0) {
      this.logger.error(
        'No active AI models configured or credentials missing',
      );
      throw new ServiceUnavailableException(
        'AI platform is not configured. Please add an AI provider API key.',
      );
    }

    if (preferredProvider) {
      const preferred = this.activeModels.find(
        (m) => m.provider === preferredProvider,
      );
      if (preferred) return preferred.model;
    }

    // Primary model with failover cascade
    for (const entry of this.activeModels) {
      const healthy = await this.isModelHealthy(entry);
      if (healthy) return entry.model;
      this.logger.warn(
        `Model ${entry.provider}/${entry.modelName} failed health check — trying next`,
      );
    }

    // All models unhealthy — return first anyway (last resort)
    return this.activeModels[0].model;
  }

  /**
   * Get pricing info for a given model entry (used by LlmManager for cost estimation)
   */
  getModelEntry(preferredProvider?: string): ModelEntry | null {
    if (this.activeModels.length === 0) return null;
    if (preferredProvider) {
      return (
        this.activeModels.find((m) => m.provider === preferredProvider) || null
      );
    }
    return this.activeModels[0];
  }

  /**
   * Health check: invoke with a tiny prompt to verify the model is responsive.
   * Returns true if healthy, false on error or timeout.
   */
  private async isModelHealthy(entry: ModelEntry): Promise<boolean> {
    try {
      const { HumanMessage } = await import('@langchain/core/messages');
      const timeoutPromise = new Promise<null>((_, reject) =>
        setTimeout(() => reject(new Error('Health check timeout')), 3000),
      );
      const pingPromise = entry.model.invoke([new HumanMessage('ping')]);
      await Promise.race([pingPromise, timeoutPromise]);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Returns a summary of all registered models and their status
   */
  getModelRegistry() {
    return this.activeModels.map((m) => ({
      provider: m.provider,
      modelName: m.modelName,
      priority: m.priority,
      costPerInputTokenUsd: m.costPerInputToken,
      costPerOutputTokenUsd: m.costPerOutputToken,
    }));
  }
}
