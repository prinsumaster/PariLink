import { Test, TestingModule } from '@nestjs/testing';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../platform/audit/audit.service';
import { DriversService } from './drivers.service';
import { PrismaService } from '../prisma/prisma.service';
import { WorkflowService } from '../workflow/workflow.service';
import { NotFoundException } from '@nestjs/common';

describe('DriversService', () => {
  let service: DriversService;

  const mockTx = {
    driver: {
      create: jest.fn(),
      findMany: jest.fn(),
      findFirst: jest.fn(),
      count: jest.fn(),
      update: jest.fn(),
    },
    auditLog: { create: jest.fn() },
  };

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest.fn((companyId: string, cb: (tx: any) => any) =>
      cb(mockTx),
    ),
    updateWithOcc: jest
      .fn()
      .mockResolvedValue({ id: 'mock-id', firstName: 'Johnny' }),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const mockWorkflowService = {
      evaluateRules: jest.fn().mockResolvedValue({ triggeredActions: [] }),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DriversService,
        { provide: AuditService, useValue: { logEvent: jest.fn() } },
        { provide: PrismaService, useValue: mockPrisma },
        { provide: WorkflowService, useValue: mockWorkflowService },
        { provide: EventEmitter2, useValue: { emit: jest.fn() } },
      ],
    }).compile();
    service = module.get<DriversService>(DriversService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a driver with licenseExpiry converted to Date', async () => {
      const dto = {
        firstName: 'John',
        lastName: 'Doe',
        licenseNumber: 'DL-12345',
        phone: '+1234567890',
        licenseExpiry: '2028-01-01',
      };
      const mockDriver = {
        id: 'driver-1',
        companyId: 'company-1',
        ...dto,
        licenseExpiry: new Date('2028-01-01'),
      };
      mockTx.driver.create.mockResolvedValue(mockDriver);

      const result = await service.create('company-1', dto);

      expect(result).toEqual(mockDriver);
      expect(mockTx.driver.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            companyId: 'company-1',
            licenseExpiry: new Date('2028-01-01'),
          }),
        }),
      );
    });

    it('should create a driver without licenseExpiry', async () => {
      const dto = {
        firstName: 'Jane',
        lastName: 'Smith',
        licenseNumber: 'DL-99999',
        phone: '+9999999999',
      };
      const mockDriver = { id: 'driver-2', companyId: 'company-1', ...dto };
      mockTx.driver.create.mockResolvedValue(mockDriver);

      const result = await service.create('company-1', dto);
      expect(result).toEqual(mockDriver);
    });
  });

  describe('findAll', () => {
    it('should return paginated drivers', async () => {
      mockTx.driver.findMany.mockResolvedValue([{ id: 'driver-1' }]);
      mockTx.driver.count.mockResolvedValue(1);

      const result = await service.findAll('company-1', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(1);
      expect(result.meta.total).toBe(1);
    });

    it('should filter by status when provided', async () => {
      mockTx.driver.findMany.mockResolvedValue([]);
      mockTx.driver.count.mockResolvedValue(0);

      await service.findAll('company-1', { status: 'AVAILABLE' });

      expect(mockTx.driver.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            status: 'AVAILABLE',
          }),
        }),
      );
    });

    it('should apply search filter when provided', async () => {
      mockTx.driver.findMany.mockResolvedValue([]);
      mockTx.driver.count.mockResolvedValue(0);

      await service.findAll('company-1', { search: 'john' });

      expect(mockTx.driver.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ OR: expect.any(Array) }),
        }),
      );
    });
  });

  describe('findOne', () => {
    it('should return a driver if found', async () => {
      const mockDriver = { id: 'driver-1', firstName: 'John' };
      mockTx.driver.findFirst.mockResolvedValue(mockDriver);

      const result = await service.findOne('company-1', 'driver-1');
      expect(result).toEqual(mockDriver);
    });

    it('should throw NotFoundException if driver not found', async () => {
      mockTx.driver.findFirst.mockResolvedValue(null);
      await expect(service.findOne('company-1', 'driver-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('remove', () => {
    it('should soft-delete driver and set status to TERMINATED', async () => {
      const mockDriver = {
        id: 'driver-1',
        firstName: 'John',
        status: 'AVAILABLE',
      };
      mockTx.driver.findFirst.mockResolvedValue(mockDriver);
      mockTx.driver.update.mockResolvedValue({
        ...mockDriver,
        deletedAt: new Date(),
        status: 'TERMINATED',
      });

      const result = await service.remove('company-1', 'driver-1');
      expect(result.status).toBe('TERMINATED');
      expect(result.deletedAt).toBeDefined();
    });

    it('should throw NotFoundException if driver not found', async () => {
      mockTx.driver.findFirst.mockResolvedValue(null);
      await expect(service.remove('company-1', 'driver-999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('update', () => {
    it('should update a driver', async () => {
      const existing = { id: 'driver-1', firstName: 'John' };
      const updated = { ...existing, firstName: 'Johnny' };
      mockTx.driver.findFirst.mockResolvedValue(existing);
      mockTx.driver.update.mockResolvedValue(updated);

      const result = await service.update('company-1', 'driver-1', {
        firstName: 'Johnny',
      });
      expect(result.firstName).toBe('Johnny');
    });

    it('should throw NotFoundException if driver not found', async () => {
      mockTx.driver.findFirst.mockResolvedValue(null);
      await expect(
        service.update('company-1', 'driver-999', {} as any),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
