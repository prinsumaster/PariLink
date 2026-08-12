// @ts-nocheck
import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import { NotificationOrchestratorService } from '../communications/engine/notification-orchestrator.service';
import { GeofenceEngineService } from './services/geofence-engine.service';
import { TelematicsIngestionService } from './services/telematics-ingestion.service';

describe('Enterprise Telematics & Geofence Intelligence Platform', () => {
  let geofenceEngine: GeofenceEngineService;
  let telematicsService: TelematicsIngestionService;

  const mockPrisma: any = {
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => await cb(mockPrisma)),
    alert: {
      findFirst: jest.fn().mockResolvedValue({ id: 'alert-123', companyId: 'company-123' }),
      update: jest.fn().mockResolvedValue({}),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
    },
    geofence: {
      create: jest.fn().mockResolvedValue({
        id: 'geo-1',
        name: 'Depot 1',
        latitude: 41.88,
        longitude: -87.63,
        radiusMeters: 200,
      }),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'geo-1',
          name: 'Depot 1',
          latitude: 41.88,
          longitude: -87.63,
          radiusMeters: 200,
        },
      ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'geo-1',
        companyId: 'comp-1',
        name: 'Depot 1',
        events: [],
      }),
      delete: jest.fn().mockResolvedValue({ id: 'geo-1' }),
    },
    geofenceEvent: {
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ id: 'evt-1', ...args.data }),
        ),
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 'evt-1', eventType: 'ENTER' }]),
    },
    vehicle: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'veh-1',
        companyId: 'comp-1',
        licensePlate: 'TRK-999',
      }),
      count: jest.fn().mockResolvedValue(10),
    },
    vehicleTelemetry: {
      create: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ id: 'telem-1', ...args.data }),
        ),
    },
    alertRule: {
      create: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ id: 'rule-1', ...args.data }),
        ),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'rule-1',
          name: 'Speeding Alert',
          type: 'SPEEDING',
          condition: 'EXCEEDS',
          threshold: 65,
          severity: 'HIGH',
        },
      ]),
      findUnique: jest
        .fn()
        .mockResolvedValue({ id: 'rule-1', companyId: 'comp-1' }),
      delete: jest.fn().mockResolvedValue({ id: 'rule-1' }),
    },
    alert: {
      findFirst: jest.fn().mockResolvedValue({ id: 'alert-1', companyId: 'comp-1' }),
      updateMany: jest.fn().mockResolvedValue({ count: 1 }),
      create: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ id: 'alert-1', ...args.data }),
        ),
      findMany: jest.fn().mockResolvedValue([{ id: 'alert-1', status: 'NEW' }]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'alert-1',
        companyId: 'comp-1',
        status: 'NEW',
        metadata: {},
      }),
      update: jest
        .fn()
        .mockImplementation((args) =>
          Promise.resolve({ id: 'alert-1', ...args.data }),
        ),
      count: jest.fn().mockResolvedValue(5),
      groupBy: jest.fn().mockResolvedValue([{ ruleId: 'rule-1', _count: 5 }]),
    },
    user: {
      findFirst: jest
        .fn()
        .mockResolvedValue({ id: 'usr-1', email: 'admin@parilink.com' }),
    },
  };

  const mockAudit: any = {
    logEvent: jest.fn().mockResolvedValue({}),
  };

  const mockOrchestrator: any = {
    dispatchNotification: jest.fn().mockResolvedValue({ success: true }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        GeofenceEngineService,
        TelematicsIngestionService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
        {
          provide: NotificationOrchestratorService,
          useValue: mockOrchestrator,
        },
      ],
    }).compile();

    geofenceEngine = module.get<GeofenceEngineService>(GeofenceEngineService);
    telematicsService = module.get<TelematicsIngestionService>(
      TelematicsIngestionService,
    );
  });

  it('should be defined', () => {
    expect(geofenceEngine).toBeDefined();
    expect(telematicsService).toBeDefined();
  });

  describe('Geofence Engine', () => {
    it('should create a geofence', async () => {
      const fence = await geofenceEngine.createGeofence('comp-1', 'usr-1', {
        name: 'Depot 1',
        type: 'DEPOT',
        latitude: 41.88,
        longitude: -87.63,
        radiusMeters: 200,
      });
      expect(fence.name).toBe('Depot 1');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });

    it('should evaluate GPS location and trigger ENTER event when inside radius', async () => {
      mockPrisma.geofenceEvent.findFirst.mockResolvedValueOnce(null); // Not previously inside
      const res = await geofenceEngine.evaluateLocationAgainstGeofences(
        'comp-1',
        'veh-1',
        41.8801,
        -87.6301,
      );
      expect(res.evaluatedCount).toBe(1);
      expect(res.eventsCreated).toHaveLength(1);
      expect(res.eventsCreated[0].eventType).toBe('ENTER');
    });

    it('should evaluate GPS location and trigger EXIT event with dwell time when leaving radius', async () => {
      const enterTimestamp = new Date(Date.now() - 45 * 60000); // 45 mins ago
      mockPrisma.geofenceEvent.findFirst.mockResolvedValueOnce({
        id: 'old-evt',
        eventType: 'ENTER',
        timestamp: enterTimestamp,
      });

      // Coordinates outside 200m radius
      const res = await geofenceEngine.evaluateLocationAgainstGeofences(
        'comp-1',
        'veh-1',
        42.0,
        -88.0,
      );
      expect(res.eventsCreated).toHaveLength(1);
      expect(res.eventsCreated[0].eventType).toBe('EXIT');
    });
  });

  describe('Telematics Ingestion & Alerting', () => {
    it('should ingest telemetry and trigger speeding alert', async () => {
      const res = await telematicsService.ingestTelemetry('comp-1', {
        vehicleId: 'veh-1',
        speed: 75,
        coolantTemp: 190,
      });

      expect(res.success).toBe(true);
      expect(res.triggeredAlertsCount).toBe(1);
      expect(mockOrchestrator.dispatchNotification).toHaveBeenCalled();
    });

    it('should update alert status to ACKNOWLEDGED', async () => {
      const updated = await telematicsService.updateAlertStatus(
        'comp-1',
        'alert-1',
        'usr-1',
        {
          status: 'ACKNOWLEDGED',
          notes: 'Checking with driver',
        },
      );
      expect(updated).toBeDefined();
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });

    it('should calculate fleet health analytics summary', async () => {
      const analytics =
        await telematicsService.getFleetHealthAnalytics('comp-1');
      expect(analytics.summary.vehicleCount).toBe(10);
      expect(analytics.summary.totalAlerts).toBe(5);
    });
  });
});
