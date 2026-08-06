import {
  ServiceUnavailableException,
  Injectable,
  Logger,
} from '@nestjs/common';

@Injectable()
export class SlackProvider {
  private readonly logger = new Logger(SlackProvider.name);

  async send(to: string, payload: any): Promise<any> {
    if (!process.env.SLACK_BOT_TOKEN) {
      this.logger.error(
        `Slack provider is not configured. Failed to send to ${to}`,
      );
      throw new ServiceUnavailableException(
        'Slack provider is not configured.',
      );
    }
    this.logger.log(`Sending Slack message to channel/user ${to}`);
    // Real implementation would be: return slackClient.chat.postMessage(...)
    return { id: 'slack_' + Date.now(), status: 'delivered' };
  }
}
