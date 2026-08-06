import {
  InternalServerErrorException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { LlmManagerService } from '../platform/llm-manager.service';

export interface IAIProvider {
  chat(prompt: string, context: string): Promise<string>;
  structuredGenerate<T>(
    prompt: string,
    context: string,
    schema: any,
  ): Promise<T>;
}

/**
 * Mock Provider for V1 to ensure we don't block on real LLM credentials.
 * It simulates an AI analyzing the context and returning structured JSON.
 */
@Injectable()
export class MockAIProvider implements IAIProvider {
  private readonly logger = new Logger(MockAIProvider.name);

  constructor(private readonly llmManager: LlmManagerService) {}

  async chat(prompt: string, context: string): Promise<string> {
    this.logger.debug(`Calling AI Chat Generation...`);
    return this.llmManager.generateResponse(
      'You are an AI assistant.',
      prompt,
      { context },
    );
  }

  async structuredGenerate<T>(
    prompt: string,
    context: string,
    schema: any,
  ): Promise<T> {
    this.logger.debug(`Calling Structured AI Generation...`);

    const schemaStr = JSON.stringify(schema);
    const systemPrompt = `You must return ONLY a raw JSON object (no markdown, no backticks) that matches this schema: ${schemaStr}`;

    const responseText = await this.llmManager.generateResponse(
      systemPrompt,
      prompt,
      { context },
    );

    try {
      // Strip markdown code block if the LLM adds it
      const cleanedText = responseText
        .replace(/^```json\\n/, '')
        .replace(/\\n```$/, '');
      const parsed = JSON.parse(cleanedText);
      return parsed as T;
    } catch (e) {
      this.logger.error(
        `Failed to parse structured AI output: ${e.message}`,
        responseText,
      );
      throw new InternalServerErrorException(
        'AI returned malformed structured data',
      );
    }
  }
}
