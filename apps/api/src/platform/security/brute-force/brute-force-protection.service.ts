import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisManagerService } from '../../../common/redis/redis-manager.service';

// ---------------------------------------------------------------------------
// Enterprise Brute-Force Tracker (Redis-backed)
//
// Implements OWASP ASVS 2.2.1 policies:
//   • 5 failed attempts within 15 minutes → account temporarily locked
//   • 10 failed attempts within 15 minutes → account locked until admin reset
// ---------------------------------------------------------------------------

interface LoginAttempt {
  count: number;
  firstAttemptAt: number;
  lockedUntil?: number;
  permanentLock: boolean;
}

export interface LoginAttemptResult {
  allowed: boolean;
  remainingAttempts?: number;
  lockedUntil?: Date;
  permanentlyLocked?: boolean;
}

@Injectable()
export class BruteForceProtectionService implements OnModuleDestroy {
  private readonly logger = new Logger(BruteForceProtectionService.name);

  private readonly store = new Map<string, LoginAttempt>();
  private readonly redis: Redis | null = null;
  private useRedis = false;

  private readonly MAX_ATTEMPTS_SOFT = 5;
  private readonly MAX_ATTEMPTS_HARD = 10;
  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly SOFT_LOCK_DURATION_MS = 15 * 60 * 1000; // 15 minutes

  constructor(private readonly redisManager: RedisManagerService) {
    this.redis = this.redisManager.getClient();
    this.useRedis = true; // Assume true since RedisManager handles connections
  }

  async onModuleDestroy() {
    // Rely on RedisManagerService to close the pool
  }

  private async getRecord(key: string): Promise<LoginAttempt | undefined> {
    if (this.useRedis && this.redis) {
      const data = await this.redis.get(`bf:${key}`);
      return data ? JSON.parse(data) : undefined;
    }
    return this.store.get(key);
  }

  private async setRecord(
    key: string,
    record: LoginAttempt,
    ttlMs: number,
  ): Promise<void> {
    if (this.useRedis && this.redis) {
      // If permanently locked, we can store it for a long time (e.g., 30 days) or indefinitely,
      // but let's just use 30 days so we don't leak memory forever.
      const ttl = record.permanentLock
        ? 30 * 24 * 60 * 60
        : Math.ceil(ttlMs / 1000);
      await this.redis.set(`bf:${key}`, JSON.stringify(record), 'EX', ttl);
    } else {
      this.store.set(key, record);
    }
  }

  private async deleteRecord(key: string): Promise<void> {
    if (this.useRedis && this.redis) {
      await this.redis.del(`bf:${key}`);
    } else {
      this.store.delete(key);
    }
  }

  async checkLoginAttempt(
    email: string,
    ipAddress?: string,
  ): Promise<LoginAttemptResult> {
    const key = email.toLowerCase();
    const now = Date.now();
    const record = await this.getRecord(key);

    if (!record) {
      return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS_SOFT };
    }

    // Check permanent lock
    if (record.permanentLock) {
      return { allowed: false, permanentlyLocked: true };
    }

    // Check soft lock
    if (record.lockedUntil && now < record.lockedUntil) {
      return { allowed: false, lockedUntil: new Date(record.lockedUntil) };
    }

    // Sliding window: reset if window has expired
    if (now - record.firstAttemptAt > this.WINDOW_MS) {
      await this.deleteRecord(key);
      return { allowed: true, remainingAttempts: this.MAX_ATTEMPTS_SOFT };
    }

    const remaining = this.MAX_ATTEMPTS_SOFT - record.count;
    return {
      allowed: true,
      remainingAttempts: Math.max(0, remaining),
    };
  }

  async recordFailedAttempt(
    email: string,
    ipAddress?: string,
  ): Promise<LoginAttemptResult> {
    const key = email.toLowerCase();
    const now = Date.now();
    const existing = await this.getRecord(key);

    let record: LoginAttempt;
    if (!existing || now - existing.firstAttemptAt > this.WINDOW_MS) {
      record = { count: 1, firstAttemptAt: now, permanentLock: false };
    } else {
      record = { ...existing, count: existing.count + 1 };
    }

    if (record.count >= this.MAX_ATTEMPTS_HARD) {
      record.permanentLock = true;
      this.logger.warn(
        `[BruteForce] HARD LOCK triggered for ${key} after ${record.count} attempts — requires admin reset`,
      );
      await this.setRecord(key, record, this.WINDOW_MS);
      return { allowed: false, permanentlyLocked: true };
    }

    if (record.count >= this.MAX_ATTEMPTS_SOFT) {
      record.lockedUntil = now + this.SOFT_LOCK_DURATION_MS;
      this.logger.warn(
        `[BruteForce] SOFT LOCK triggered for ${key} until ${new Date(record.lockedUntil).toISOString()}`,
      );
      // TTL should cover the lock duration
      await this.setRecord(key, record, this.SOFT_LOCK_DURATION_MS);
      return { allowed: false, lockedUntil: new Date(record.lockedUntil) };
    }

    await this.setRecord(key, record, this.WINDOW_MS);
    return {
      allowed: true,
      remainingAttempts: this.MAX_ATTEMPTS_SOFT - record.count,
    };
  }

  async recordSuccessfulLogin(email: string): Promise<void> {
    await this.deleteRecord(email.toLowerCase());
  }

  async adminUnlock(email: string): Promise<void> {
    await this.deleteRecord(email.toLowerCase());
    this.logger.log(`[BruteForce] Admin unlocked account for ${email}`);
  }

  async isAccountLocked(email: string): Promise<boolean> {
    const record = await this.getRecord(email.toLowerCase());
    if (!record) return false;
    if (record.permanentLock) return true;
    if (record.lockedUntil && Date.now() < record.lockedUntil) return true;
    return false;
  }
}
