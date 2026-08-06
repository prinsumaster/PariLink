import { Test, TestingModule } from '@nestjs/testing';
import { MfaService } from './mfa.service';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityContextService } from '../platform/security/security.service';
import { AuditService } from '../platform/audit/audit.service';
import { authenticator } from 'otplib';

describe('MfaService', () => {
  let service: MfaService;
  let prismaService: PrismaService;
  let securityService: SecurityContextService;
  let auditService: AuditService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MfaService,
        {
          provide: PrismaService,
          useValue: {
            runAsSystem: jest.fn().mockImplementation(async function (cb) {
              return await cb(this);
            }),
            runAsTenant: jest.fn().mockImplementation(async function (t, cb) {
              return await cb(this);
            }),
            user: {
              findUnique: jest.fn(),
              update: jest.fn(),
            },
            backupCode: {
              create: jest.fn(),
              findMany: jest.fn(),
              update: jest.fn(),
            },
          },
        },
        {
          provide: SecurityContextService,
          useValue: {
            encryptSecret: jest
              .fn()
              .mockImplementation((val) => `encrypted_${val}`),
            decryptSecret: jest
              .fn()
              .mockImplementation((val) => val.replace('encrypted_', '')),
          },
        },
        {
          provide: AuditService,
          useValue: {
            logEvent: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<MfaService>(MfaService);
    prismaService = module.get<PrismaService>(PrismaService);
    securityService = module.get<SecurityContextService>(
      SecurityContextService,
    );
    auditService = module.get<AuditService>(AuditService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('generateTotpSecret', () => {
    it('should generate a secret and qr code', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue({ id: 'user1', mfaEnabled: false } as any);
      const result = await service.generateTotpSecret('user1', 'test@test.com');

      expect(result).toHaveProperty('secret');
      expect(result).toHaveProperty('qrCodeDataUrl');
      // eslint-disable-next-line @typescript-eslint/unbound-method
      expect(prismaService.user.update).toHaveBeenCalled();
    });

    it('should throw if MFA is already enabled', async () => {
      jest
        .spyOn(prismaService.user, 'findUnique')
        .mockResolvedValue({ id: 'user1', mfaEnabled: true } as any);
      await expect(
        service.generateTotpSecret('user1', 'test@test.com'),
      ).rejects.toThrow('MFA is already enabled');
    });
  });

  describe('verifyTotp', () => {
    it('should return true for valid token', async () => {
      const secret = authenticator.generateSecret();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'user1',
        totpSecret: `encrypted_${secret}`,
      } as any);

      const token = authenticator.generate(secret);
      const result = await service.verifyTotp('user1', token);
      expect(result).toBe(true);
    });

    it('should throw for invalid token', async () => {
      const secret = authenticator.generateSecret();
      jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue({
        id: 'user1',
        totpSecret: `encrypted_${secret}`,
      } as any);

      await expect(service.verifyTotp('user1', '000000')).rejects.toThrow(
        'Invalid TOTP token',
      );
    });
  });
});
