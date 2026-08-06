import { Module } from '@nestjs/common';
import { IntegrationsController } from './integrations.controller';
import { IntegrationsService } from './integrations.service';
import { CryptoService } from './security/crypto.service';
import { ConnectorFactoryService } from './connectors/connector-factory.service';
import { SyncEngineProcessor } from './sync/sync-engine.processor';
import { WebhookController } from './webhooks/webhook.controller';
import { GatewayController } from './gateway/gateway.controller';
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
    SyncEngineProcessor,
  ],
  exports: [IntegrationsService, CryptoService, ConnectorFactoryService],
})
export class IntegrationsModule {}
