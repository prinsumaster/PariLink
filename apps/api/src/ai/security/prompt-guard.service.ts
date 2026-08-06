import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class PromptGuardService {
  private readonly logger = new Logger(PromptGuardService.name);

  // Simple heuristic PII masker for demo/v2 scaffolding
  maskPii(input: string): string {
    this.logger.debug('Masking PII from prompt');
    let masked = input.replace(/\b\d{3}-\d{2}-\d{4}\b/g, '[SSN-REDACTED]');
    masked = masked.replace(
      /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
      '[EMAIL-REDACTED]',
    );
    return masked;
  }

  detectPromptInjection(input: string): boolean {
    const injectionSignatures = [
      'ignore previous instructions',
      'system prompt',
      'you are now',
      'bypass rules',
    ];

    const lowerInput = input.toLowerCase();
    return injectionSignatures.some((sig) => lowerInput.includes(sig));
  }
}
