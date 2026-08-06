import { Logger } from '@nestjs/common';
import { LlmManagerService } from '../platform/llm-manager.service';
import { DynamicTool, DynamicStructuredTool } from '@langchain/core/tools';

export abstract class BaseAgent {
  abstract readonly agentName: string;
  abstract readonly roleDescription: string;
  abstract readonly tools: (DynamicTool | DynamicStructuredTool)[];

  protected readonly logger = new Logger(BaseAgent.name);

  constructor(protected readonly llmManager: LlmManagerService) {}

  /**
   * Processes a structured message or user query with Tool Support (Phase 5)
   */
  async process(message: string, context: any = {}): Promise<string> {
    this.logger.log(`[${this.agentName}] Processing Message`);

    // Inject tool descriptions into prompt
    const toolDescriptions = this.tools
      .map((t) => `- ${t.name}: ${t.description}`)
      .join('\n');

    const systemPrompt = `
      Role: ${this.roleDescription}
      You are an autonomous enterprise AI agent in PariLink.
      
      Available Tools (Phase 5):
      ${toolDescriptions || 'No tools available for this agent.'}
      
      If you need to use a tool, format your response as:
      [TOOL_CALL: tool_name, {"arg": "value"}]
    `;

    const initialResponse = await this.llmManager.generateResponse(
      systemPrompt,
      message,
      context,
    );

    // Naive Tool Execution loop for MVP (Phase 6 Automation)
    if (initialResponse.includes('[TOOL_CALL:')) {
      const match = initialResponse.match(/\[TOOL_CALL:\s*([^,]+),\s*(.+?)\]/);
      if (match) {
        const toolName = match[1].trim();
        const toolInput = match[2].trim();
        this.logger.log(`[${this.agentName}] Executing Tool: ${toolName}`);

        const tool = this.tools.find((t) => t.name === toolName);
        if (tool) {
          try {
            const result = await (tool as any).invoke(JSON.parse(toolInput));
            // Send result back to LLM for final answer
            return this.llmManager.generateResponse(
              systemPrompt,
              `Tool ${toolName} returned: ${result}\nProvide final answer.`,
            );
          } catch (e) {
            const errorMessage = e instanceof Error ? e.message : String(e);
            this.logger.error(`Tool execution failed: ${errorMessage}`);
          }
        }
      }
    }

    return initialResponse;
  }
}
