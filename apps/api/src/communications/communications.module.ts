import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';

import { DeliveryProcessor } from './engine/delivery.processor';
import { TemplateService } from './engine/template.service';
import { CommunicationsService } from './communications.service';
import { NotificationOrchestratorService } from './engine/notification-orchestrator.service';

import { InboxController } from './controllers/inbox.controller';
import { NotificationController } from './controllers/notification.controller';
import { AnnouncementController } from './controllers/announcement.controller';
import { PreferencesController } from './controllers/preferences.controller';
import { EnterpriseNotificationController } from './controllers/enterprise-notification.controller';
import { SseController } from './realtime/sse.controller';

import { SseService } from './realtime/sse.service';

// Channel Providers
import { EmailProvider } from './channels/email.provider';
import { SmsProvider } from './channels/sms.provider';
import { SlackProvider } from './channels/slack.provider';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'notification-delivery',
    }),
  ],
  controllers: [
    InboxController,
    NotificationController,
    AnnouncementController,
    PreferencesController,
    EnterpriseNotificationController,
    SseController,
  ],
  providers: [
    DeliveryProcessor,
    TemplateService,
    NotificationOrchestratorService,
    SseService,
    EmailProvider,
    SmsProvider,
    SlackProvider,
    CommunicationsService,
  ],
  exports: [
    DeliveryProcessor,
    TemplateService,
    NotificationOrchestratorService,
    SseService,
    CommunicationsService,
  ],
})
export class CommunicationsModule {}
