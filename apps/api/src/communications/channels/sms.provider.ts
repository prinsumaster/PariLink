import {
  ServiceUnavailableException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class SmsProvider {
  private readonly logger = new Logger(SmsProvider.name);

  async send(to: string, payload: any): Promise<any> {
    if (!process.env.TWILIO_ACCOUNT_SID || !process.env.TWILIO_AUTH_TOKEN) {
      this.logger.error(
        `SMS provider is not configured. Failed to send to ${to}`,
      );
      throw new ServiceUnavailableException(
        'SMS provider (Twilio) is not configured.',
      );
    }
    this.logger.log(`Sending SMS via Twilio to ${to}`);
    // Real implementation would be: return this.twilio.messages.create(...)
    return { id: 'sms_' + Date.now(), status: 'delivered' };
  }
}
