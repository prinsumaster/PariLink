import { Injectable, Logger } from '@nestjs/common';
import {
  QueueEventsListener,
  QueueEventsHost,
  OnQueueEvent,
} from '@nestjs/bullmq';

@Injectable()
@QueueEventsListener('webhooks')
export class WebhooksDlqProcessor extends QueueEventsHost {
  private readonly logger = new Logger(WebhooksDlqProcessor.name);

  @OnQueueEvent('failed')
  onFailed({ jobId, failedReason }: { jobId: string; failedReason: string }) {
    // Explicit DLQ Processor Hook
    // In an enterprise system, this could trigger PagerDuty, update a DB record, or move to a separate 'dlq' queue
    this.logger.error(
      `[DLQ-WEBHOOKS] Job ${jobId} completely failed. Reason: ${failedReason}`,
    );
  }
}

@Injectable()
@QueueEventsListener('background_jobs')
export class BackgroundJobsDlqProcessor extends QueueEventsHost {
  private readonly logger = new Logger(BackgroundJobsDlqProcessor.name);

  @OnQueueEvent('failed')
  onFailed({ jobId, failedReason }: { jobId: string; failedReason: string }) {
    // Explicit DLQ Processor Hook
    this.logger.error(
      `[DLQ-BACKGROUND-JOBS] Job ${jobId} completely failed. Reason: ${failedReason}`,
    );
  }
}
