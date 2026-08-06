import { Test, TestingModule } from '@nestjs/testing';
import { EnterpriseIntegrationHubService } from './hub/enterprise-integration-hub.service';
import { WebhookPlatformService } from './webhook/webhook-platform.service';
import { EnterpriseEventBusService } from './events/enterprise-event-bus.service';
import { ImportExportService } from './import-export/import-export.service';
import { DataMappingService } from './mapping/mapping.service';
import { SyncEngineService } from './sync/sync.service';
import { DeveloperPlatformService } from './developer/developer-platform.service';
import { ConnectorRegistryService } from './framework/registry.service';
import { IntegrationAuthService } from './auth/auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

describe('Enterprise Integration Hub & Developer Platform Suite', () => {
  let hubService: EnterpriseIntegrationHubService;
  let webhookPlatform: WebhookPlatformService;
  let eventBus: EnterpriseEventBusService;
  let importExport: ImportExportService;
  let dataMapping: DataMappingService;
  let syncEngine: SyncEngineService;
  let devPlatform: DeveloperPlatformService;

  const mockTx = {
    integrationConnector: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    integrationConnection: {
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    webhookDelivery: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
    },
    domainEvent: {
      findFirst: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
      create: jest.fn(),
    },
    backgroundJob: {
      create: jest.fn(),
      update: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    invoice: { findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn() },
    customer: { findFirst: jest.fn(), create: jest.fn() },
    driver: { findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn() },
    vehicle: { findFirst: jest.fn(), findMany: jest.fn(), create: jest.fn() },
    trip: { findMany: jest.fn() },
    dataMappingTemplate: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      findUnique: jest.fn(),
    },
    syncJob: {
      create: jest.fn(),
      update: jest.fn(),
      findMany: jest.fn(),
      count: jest.fn(),
    },
    scheduledSync: { create: jest.fn(), findMany: jest.fn() },
    syncError: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
    },
    apiVersion: { findMany: jest.fn() },
    oAuthClient: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      delete: jest.fn(),
    },
    apiKey: { count: jest.fn(), findUnique: jest.fn(), update: jest.fn() },
    webhookEndpoint: { count: jest.fn() },
  };

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest.fn((companyId: string, cb: (tx: any) => any) =>
      cb(mockTx),
    ),
    ...mockTx,
  };

  const mockRegistry = {
    getConnector: jest.fn(),
    registerConnector: jest.fn(),
  };

  const mockAuth = {
    encryptCredentials: jest.fn().mockReturnValue('encrypted_secret'),
    decryptCredentials: jest
      .fn()
      .mockReturnValue({ apiKey: 'decrypted_secret' }),
  };

  const mockAudit = {
    logEvent: jest.fn().mockResolvedValue(undefined),
  };

  const mockEventEmitter = {
    emit: jest.fn().mockReturnValue(true),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnterpriseIntegrationHubService,
        WebhookPlatformService,
        EnterpriseEventBusService,
        ImportExportService,
        DataMappingService,
        SyncEngineService,
        DeveloperPlatformService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: ConnectorRegistryService, useValue: mockRegistry },
        { provide: IntegrationAuthService, useValue: mockAuth },
        { provide: AuditService, useValue: mockAudit },
        { provide: EventEmitter2, useValue: mockEventEmitter },
      ],
    }).compile();

    hubService = module.get<EnterpriseIntegrationHubService>(
      EnterpriseIntegrationHubService,
    );
    webhookPlatform = module.get<WebhookPlatformService>(
      WebhookPlatformService,
    );
    eventBus = module.get<EnterpriseEventBusService>(EnterpriseEventBusService);
    importExport = module.get<ImportExportService>(ImportExportService);
    dataMapping = module.get<DataMappingService>(DataMappingService);
    syncEngine = module.get<SyncEngineService>(SyncEngineService);
    devPlatform = module.get<DeveloperPlatformService>(
      DeveloperPlatformService,
    );
  });

  describe('Module 1: Enterprise Integration Hub', () => {
    it('should list catalog of connectors', async () => {
      mockTx.integrationConnector.findMany.mockResolvedValue([
        { provider: 'SAP_S4HANA', status: 'ACTIVE' },
      ]);
      const res = await hubService.getCatalog();
      expect(res).toHaveLength(1);
      expect(res[0].provider).toBe('SAP_S4HANA');
    });

    it('should configure a new integration connection', async () => {
      const mockConnector = {
        version: '1.0',
        authType: 'OAUTH2',
        validateConfiguration: jest.fn().mockReturnValue(true),
        testConnection: jest.fn().mockResolvedValue(true),
      };
      mockRegistry.getConnector.mockReturnValue(mockConnector);
      mockTx.integrationConnector.findUnique.mockResolvedValue(null);
      mockTx.integrationConnector.create.mockResolvedValue({
        id: 'conn_cat_1',
        provider: 'SAP_S4HANA',
      });
      mockTx.integrationConnection.findFirst.mockResolvedValue(null);
      mockTx.integrationConnection.create.mockResolvedValue({
        id: 'inst_1',
        status: 'ENABLED',
      });

      const res = await hubService.configureIntegration('comp_1', 'user_1', {
        provider: 'SAP_S4HANA',
        credentials: { clientId: 'foo', clientSecret: 'bar' },
      });
      expect(res.status).toBe('ENABLED');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });
  });

  describe('Module 2: Webhook Platform', () => {
    it('should query delivery history and calculate metrics', async () => {
      mockTx.webhookDelivery.findMany.mockResolvedValue([
        { id: 'del_1', status: 'SUCCESS' },
      ]);
      mockTx.webhookDelivery.count
        .mockResolvedValueOnce(1)
        .mockResolvedValue(10);

      const history = await webhookPlatform.getDeliveryHistory('comp_1', {
        limit: 10,
      });
      expect(history.deliveries).toHaveLength(1);

      const metrics = await webhookPlatform.getWebhookMetrics('comp_1');
      expect(metrics.successRate).toBeDefined();
    });
  });

  describe('Module 4: Enterprise Event Bus', () => {
    it('should publish domain event and emit to internal event emitter', async () => {
      mockTx.domainEvent.findFirst.mockResolvedValue(null);
      mockTx.domainEvent.create.mockResolvedValue({
        id: 'ev_1',
        streamId: 'stream_100',
        streamType: 'VEHICLE',
        eventType: 'GpsUpdated',
        version: 1,
        payload: { lat: 19.0, lng: 72.8 },
      });

      const ev = await eventBus.publishEvent('comp_1', 'user_1', {
        streamId: 'stream_100',
        streamType: 'VEHICLE',
        eventType: 'GpsUpdated',
        payload: { lat: 19.0, lng: 72.8 },
      });

      expect(ev.version).toBe(1);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'DomainEvent.VEHICLE.GpsUpdated',
        expect.objectContaining({ eventId: 'ev_1' }),
      );
    });
  });

  describe('Module 7: Import / Export Console', () => {
    it('should preview import and detect duplicate invoices', async () => {
      mockTx.invoice.findFirst
        .mockResolvedValueOnce(null)
        .mockResolvedValueOnce({ id: 'inv_existing' });

      const res = await importExport.previewImport('comp_1', 'INVOICE', 'CSV', [
        { invoiceNumber: 'INV-101', amount: 500 },
        { invoiceNumber: 'INV-102', amount: 1000 },
      ]);

      expect(res.validCount).toBe(1);
      expect(res.duplicateCount).toBe(1);
    });

    it('should execute export to CSV format', async () => {
      mockTx.backgroundJob.create.mockResolvedValue({ id: 'job_exp_1' });
      mockTx.invoice.findMany.mockResolvedValue([
        { invoiceNumber: 'INV-201', amount: 1500, status: 'PAID' },
      ]);
      mockTx.backgroundJob.update.mockResolvedValue({
        id: 'job_exp_1',
        status: 'COMPLETED',
      });

      const res = await importExport.executeExport(
        'comp_1',
        'user_1',
        'INVOICE',
        'CSV',
      );
      expect(res.status).toBe('COMPLETED');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });
  });

  describe('Module 8: Data Mapping Engine', () => {
    it('should apply transformations and conditional rules in preview', async () => {
      const mockTemplate = {
        id: 'tmpl_1',
        name: 'SAP_Invoice_Mapping',
        sourceEntity: 'SAP.Invoice',
        targetEntity: 'PariLink.Invoice',
        mappingRules: [
          {
            sourceField: 'docNum',
            targetField: 'invoiceNumber',
            transformFn: 'TRIM',
          },
          {
            sourceField: 'totalAmt',
            targetField: 'amount',
            transformFn: 'TO_FLOAT',
          },
          {
            sourceField: 'statusStr',
            targetField: 'status',
            lookupTable: { O: 'DRAFT', C: 'PAID' },
            condition: {
              ifField: 'isApproved',
              ifOperator: 'EQUALS',
              ifValue: true,
            },
          },
        ],
      };
      mockTx.dataMappingTemplate.findFirst.mockResolvedValue(mockTemplate);

      const res = await dataMapping.previewMapping(
        'comp_1',
        'SAP_Invoice_Mapping',
        {
          docNum: '  INV-999  ',
          totalAmt: '2450.75',
          statusStr: 'C',
          isApproved: true,
        },
      );

      expect(res.transformedPayload.invoiceNumber).toBe('INV-999');
      expect(res.transformedPayload.amount).toBe(2450.75);
      expect(res.transformedPayload.status).toBe('PAID');
      expect(res.rulesApplied).toBe(3);
    });
  });

  describe('Module 9: Synchronization Scheduler', () => {
    it('should schedule recurring sync job', async () => {
      mockTx.integrationConnection.findUnique.mockResolvedValue({
        id: 'conn_10',
        companyId: 'comp_1',
      });
      mockTx.scheduledSync.create.mockResolvedValue({
        id: 'sched_1',
        cronExpression: '0 * * * *',
        isActive: true,
      });

      const res = await syncEngine.scheduleSync('comp_1', 'user_1', {
        connectionId: 'conn_10',
        cronExpression: '0 * * * *',
      });

      expect(res.cronExpression).toBe('0 * * * *');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });
  });

  describe('Module 3 & 10: Developer Portal & API Platform', () => {
    it('should generate valid OpenAPI 3.0 spec', async () => {
      const spec = await devPlatform.getOpenApiSchema();
      expect(spec.openapi).toBe('3.0.3');
      expect(spec.paths['/integration/hub/catalog']).toBeDefined();
    });

    it('should generate SDK code snippet for TypeScript and Python', async () => {
      const tsSnippet = await devPlatform.generateSdkSnippet('typescript');
      expect(tsSnippet.snippet).toContain('axios.create');
      const pySnippet = await devPlatform.generateSdkSnippet('python');
      expect(pySnippet.snippet).toContain('requests.post');
    });

    it('should rotate API key and return raw token once', async () => {
      mockTx.apiKey.findUnique.mockResolvedValue({
        id: 'key_1',
        companyId: 'comp_1',
        name: 'Production API Key',
      });
      mockTx.apiKey.update.mockResolvedValue({
        id: 'key_1',
        name: 'Production API Key',
        scopes: ['all'],
      });

      const res = await devPlatform.rotateApiKey('comp_1', 'key_1', 'user_1');
      expect(res.rawKey).toContain('pk_live_');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });
  });
});
