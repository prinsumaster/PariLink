import { Module, OnModuleInit } from '@nestjs/common';
import { ConnectorRegistryService } from './framework/registry.service';
import { IntegrationAuthService } from './auth/auth.service';
import { WebhookEngineService } from './webhook/webhook.service';
import { DataMappingService } from './mapping/mapping.service';
import { SyncEngineService } from './sync/sync.service';
import { EventIntegrationService } from './events/event-integration.service';
import { IntegrationObservabilityService } from './observability/observability.service';
import { IntegrationGatewayController } from './gateway/gateway.controller';

// Existing Connectors
import { GoogleMapsConnector } from './connectors/google-maps.connector';
import { QuickBooksConnector } from './connectors/quickbooks.connector';
import { AccountingSoftwareConnector } from './connectors/finance.connector';
import { SamsaraTelematicsConnector } from './connectors/telematics.connector';

// New ERP Connectors
import {
  SapConnector,
  OracleErpConnector,
  Dynamics365Connector,
  TallyConnector,
  ZohoBooksConnector,
  XeroConnector,
} from './connectors/erp.connectors';

// New Logistics Connectors
import {
  GpsProviderConnector,
  FuelCardConnector,
  FastagConnector,
  EwayBillConnector,
  GstConnector,
  SmsGatewayConnector,
  EmailGatewayConnector,
  WhatsAppConnector,
  PaymentGatewayConnector,
} from './connectors/logistics.connectors';

// Hub & Developer Platform Services and Controllers
import { EnterpriseIntegrationHubService } from './hub/enterprise-integration-hub.service';
import { EnterpriseIntegrationHubController } from './hub/enterprise-integration-hub.controller';
import { WebhookPlatformService } from './webhook/webhook-platform.service';
import { WebhookPlatformController } from './webhook/webhook-platform.controller';
import { EnterpriseEventBusService } from './events/enterprise-event-bus.service';
import { EnterpriseEventBusController } from './events/enterprise-event-bus.controller';
import { ImportExportService } from './import-export/import-export.service';
import { ImportExportController } from './import-export/import-export.controller';
import { DataMappingController } from './mapping/data-mapping.controller';
import { SyncSchedulerController } from './sync/sync-scheduler.controller';
import { DeveloperPlatformService } from './developer/developer-platform.service';
import { DeveloperPlatformController } from './developer/developer-platform.controller';

@Module({
  controllers: [
    IntegrationGatewayController,
    EnterpriseIntegrationHubController,
    WebhookPlatformController,
    EnterpriseEventBusController,
    ImportExportController,
    DataMappingController,
    SyncSchedulerController,
    DeveloperPlatformController,
  ],
  providers: [
    ConnectorRegistryService,
    IntegrationAuthService,
    WebhookEngineService,
    DataMappingService,
    SyncEngineService,
    EventIntegrationService,
    IntegrationObservabilityService,
    EnterpriseIntegrationHubService,
    WebhookPlatformService,
    EnterpriseEventBusService,
    ImportExportService,
    DeveloperPlatformService,
    // Connectors
    GoogleMapsConnector,
    QuickBooksConnector,
    AccountingSoftwareConnector,
    SamsaraTelematicsConnector,
    SapConnector,
    OracleErpConnector,
    Dynamics365Connector,
    TallyConnector,
    ZohoBooksConnector,
    XeroConnector,
    GpsProviderConnector,
    FuelCardConnector,
    FastagConnector,
    EwayBillConnector,
    GstConnector,
    SmsGatewayConnector,
    EmailGatewayConnector,
    WhatsAppConnector,
    PaymentGatewayConnector,
  ],
  exports: [
    ConnectorRegistryService,
    IntegrationAuthService,
    WebhookEngineService,
    DataMappingService,
    SyncEngineService,
    IntegrationObservabilityService,
    EnterpriseIntegrationHubService,
    WebhookPlatformService,
    EnterpriseEventBusService,
    ImportExportService,
    DeveloperPlatformService,
  ],
})
export class IntegrationModule implements OnModuleInit {
  constructor(
    private readonly registry: ConnectorRegistryService,
    private readonly googleMaps: GoogleMapsConnector,
    private readonly quickBooks: QuickBooksConnector,
    private readonly finance: AccountingSoftwareConnector,
    private readonly telematics: SamsaraTelematicsConnector,
    private readonly sap: SapConnector,
    private readonly oracle: OracleErpConnector,
    private readonly dynamics: Dynamics365Connector,
    private readonly tally: TallyConnector,
    private readonly zoho: ZohoBooksConnector,
    private readonly xero: XeroConnector,
    private readonly gps: GpsProviderConnector,
    private readonly fuel: FuelCardConnector,
    private readonly fastag: FastagConnector,
    private readonly eway: EwayBillConnector,
    private readonly gst: GstConnector,
    private readonly sms: SmsGatewayConnector,
    private readonly email: EmailGatewayConnector,
    private readonly whatsapp: WhatsAppConnector,
    private readonly payments: PaymentGatewayConnector,
  ) {}

  onModuleInit() {
    this.registry.registerConnector(this.googleMaps);
    this.registry.registerConnector(this.quickBooks);
    this.registry.registerConnector(this.finance);
    this.registry.registerConnector(this.telematics);
    this.registry.registerConnector(this.sap);
    this.registry.registerConnector(this.oracle);
    this.registry.registerConnector(this.dynamics);
    this.registry.registerConnector(this.tally);
    this.registry.registerConnector(this.zoho);
    this.registry.registerConnector(this.xero);
    this.registry.registerConnector(this.gps);
    this.registry.registerConnector(this.fuel);
    this.registry.registerConnector(this.fastag);
    this.registry.registerConnector(this.eway);
    this.registry.registerConnector(this.gst);
    this.registry.registerConnector(this.sms);
    this.registry.registerConnector(this.email);
    this.registry.registerConnector(this.whatsapp);
    this.registry.registerConnector(this.payments);
  }
}
