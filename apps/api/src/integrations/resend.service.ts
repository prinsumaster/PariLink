import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { SecretsService } from '../platform/security/secrets/secrets.service';
import { CircuitBreakerService } from '../platform/resilience/circuit-breaker.service';

@Injectable()
export class ResendService {
  private readonly logger = new Logger(ResendService.name);

  constructor(
    private readonly secretsService: SecretsService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  private async getClient(): Promise<Resend | null> {
    const apiKey = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'RESEND',
      'API_KEY',
    );
    if (!apiKey) {
      this.logger.warn(
        'RESEND_API_KEY missing from SecretsService. Email dispatch disabled.',
      );
      return null;
    }
    return new Resend(apiKey);
  }

  async sendTransactionalEmail(to: string, subject: string, html: string) {
    const resend = await this.getClient();
    if (!resend) {
      this.logger.warn(`Simulating email to ${to} - Resend not configured.`);
      return { id: 'mock_id' };
    }

    try {
      const data = await this.circuitBreaker.execute(
        'RESEND',
        async () => {
          // Implement hard timeout via Promise.race
          const timeoutMs = 5000;
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Resend request timed out')),
              timeoutMs,
            ),
          );

          return Promise.race([
            resend.emails.send({
              from: 'PariLink Platform <noreply@parilink.com>',
              to,
              subject,
              html,
            }),
            timeoutPromise,
          ]);
        },
        { retryCount: 3, resetTimeoutMs: 15000, retryBaseDelayMs: 200 },
      );
      this.logger.log(`Email dispatched successfully to ${to}`);
      return data;
    } catch (error) {
      this.logger.error('Failed to dispatch email via Resend', error);
      throw error;
    }
  }
}
