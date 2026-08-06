import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WebhookService } from './webhook.service';
import { WebhookProcessor } from './webhook.processor';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'webhooks_v2',
      defaultJobOptions: {
        attempts: 5,
        backoff: {
          type: 'exponential',
          delay: 2000,
        },
        removeOnComplete: true,
        removeOnFail: false,
      },
    }),
  ],
  providers: [WebhookService, WebhookProcessor],
  exports: [WebhookService],
})
export class WebhookModule {}
