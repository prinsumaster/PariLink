import { Test, TestingModule } from '@nestjs/testing';
import { TripsService } from './trips.service';
import { AuditService } from '../platform/audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { WorkflowService } from '../workflow/workflow.service';
import { NotFoundException } from '@nestjs/common';

describe('TripsService', () => {
  let service: TripsService;
  let eventEmitter: jest.Mocked<EventEmitter2>;

  const mockTx = {
    trip: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    load: { updateMany: jest.fn(), findMany: jest.fn().mockResolvedValue([]) },
    auditLog: { create: jest.fn() },
  };

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest.fn((companyId: string, cb: (tx: any) => any) =>
      cb(mockTx),
    ),
    updateWithOcc: jest.fn(),
  };

  const mockEventEmitter = { emit: jest.fn() };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockWorkflowService = {
      evaluateRules: jest.fn().mockResolvedValue({ triggeredActions: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TripsService,
        { provide: AuditService, useValue: { logEvent: jest.fn() } },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: EventEmitter2, useValue: mockEventEmitter },
        { provide: WorkflowService, useValue: mockWorkflowService },
      ],
    }).compile();
    service = module.get<TripsService>(TripsService);
    eventEmitter = module.get(EventEmitter2);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should auto-generate a tripNumber if not provided', async () => {
      const dto = { driverId: 'driver-1', vehicleId: 'vehicle-1' };
      const mockTrip = {
        id: 'trip-1',
        tripNumber: 'TRP-ABC123',
        status: 'PLANNED',
        loads: [],
      };
      mockTx.trip.create.mockResolvedValue(mockTrip);

      const result = await service.create('company-1', dto);

      expect(result.tripNumber).toMatch(/TRP-/);
      expect(mockEventEmitter.emit).toHaveBeenCalledWith(
        'trip.created',
        expect.any(Object),
      );
    });

    it('should use provided tripNumber if given', async () => {
      const dto = { tripNumber: 'TRP-CUSTOM-001', driverId: 'driver-1' };
      const mockTrip = {
        id: 'trip-1',
        tripNumber: 'TRP-CUSTOM-001',
        status: 'PLANNED',
        loads: [],
      };
      mockTx.trip.create.mockResolvedValue(mockTrip);

      const result = await service.create('company-1', dto);
      expect(result.tripNumber).toBe('TRP-CUSTOM-001');
    });

    it('should convert date strings to Date objects', async () => {
      const dto = {
        startDate: '2026-08-01',
        endDate: '2026-08-05',
        tripNumber: 'TRP-001',
      };
      const mockTrip = { id: 'trip-1', tripNumber: 'TRP-001', loads: [] };
      mockTx.trip.create.mockResolvedValue(mockTrip);

      await service.create('company-1', dto);

      expect(mockTx.trip.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            startDate: new Date('2026-08-01'),
            endDate: new Date('2026-08-05'),
          }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return trip if found', async () => {
      const mockTrip = { id: 'trip-1', tripNumber: 'TRP-001' };
      mockTx.trip.findFirst.mockResolvedValue(mockTrip);

      const result = await service.findOne('company-1', 'trip-1');
      expect(result).toEqual(mockTrip);
    });

    it('should throw NotFoundException if trip not found', async () => {
      mockTx.trip.findFirst.mockResolvedValue(null);
      await expect(service.findOne('company-1', 'trip-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('assignLoads', () => {
    it('should assign loads to a trip and update their status to ASSIGNED', async () => {
      const mockTrip = { id: 'trip-1', loads: [] };
      mockTx.trip.findFirst.mockResolvedValue(mockTrip);
      mockTx.load.updateMany.mockResolvedValue({ count: 2 });
      mockTx.trip.findFirst
        .mockResolvedValueOnce(mockTrip)
        .mockResolvedValueOnce({
          ...mockTrip,
          loads: [{ id: 'load-1' }, { id: 'load-2' }],
        });

      mockTx.load.findMany.mockResolvedValue([
        { id: 'load-1' },
        { id: 'load-2' },
      ]);

      await service.assignLoads('company-1', 'trip-1', ['load-1', 'load-2']);

      expect(mockTx.load.updateMany).toHaveBeenCalledWith({
        where: { id: { in: ['load-1', 'load-2'] }, companyId: 'company-1' },
        data: { tripId: 'trip-1', status: 'ASSIGNED' },
      });
    });

    it('should throw NotFoundException if trip not found', async () => {
      mockTx.trip.findFirst.mockResolvedValue(null);
      mockTx.load.findMany.mockResolvedValue([{ id: 'load-1' }]);
      await expect(
        service.assignLoads('company-1', 'trip-999', ['load-1']),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should soft-delete trip, unassign loads, and set status to CANCELLED', async () => {
      const mockTrip = { id: 'trip-1', tripNumber: 'TRP-001' };
      mockTx.trip.findFirst.mockResolvedValue(mockTrip);
      mockTx.load.updateMany.mockResolvedValue({ count: 2 });
      mockTx.trip.update.mockResolvedValue({
        ...mockTrip,
        deletedAt: new Date(),
        status: 'CANCELLED',
      });

      const result = await service.remove('company-1', 'trip-1');

      expect(mockTx.load.updateMany).toHaveBeenCalledWith(
        expect.objectContaining({ data: { tripId: null, status: 'PENDING' } }),
      );
      expect(result.status).toBe('CANCELLED');
    });
  });
});
