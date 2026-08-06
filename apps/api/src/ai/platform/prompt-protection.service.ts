import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptProtectionService {
  private readonly logger = new Logger(PromptProtectionService.name);

  // Simple hardcoded checks for V1 Enterprise Security
  private readonly BANNED_KEYWORDS = [
    'ignore previous instructions',
    'system prompt',
    'developer mode',
    'drop table',
    'delete all',
  ];

  async sanitizeInput(input: string): Promise<string> {
    const lowerInput = input.toLowerCase();

    // 1. RBAC & Prompt Injection Defense
    for (const keyword of this.BANNED_KEYWORDS) {
      if (lowerInput.includes(keyword)) {
        this.logger.warn(`Prompt Injection Attempt Detected: ${keyword}`);
        throw new Error(
          'SECURITY_VIOLATION: Prompt injection or unauthorized instruction detected.',
        );
      }
    }

    // 2. Data Isolation Check
    // If the input tries to access cross-tenant data, it would be caught in the actual Agent tools
    // because tools are scoped with context.companyId.

    return input;
  }
}
