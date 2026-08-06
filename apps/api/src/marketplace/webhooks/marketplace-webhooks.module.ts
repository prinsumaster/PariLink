import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { WebhookService } from './webhook.service';
import { WebhookProcessor } from './webhook.processor';
import { EventBusListener } from './event-bus.listener';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [
    PrismaModule,
    BullModule.registerQueue({
      name: 'webhooks',
    }),
  ],
  providers: [WebhookService, WebhookProcessor, EventBusListener],
  exports: [WebhookService],
})
export class MarketplaceWebhooksModule {}
