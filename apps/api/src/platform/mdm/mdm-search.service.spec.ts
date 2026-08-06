import { Test, TestingModule } from '@nestjs/testing';
import { MdmSearchService } from './mdm-search.service';
import { PrismaService } from '../../prisma/prisma.service';
import { IamPolicyEngineService } from '../iam/iam-policy-engine.service';

describe('MdmSearchService', () => {
  let service: MdmSearchService;

  const mockPrisma = {
    runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => cb(mockPrisma)),
    $queryRaw: jest.fn(),
  };

  const mockIam = {};

  beforeEach(async () => {
    jest.clearAllMocks();
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MdmSearchService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: IamPolicyEngineService, useValue: mockIam },
      ],
    }).compile();
    service = module.get<MdmSearchService>(MdmSearchService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('searchMasterRecords - SQL Injection Protection', () => {
    it('should build a parameterized query without entityType', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([{ id: 'rec-1' }]);

      await service.searchMasterRecords({
        companyId: 'company-1',
        query: 'test',
      });

      // Verify $queryRaw was called with params
      const args = mockPrisma.$queryRaw.mock.calls[0];
      const whereObj = args[1]; // The first interpolated value is the `where` Prisma.sql object
      const queryStr = whereObj.strings ? whereObj.strings.join('?') : '';
      const params = whereObj.values || [];
      expect(typeof queryStr).toBe('string');
      // entityType should NOT appear as a string literal in the query if not provided
      expect(queryStr).not.toContain('entityType =');
      // Params must contain the companyId and the search term
      expect(params).toContain('company-1');
      expect(params).toContain('%test%');
    });

    it('should pass entityType as a parameter, not as a raw string injection', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      // This simulates an injection attempt in entityType
      const maliciousEntityType = "CUSTOMER' OR '1'='1";
      await service.searchMasterRecords({
        companyId: 'company-1',
        query: 'test',
        entityType: maliciousEntityType,
      });

      const args = mockPrisma.$queryRaw.mock.calls[0];
      const whereObj = args[1];
      const queryStr = whereObj.strings ? whereObj.strings.join('?') : '';
      const params = whereObj.values || [];
      // The malicious string should appear as a PARAMETER, not embedded in the SQL
      expect(params).toContain(maliciousEntityType);
      // The raw SQL query string should only reference it by placeholder ($3, $4, etc.)
      expect(queryStr).not.toContain(maliciousEntityType);
    });

    it('should return empty array if query throws', async () => {
      mockPrisma.$queryRaw.mockRejectedValue(new Error('DB Error'));

      const result = await service.searchMasterRecords({
        companyId: 'company-1',
        query: 'test',
      });

      expect(result).toEqual([]);
    });

    it('should apply default limit and offset', async () => {
      mockPrisma.$queryRaw.mockResolvedValue([]);

      await service.searchMasterRecords({ companyId: 'company-1', query: 'x' });

      const args = mockPrisma.$queryRaw.mock.calls[0];
      // Limit and offset are passed as the 2nd and 3rd interpolated values
      expect(args[2]).toBe(50);
      expect(args[3]).toBe(0);
    });
  });

  describe('semanticSearch', () => {
    it('should return empty array (stub)', async () => {
      const result = await service.semanticSearch('company-1', 'some query');
      expect(result).toEqual([]);
    });
  });
});
