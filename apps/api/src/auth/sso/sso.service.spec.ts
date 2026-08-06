/* eslint-disable @typescript-eslint/no-explicit-any */
import { Test, TestingModule } from '@nestjs/testing';
import { SsoService } from './sso.service';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';
import { OidcService } from './oidc.service';
import { SamlService } from './saml.service';
import { AuditService } from '../../platform/audit/audit.service';
import { BadRequestException } from '@nestjs/common';

describe('SsoService', () => {
  let service: SsoService;
  let prisma: any;
  let authService: any;
  let oidcService: any;
  let samlService: any;

  beforeEach(async () => {
    prisma = {
      runAsSystem: jest.fn().mockImplementation(async (cb) => await cb(prisma)),
      identityProvider: {
        findUnique: jest.fn(),
        findMany: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      userIdentity: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      user: {
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
      },
      ssoSession: {
        upsert: jest.fn(),
      },
      auditLog: {
        create: jest.fn().mockResolvedValue({}),
      },
    };

    authService = {
      issueTokensAfterLogin: jest
        .fn()
        .mockResolvedValue({ access_token: 'mock-token' }),
    };

    oidcService = {
      generateLoginUrl: jest
        .fn()
        .mockResolvedValue('http://mock-idp.com/login'),
      validateCallback: jest.fn(),
    };

    samlService = {
      generateLoginUrl: jest
        .fn()
        .mockResolvedValue('http://mock-saml.com/login'),
      validateResponse: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SsoService,
        { provide: AuditService, useValue: { logEvent: jest.fn() } },
        { provide: PrismaService, useValue: prisma },
        { provide: AuthService, useValue: authService },
        { provide: OidcService, useValue: oidcService },
        { provide: SamlService, useValue: samlService },
      ],
    }).compile();

    service = module.get<SsoService>(SsoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateLoginUrl', () => {
    it('should generate OIDC URL', async () => {
      prisma.identityProvider.findUnique.mockResolvedValue({
        type: 'OIDC',
        status: 'ACTIVE',
      });
      const url = await service.generateLoginUrl('id', {} as any);
      expect(url).toBe('http://mock-idp.com/login');
    });

    it('should generate SAML URL', async () => {
      prisma.identityProvider.findUnique.mockResolvedValue({
        type: 'SAML',
        status: 'ACTIVE',
      });
      const url = await service.generateLoginUrl('id', {} as any);
      expect(url).toBe('http://mock-saml.com/login');
    });

    it('should throw if IdP not found', async () => {
      prisma.identityProvider.findUnique.mockResolvedValue(null);
      await expect(service.generateLoginUrl('id', {} as any)).rejects.toThrow();
    });
  });

  describe('JIT Provisioning', () => {
    it('should provision user if JIT enabled and domains match', async () => {
      const mockIdp = {
        id: 'idp1',
        companyId: 'comp1',
        status: 'ACTIVE',
        jitEnabled: true,
        domainValidation: 'example.com',
      };

      const mockProfile = {
        id: 'ext-user-1',
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
      };

      prisma.identityProvider.findUnique.mockResolvedValue(mockIdp);
      prisma.userIdentity.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);

      prisma.user.create.mockResolvedValue({
        id: 'u1',
        email: 'test@example.com',
        status: 'ACTIVE',
        companyId: 'comp1',
      });
      prisma.userIdentity.create.mockResolvedValue({
        id: 'ui1',
        user: { id: 'u1', status: 'ACTIVE', companyId: 'comp1' },
      });

      oidcService.validateCallback.mockResolvedValue(mockProfile);

      const reqMock = { headers: {} } as any;
      const result = await service.handleOidcCallback('idp1', {}, reqMock);

      expect(prisma.user.create).toHaveBeenCalled();
      expect(result.access_token).toBe('mock-token');
    });

    it('should reject JIT if domain does not match', async () => {
      const mockIdp = {
        id: 'idp1',
        companyId: 'comp1',
        status: 'ACTIVE',
        jitEnabled: true,
        domainValidation: 'acme.com',
      };

      const mockProfile = {
        id: 'ext-user-1',
        email: 'test@example.com',
      };

      prisma.identityProvider.findUnique.mockResolvedValue(mockIdp);
      prisma.userIdentity.findUnique.mockResolvedValue(null);
      prisma.user.findUnique.mockResolvedValue(null);
      oidcService.validateCallback.mockResolvedValue(mockProfile);

      await expect(
        service.handleOidcCallback('idp1', {}, {} as any),
      ).rejects.toThrow(BadRequestException);
    });
  });
});
