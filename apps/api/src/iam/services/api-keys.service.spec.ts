import { Test, TestingModule } from '@nestjs/testing';
import { ApiKeyService } from './api-keys.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { UnauthorizedException } from '@nestjs/common';

const mockPrisma = {
  runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
  runAsTenant: jest
    .fn()
    .mockImplementation(async (tenantId, cb) => cb(mockPrisma)),
  apiKey: {
    create: jest.fn(),
    findFirst: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockAudit = {
  logEvent: jest.fn(),
};

describe('ApiKeyService', () => {
  let service: ApiKeyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApiKeyService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<ApiKeyService>(ApiKeyService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an API key', async () => {
    mockPrisma.apiKey.create.mockResolvedValue({
      id: 'key-123',
      name: 'Test Key',
      expiresAt: null,
    });

    const result = await service.createApiKey('company-123', 'Test Key');

    expect(result).toHaveProperty('rawKey');
    expect(result.rawKey.startsWith('pk_')).toBe(true);
    expect(mockAudit.logEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        action: 'CREATE',
        entity: 'ApiKey',
      }),
    );
  });

  it('should throw UnauthorizedException if API key is invalid', async () => {
    mockPrisma.apiKey.findFirst.mockResolvedValue(null);
    await expect(service.validateApiKey('pk_invalid')).rejects.toThrow(
      UnauthorizedException,
    );
  });
});
