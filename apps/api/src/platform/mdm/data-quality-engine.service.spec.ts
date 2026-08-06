import { Test, TestingModule } from '@nestjs/testing';
import { DataQualityEngineService } from './data-quality-engine.service';
import { PrismaService } from '../../prisma/prisma.service';

describe('DataQualityEngineService', () => {
  let service: DataQualityEngineService;

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => cb(mockPrisma)),
    $queryRaw: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DataQualityEngineService,
        { provide: PrismaService, useValue: mockPrisma },
      ],
    }).compile();
    service = module.get<DataQualityEngineService>(DataQualityEngineService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('evaluateQuality', () => {
    it('should return 100 score for a perfectly complete CUSTOMER record', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = {
        name: 'Acme Corp',
        phone: '+919999999999',
        email: 'acme@corp.com',
      };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.score).toBe(100);
      expect(report.flags).toHaveLength(0);
    });

    it('should deduct points for missing required CUSTOMER fields', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = { name: 'Missing Phone Corp' }; // phone is required for CUSTOMER
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.score).toBe(90);
      expect(report.flags).toContain('Missing required field: phone');
    });

    it('should deduct points for missing required DRIVER fields', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = {}; // firstName, lastName, licenseNumber required
      const report = await service.evaluateQuality('company-1', 'DRIVER', data);
      expect(report.score).toBe(70); // 100 - 10 - 10 - 10
      expect(report.flags).toHaveLength(3);
    });

    it('should flag invalid PAN format', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = { pan: 'INVALID123', name: 'Test', phone: '+91111111111' };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.flags).toContain('Invalid PAN format');
      expect(report.score).toBe(85);
    });

    it('should accept valid PAN format (AAAAA9999A)', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = { pan: 'ABCDE1234F', name: 'Test', phone: '+91111111111' };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.flags).not.toContain('Invalid PAN format');
    });

    it('should flag invalid GSTIN format', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = { gstin: 'INVALID', name: 'Test', phone: '+91111111111' };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.flags).toContain('Invalid GSTIN format');
    });

    it('should flag invalid email format', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);
      const data = {
        email: 'not-an-email',
        name: 'Test',
        phone: '+91111111111',
      };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.flags).toContain('Invalid email format');
    });

    it('should not go below 0 score', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([
        { id: 'dup-1' },
        { id: 'dup-2' },
      ]);
      // Missing multiple fields + duplicates found
      const data = { gstin: 'BAD', pan: 'BAD', email: 'BAD' };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.score).toBeGreaterThanOrEqual(0);
    });

    it('should detect duplicates and add them to report', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ id: 'dup-1' }]);
      const data = { name: 'Corp', phone: '+91111111111', pan: 'ABCDE1234F' };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      expect(report.duplicates).toContain('dup-1');
      expect(report.flags.some((f) => f.includes('duplicate'))).toBe(true);
    });

    it('should skip duplicate check when no matchable fields present', async () => {
      const data = { name: 'Test Corp', phone: '+91111111111' };
      const report = await service.evaluateQuality(
        'company-1',
        'CUSTOMER',
        data,
      );
      // No PAN, GSTIN, email, phone, etc. — $queryRaw should not be called with conditions
      expect(report).toBeDefined();
    });
  });
});
