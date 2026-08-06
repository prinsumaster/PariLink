import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { WebhookService } from './webhook.service';

@Injectable()
export class EventBusListener {
  private readonly logger = new Logger(EventBusListener.name);

  constructor(private readonly webhookService: WebhookService) {}

  @OnEvent('**')
  handleAllEvents(event: string, payload: any) {
    if (!payload || !payload.companyId) {
      this.logger.debug(
        `Ignoring event ${event} - missing companyId in payload`,
      );
      return;
    }

    // In a production system, we might buffer these or filter out noisy events
    // before dispatching to the Webhook queue
    this.webhookService
      .dispatchEvent(payload.companyId, event, payload)
      .catch((err) =>
        this.logger.error(`Failed to dispatch event ${event}`, err),
      );
  }
}
