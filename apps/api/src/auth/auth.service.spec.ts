import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedException } from '@nestjs/common';
import { BruteForceProtectionService } from '../platform/security/brute-force/brute-force-protection.service';
import { AuditService } from '../platform/audit/audit.service';
import { MfaService } from './mfa.service';
import * as bcrypt from 'bcryptjs';

jest.mock('bcryptjs', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;

  const mockPrismaService = {
    runAsSystem: jest
      .fn()
      .mockImplementation(async (cb) => cb(mockPrismaService)),
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => cb(mockPrismaService)),
    user: {
      findUnique: jest.fn(),
    },
    refreshToken: {
      create: jest.fn(),
      findUnique: jest.fn(),
      findMany: jest.fn().mockResolvedValue([]),
      delete: jest.fn(),
      deleteMany: jest.fn(),
    },
  };

  const mockJwtService = {
    signAsync: jest.fn(),
    verifyAsync: jest.fn(),
  };

  const mockBruteForceProtectionService = {
    checkLoginAttempt: jest.fn().mockReturnValue({ allowed: true }),
    recordSuccessfulLogin: jest.fn(),
    recordFailedAttempt: jest.fn(),
  };

  const mockAuditService = {
    logEvent: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: JwtService, useValue: mockJwtService },
        {
          provide: BruteForceProtectionService,
          useValue: mockBruteForceProtectionService,
        },
        { provide: AuditService, useValue: mockAuditService },
        {
          provide: MfaService,
          useValue: {
            verifyBackupCode: jest.fn(),
            verifyTotp: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('login', () => {
    it('should throw UnauthorizedException if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);

      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow('Invalid credentials');
    });

    it('should throw UnauthorizedException if user is inactive', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashedpassword',
        status: 'SUSPENDED',
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should throw UnauthorizedException if user is deleted', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashedpassword',
        status: 'ACTIVE',
        deletedAt: new Date(),
      });

      await expect(
        service.login({ email: 'test@test.com', password: 'password' }),
      ).rejects.toThrow(new UnauthorizedException('Invalid credentials'));
    });

    it('should return tokens if credentials are valid and user is active', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue({
        id: '1',
        email: 'test@test.com',
        password: 'hashedpassword',
        status: 'ACTIVE',
      });

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('mock-token');

      const result = await service.login({
        email: 'test@test.com',
        password: 'password',
      });

      expect(result.access_token).toBe('mock-token');
      expect(result.refresh_token).toEqual(expect.any(String));
      expect(result.user?.id).toBe('1');
    });
  });

  describe('refreshToken', () => {
    it('should throw if user is inactive when refreshing', async () => {
      mockPrismaService.refreshToken.findUnique.mockResolvedValue({
        id: 'token-id',
        familyId: 'family-id',
        token: 'refresh-token',
        expiresAt: new Date(Date.now() + 100000),
        user: {
          id: '1',
          status: 'SUSPENDED',
        },
      });

      await expect(service.refreshToken('refresh-token')).rejects.toThrow(
        new UnauthorizedException('User account is inactive'),
      );

      expect(mockPrismaService.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { familyId: 'family-id' },
      });
    });
  });
});
