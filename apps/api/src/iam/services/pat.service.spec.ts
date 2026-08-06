import { Test, TestingModule } from '@nestjs/testing';
import { PatService } from './pat.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { UnauthorizedException } from '@nestjs/common';

const mockPrisma = {
  runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
  runAsTenant: jest
    .fn()
    .mockImplementation(async (tenantId, cb) => cb(mockPrisma)),
  personalAccessToken: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockAudit = {
  logEvent: jest.fn(),
};

describe('PatService', () => {
  let service: PatService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<PatService>(PatService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a PAT', async () => {
    mockPrisma.personalAccessToken.create.mockResolvedValue({
      id: 'pat-123',
      name: 'Test PAT',
      expiresAt: null,
    });

    const result = await service.createPat(
      'user-123',
      'company-123',
      'Test PAT',
    );

    expect(result).toHaveProperty('rawToken');
    expect(result.rawToken.startsWith('pat_')).toBe(true);
  });

  it('should throw UnauthorizedException if PAT is invalid', async () => {
    mockPrisma.personalAccessToken.findFirst.mockResolvedValue(null);
    await expect(service.validatePat('pat_invalid')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
