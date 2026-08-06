import { Test, TestingModule } from '@nestjs/testing';
import { OAuth2Service } from './oauth2.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';

import { UnauthorizedException } from '@nestjs/common';

const mockPrisma = {
  runAsSystem: jest.fn().mockImplementation(async (cb) => cb(mockPrisma)),
  runAsTenant: jest
    .fn()
    .mockImplementation(async (tenantId, cb) => cb(mockPrisma)),
  oAuthClient: {
    create: jest.fn(),
    findFirst: jest.fn(),
  },
  oAuthToken: {
    create: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
};

const mockAudit = {
  logEvent: jest.fn(),
};

describe('OAuth2Service', () => {
  let service: OAuth2Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OAuth2Service,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    service = module.get<OAuth2Service>(OAuth2Service);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should register a client', async () => {
    mockPrisma.oAuthClient.create.mockResolvedValue({
      id: 'client-123',
      name: 'Test Client',
    });

    const result = await service.registerClient('company-123', 'Test Client');
    expect(result.clientId).toBeDefined();
    expect(result.clientSecret).toBeDefined();
  });

  it('should throw if issue token fails', async () => {
    mockPrisma.oAuthClient.findFirst.mockResolvedValue(null);
    await expect(
      service.issueClientCredentialsToken('id', 'secret'),
    ).rejects.toThrow(UnauthorizedException);
  });
});
