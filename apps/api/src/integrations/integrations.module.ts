import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { CryptoService } from './security/crypto.service';
import { ConnectorFactoryService } from './connectors/connector-factory.service';
import { SyncEngineProcessor } from './sync/sync-engine.processor';
import { WebhookController } from './webhooks/webhook.controller';
import { GatewayController } from './gateway/gateway.controller';
import { RazorpayService } from './razorpay.service';
import { ResendService } from './resend.service';
import { TwilioService } from './twilio.service';
import { LocoNavService } from './loconav.service';
import { BullModule } from '@nestjs/bullmq';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'integration-sync',
    }),
  ],
  controllers: [IntegrationsController, WebhookController, GatewayController],
  providers: [
    IntegrationsService,
    CryptoService,
    ConnectorFactoryService,
    ...(process.env.RUN_WORKERS === 'true' ? [...(process.env.RUN_WORKERS === 'true' ? [SyncEngineProcessor] : [])] : []),
    RazorpayService,
    ResendService,
    TwilioService,
    LocoNavService,
  ],
  exports: [
    IntegrationsService,
    CryptoService,
    ConnectorFactoryService,
    RazorpayService,
    ResendService,
    TwilioService,
    LocoNavService,
  ],
})
export class IntegrationsModule {}
