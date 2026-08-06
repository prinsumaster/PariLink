import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CommunicationsService {
  private readonly logger = new Logger(CommunicationsService.name);

  async sendSms(phone: string, message: string) {
    this.logger.log(`Sending SMS via Twilio to ${phone}`);
    return { status: 'sent', provider: 'twilio' };
  }

  async sendSlackAlert(channel: string, message: string) {
    this.logger.log(`Sending Slack Alert to ${channel}`);
    return { status: 'sent', provider: 'slack' };
  }
}
