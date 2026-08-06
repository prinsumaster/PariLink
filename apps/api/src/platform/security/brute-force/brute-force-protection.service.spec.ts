import { BruteForceProtectionService } from './brute-force-protection.service';

describe('BruteForceProtectionService', () => {
  let service: BruteForceProtectionService;

  const mockRedisManager = {
    getClient: jest.fn().mockReturnValue(null),
  } as any;

  beforeEach(() => {
    service = new BruteForceProtectionService(mockRedisManager);
  });

  afterEach(async () => {
    await service.onModuleDestroy();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('checkLoginAttempt', () => {
    it('should allow first attempt (no record)', async () => {
      const result = await service.checkLoginAttempt('user@test.com');
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(5);
    });

    it('should allow attempt after recording fewer than 5 failures', async () => {
      await service.recordFailedAttempt('user@test.com');
      await service.recordFailedAttempt('user@test.com');
      const result = await service.checkLoginAttempt('user@test.com');
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(3);
    });
  });

  describe('recordFailedAttempt', () => {
    it('should apply a SOFT LOCK after 5 failed attempts', async () => {
      for (let i = 0; i < 5; i++) {
        await service.recordFailedAttempt('user@lock.com');
      }
      const result = await service.checkLoginAttempt('user@lock.com');
      expect(result.allowed).toBe(false);
      expect(result.lockedUntil).toBeDefined();
      expect(result.permanentlyLocked).toBeUndefined();
    });

    it('should apply a PERMANENT LOCK after 10 failed attempts', async () => {
      for (let i = 0; i < 10; i++) {
        await service.recordFailedAttempt('user@hardlock.com');
      }
      const result = await service.checkLoginAttempt('user@hardlock.com');
      expect(result.allowed).toBe(false);
      expect(result.permanentlyLocked).toBe(true);
    });

    it('should be case-insensitive on email', async () => {
      await service.recordFailedAttempt('User@Test.com');
      await service.recordFailedAttempt('USER@TEST.COM');
      const result = await service.checkLoginAttempt('user@test.com');
      expect(result.remainingAttempts).toBe(3);
    });
  });

  describe('recordSuccessfulLogin', () => {
    it('should clear failed attempt record on successful login', async () => {
      await service.recordFailedAttempt('user@clear.com');
      await service.recordFailedAttempt('user@clear.com');
      await service.recordSuccessfulLogin('user@clear.com');

      const result = await service.checkLoginAttempt('user@clear.com');
      expect(result.allowed).toBe(true);
      expect(result.remainingAttempts).toBe(5);
    });
  });

  describe('adminUnlock', () => {
    it('should clear a permanent lock', async () => {
      for (let i = 0; i < 10; i++) {
        await service.recordFailedAttempt('user@admin.com');
      }
      await service.adminUnlock('user@admin.com');
      const result = await service.checkLoginAttempt('user@admin.com');
      expect(result.allowed).toBe(true);
    });
  });

  describe('isAccountLocked', () => {
    it('should return false for unknown user', async () => {
      expect(await service.isAccountLocked('unknown@user.com')).toBe(false);
    });

    it('should return true for permanently locked account', async () => {
      for (let i = 0; i < 10; i++) {
        await service.recordFailedAttempt('user@perm.com');
      }
      expect(await service.isAccountLocked('user@perm.com')).toBe(true);
    });

    it('should return true for soft-locked account within window', async () => {
      for (let i = 0; i < 5; i++) {
        await service.recordFailedAttempt('user@soft.com');
      }
      expect(await service.isAccountLocked('user@soft.com')).toBe(true);
    });
  });
});
