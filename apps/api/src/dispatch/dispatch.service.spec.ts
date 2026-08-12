import { TwilioService } from '../integrations/twilio.service';
import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { DispatchService } from './dispatch.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { BadRequestException } from '@nestjs/common';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

describe('DispatchService', () => {
  let service: DispatchService;

  const mockTx = {
    load: {
      findUnique: jest.fn(),
      findFirst: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
      updateMany: jest.fn(),
    },
    driver: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      update: jest.fn(),
    },
    vehicle: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
    },
    trip: {
      findMany: jest.fn(),
      create: jest.fn(),
      findFirst: jest.fn(),
    },
    trailer: { findMany: jest.fn() },
  };

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest.fn((companyId: string, cb: (tx: any) => any) =>
      cb(mockTx),
    ),
    updateWithOcc: jest.fn().mockResolvedValue({ status: 'IN_PROGRESS' }),
    load: {
      findFirst: jest.fn(),
      update: jest.fn(),
    },
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockWorkflowService = {
      evaluateRules: jest.fn().mockResolvedValue({ triggeredActions: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: TwilioService, useValue: {} },
        DispatchService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WorkflowService, useValue: mockWorkflowService },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
        { provide: AuditService, useValue: { logEvent: jest.fn() } },
        { provide: EventStoreService, useValue: { append: jest.fn() } },
      ],
    }).compile();
    service = module.get<DispatchService>(DispatchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getBoardData', () => {
    it('should return all board data with metrics', async () => {
      mockTx.load.findMany.mockResolvedValue([
        { id: 'load-1', status: 'PENDING' },
      ]);
      mockTx.driver.findMany.mockResolvedValue([
        { id: 'driver-1', status: 'AVAILABLE' },
      ]);
      mockTx.vehicle.findMany.mockResolvedValueOnce([
        { id: 'vehicle-1', type: 'TRUCK' },
      ]);
      mockTx.vehicle.findMany.mockResolvedValueOnce([
        { id: 'trailer-1', type: 'TRAILER' },
      ]);
      mockTx.trip.findMany.mockResolvedValue([
        { id: 'trip-1', status: 'PLANNED' },
      ]);

      const result = await service.getBoardData('company-1');

      expect(result.pendingLoads).toHaveLength(1);
      expect(result.availableDrivers).toHaveLength(1);
      expect(result.metrics.pendingLoadsCount).toBe(1);
      expect(result.metrics.availableDriversCount).toBe(1);
      expect(result.metrics.activeTripsCount).toBe(1);
    });
  });

  describe('moveBoardCard', () => {
    it('should throw BadRequestException if load not found', async () => {
      mockTx.load.findFirst.mockResolvedValue(null);
      await expect(
        service.moveBoardCard('company-1', 'load-1', 'IN_PROGRESS', 2),
      ).rejects.toThrow(BadRequestException);
    });

    it('should update load status and position', async () => {
      const mockLoad = { id: 'load-1', status: 'PENDING' };
      mockTx.load.findFirst.mockResolvedValue(mockLoad);
      mockTx.load.update.mockResolvedValue({
        ...mockLoad,
        status: 'IN_PROGRESS',
        boardPosition: 2,
      });

      const result = await service.moveBoardCard(
        'company-1',
        'load-1',
        'IN_PROGRESS',
        2,
      );
      expect(result.status).toBe('IN_PROGRESS');
    });
  });

  describe('Tenant Isolation', () => {
    it('should always call runAsTenant with the provided companyId', async () => {
      mockTx.load.findMany.mockResolvedValue([]);
      mockTx.driver.findMany.mockResolvedValue([]);
      mockTx.vehicle.findMany.mockResolvedValue([]);
      mockTx.trip.findMany.mockResolvedValue([]);

      await service.getBoardData('company-specific-id');

      expect(mockPrisma.runAsTenant).toHaveBeenCalledWith(
        'company-specific-id',
        expect.any(Function),
      );
    });

    it('should not allow data from a different company', async () => {
      // Each runAsTenant call is scoped — verify it is not called with the wrong ID
      mockTx.load.findMany.mockResolvedValue([]);
      mockTx.driver.findMany.mockResolvedValue([]);
      mockTx.vehicle.findMany.mockResolvedValue([]);
      mockTx.trip.findMany.mockResolvedValue([]);

      await service.getBoardData('company-A');

      const calls = mockPrisma.runAsTenant.mock.calls;
      expect(calls.every((c) => c[0] === 'company-A')).toBe(true);
    });
  });
});
