import { Injectable, Logger } from '@nestjs/common';
import twilio from 'twilio';
import { SecretsService } from '../platform/security/secrets/secrets.service';
import { CircuitBreakerService } from '../platform/resilience/circuit-breaker.service';

@Injectable()
export class TwilioService {
  private readonly logger = new Logger(TwilioService.name);

  constructor(
    private readonly secretsService: SecretsService,
    private readonly circuitBreaker: CircuitBreakerService,
  ) {}

  private async getClientInfo(): Promise<{
    client: any;
    fromPhone: string;
  } | null> {
    const sid = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'TWILIO',
      'ACCOUNT_SID',
    );
    const token = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'TWILIO',
      'AUTH_TOKEN',
    );
    const phone = await this.secretsService.retrieveIntegrationSecret(
      'SYSTEM',
      'TWILIO',
      'PHONE_NUMBER',
    );

    if (!sid || !token || !phone) {
      this.logger.warn(
        'Twilio credentials missing from SecretsService. WhatsApp dispatch disabled.',
      );
      return null;
    }

    return {
      client: twilio(sid, token),
      fromPhone: phone,
    };
  }

  async sendWhatsAppMessage(to: string, message: string) {
    const twilioInfo = await this.getClientInfo();
    if (!twilioInfo) {
      this.logger.warn(`Simulating WhatsApp to ${to}: ${message}`);
      return { sid: 'mock_sid' };
    }

    try {
      const response = await this.circuitBreaker.execute(
        'TWILIO',
        async () => {
          // Implement hard timeout via Promise.race
          const timeoutMs = 5000;
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(
              () => reject(new Error('Twilio request timed out')),
              timeoutMs,
            ),
          );

          return Promise.race([
            twilioInfo.client.messages.create({
              body: message,
              from: `whatsapp:${twilioInfo.fromPhone}`,
              to: `whatsapp:${to}`,
            }),
            timeoutPromise,
          ]);
        },
        { retryCount: 3, resetTimeoutMs: 15000, retryBaseDelayMs: 200 },
      );
      this.logger.log(`WhatsApp message sent to ${to}, SID: ${response.sid}`);
      return response;
    } catch (error) {
      this.logger.error('Failed to send WhatsApp message via Twilio', error);
      throw error;
    }
  }
}
