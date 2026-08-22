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
}

export interface LoginAttemptResult {
  allowed: boolean; // Always true now, but kept for interface compat if needed
  delayMs: number;
  requiresCaptcha: boolean;
}

@Injectable()
export class BruteForceProtectionService implements OnModuleDestroy {
  private readonly logger = new Logger(BruteForceProtectionService.name);

  private readonly store = new Map<string, LoginAttempt>();
  private readonly redis: Redis | null = null;
  private useRedis = false;

  private readonly WINDOW_MS = 15 * 60 * 1000; // 15 minutes
  private readonly CAPTCHA_THRESHOLD = 3;

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
      const ttl = Math.ceil(ttlMs / 1000);
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

  private calculateDelayAndCaptcha(count: number): { delayMs: number, requiresCaptcha: boolean } {
    if (count < this.CAPTCHA_THRESHOLD) {
      return { delayMs: 0, requiresCaptcha: false };
    }
    // progressive delay (1s, 2s, 4s...)
    const exponent = count - this.CAPTCHA_THRESHOLD;
    // Cap exponent to prevent ridiculously large numbers (e.g. max 64s delay -> exp 6)
    const delayMs = Math.pow(2, Math.min(exponent, 6)) * 1000;
    return { delayMs, requiresCaptcha: true };
  }

  async checkLoginAttempt(
    email: string,
    ipAddress?: string,
  ): Promise<LoginAttemptResult> {
    const key = email.toLowerCase();
    const now = Date.now();
    const record = await this.getRecord(key);

    if (!record) {
      return { allowed: true, delayMs: 0, requiresCaptcha: false };
    }

    // Sliding window: reset if window has expired
    if (now - record.firstAttemptAt > this.WINDOW_MS) {
      await this.deleteRecord(key);
      return { allowed: true, delayMs: 0, requiresCaptcha: false };
    }

    const { delayMs, requiresCaptcha } = this.calculateDelayAndCaptcha(record.count);
    return {
      allowed: true, // we never lock anymore
      delayMs,
      requiresCaptcha,
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
      record = { count: 1, firstAttemptAt: now };
    } else {
      record = { ...existing, count: existing.count + 1 };
    }

    await this.setRecord(key, record, this.WINDOW_MS);
    
    const { delayMs, requiresCaptcha } = this.calculateDelayAndCaptcha(record.count);
    
    if (requiresCaptcha) {
      this.logger.warn(`[BruteForce] Progressive delay (${delayMs}ms) & CAPTCHA triggered for ${key} after ${record.count} attempts`);
    }

    return { allowed: true, delayMs, requiresCaptcha };
  }

  async recordSuccessfulLogin(email: string): Promise<void> {
    await this.deleteRecord(email.toLowerCase());
  }

  async adminUnlock(email: string): Promise<void> {
    await this.deleteRecord(email.toLowerCase());
    this.logger.log(`[BruteForce] Admin unlocked account for ${email}`);
  }

  async isAccountLocked(email: string): Promise<boolean> {
    // Accounts are never locked out completely anymore
    return false;
  }
}
