import {
  ServiceUnavailableException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class EmailProvider {
  private readonly logger = new Logger(EmailProvider.name);

  async send(to: string, payload: any): Promise<any> {
    if (!process.env.SENDGRID_API_KEY) {
      this.logger.error(
        `Email provider is not configured. Failed to send to ${to}`,
      );
      throw new ServiceUnavailableException(
        'Email provider (SendGrid) is not configured.',
      );
    }
    this.logger.log(`Sending Email via SendGrid to ${to}`);
    // Real implementation would be: return sgMail.send(...)
    return { id: 'email_' + Date.now(), status: 'delivered' };
  }
}
