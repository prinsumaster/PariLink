import {
  Injectable,
  NestMiddleware,
  Logger,
  HttpStatus,
  OnModuleDestroy,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../../audit/audit.service';
import { RedisManagerService } from '../../../common/redis/redis-manager.service';
import { Redis } from 'ioredis';

// ---------------------------------------------------------------------------
// API Gateway Rate Limiter — Enterprise (Redis-backed)
//
// Limits enforced (in order, highest priority first):
//   1. IP Block List — hard reject
//   2. Idempotency Key replay detection (TTL: 24h)
//   3. Burst Protection — max requests per second
//   4. Per-Tenant Quota — max requests per minute
// ---------------------------------------------------------------------------

// IP addresses that are blocked globally (loaded from env or DB at startup)
const BLOCKED_IPS = new Set<string>(
  (process.env.BLOCKED_IPS || '').split(',').filter(Boolean),
);

@Injectable()
export class ApiRateLimiterMiddleware
  implements NestMiddleware, OnModuleDestroy
{
  private readonly logger = new Logger(ApiRateLimiterMiddleware.name);

  // Defaults — overridden per-tenant by TenantConfig.apiRateLimit
  private readonly DEFAULT_RPM = 1000; // requests per minute
  private readonly BURST_RPS = 20; // requests per second burst cap
  private readonly WINDOW_S = 60; // 1 minute
  private readonly BURST_WINDOW_S = 1; // 1 second

  private readonly redis: Redis | null = null;
  private useRedis = false;

  // Memory fallbacks for dev environments without Redis
  private readonly fallbackMinuteBuckets = new Map<
    string,
    { count: number; windowStart: number }
  >();
  private readonly fallbackBurstBuckets = new Map<
    string,
    { count: number; windowStart: number }
  >();
  private readonly fallbackIdempotencyStore = new Map<string, number>();

  constructor(
    private readonly audit: AuditService,
    private readonly redisManager: RedisManagerService,
  ) {
    this.redis = this.redisManager.getClient();
    this.useRedis = true; // Handled by RedisManager
  }

  onModuleDestroy() {
    // Rely on RedisManagerService to close the pool
  }

  async use(req: Request, res: Response, next: NextFunction): Promise<void> {
    const ip = this.extractIp(req);
    const tenantId: string =
      (req as any).user?.companyId ??
      (req.headers['x-tenant-id'] as string) ??
      'anonymous';
    const idempotencyKey = req.headers['x-idempotency-key'] as
      string | undefined;

    // 1. IP Block List
    if (BLOCKED_IPS.has(ip)) {
      this.logger.warn(`[Gateway] Blocked IP attempted access: ${ip}`);
      res.status(HttpStatus.FORBIDDEN).json({ message: 'Access denied' });
      return;
    }

    // 2. Idempotency replay protection (POST/PUT/PATCH only)
    if (idempotencyKey && ['POST', 'PUT', 'PATCH'].includes(req.method)) {
      const replayKey = `idem:${tenantId}:${idempotencyKey}`;
      const isReplay = await this.checkIdempotency(replayKey);
      if (isReplay) {
        res.status(HttpStatus.CONFLICT).json({
          message: 'Duplicate request detected (idempotency key already used)',
          idempotencyKey,
        });
        return;
      }
    }

    // Determine limits
    let rpmLimit = this.getTenantLimit(req);
    let burstRps = this.BURST_RPS;

    const path = req.originalUrl || req.url;
    let category = 'general';
    if (path.includes('/api/v1/auth')) {
      rpmLimit = 500;
      burstRps = 100;
      category = 'auth';
    } else if (path.includes('/api/v1/webhooks')) {
      rpmLimit = 50;
      burstRps = 5;
      category = 'webhooks';
    } else if (path.includes('/api/v1/ai')) {
      rpmLimit = 200;
      burstRps = 30;
      category = 'ai';
    } else {
      // General limits for all other routes
      rpmLimit = 3000;
      burstRps = 500;
    }

    // 3. Burst protection (per-second)
    const burstKey = `burst:${category}:${tenantId}:${ip}`;
    const burstAllowed = await this.checkLimit(
      burstKey,
      burstRps,
      this.BURST_WINDOW_S,
      this.fallbackBurstBuckets,
    );
    if (!burstAllowed.allowed) {
      res.setHeader('Retry-After', '1');
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        message: 'Burst limit exceeded. Please reduce request rate.',
      });
      return;
    }

    // 4. Per-minute rate limit
    const minuteKey = `rpm:${category}:${tenantId}:${ip}`;
    const minuteLimit = await this.checkLimit(
      minuteKey,
      rpmLimit,
      this.WINDOW_S,
      this.fallbackMinuteBuckets,
    );

    res.setHeader('X-RateLimit-Limit', rpmLimit);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, minuteLimit.remaining));
    res.setHeader('X-RateLimit-Reset', Math.floor(minuteLimit.resetAt / 1000));

    if (!minuteLimit.allowed) {
      const retryAfter = Math.ceil((minuteLimit.resetAt - Date.now()) / 1000);
      res.setHeader('Retry-After', retryAfter);
      this.audit
        .logEvent({
          action: 'RATE_LIMIT_EXCEEDED',
          entity: 'ApiGateway',
          entityId: tenantId,
          companyId:
            tenantId === 'anonymous' || tenantId === 'system'
              ? 'SYSTEM'
              : tenantId,
          source: 'API_GATEWAY',
          details: { ip, path: req.url, limit: rpmLimit },
        })
        .catch(() => {});
      res.status(HttpStatus.TOO_MANY_REQUESTS).json({
        message: 'Rate limit exceeded. Please wait before retrying.',
        retryAfter,
      });
      return;
    }

    next();
  }

  private getTenantLimit(req: Request): number {
    const headerLimit = req.headers['x-rate-limit-override'];
    if (headerLimit && !isNaN(Number(headerLimit))) return Number(headerLimit);
    return this.DEFAULT_RPM;
  }

  private async checkIdempotency(key: string): Promise<boolean> {
    if (this.useRedis && this.redis) {
      // SETNX returns 1 if key was set, 0 if it already existed
      const result = await this.redis.set(key, '1', 'EX', 86400, 'NX');
      return result !== 'OK';
    } else {
      const TTL_24H = Date.now() + 86_400_000;
      if (this.fallbackIdempotencyStore.has(key)) {
        if (this.fallbackIdempotencyStore.get(key)! > Date.now()) {
          return true;
        }
      }
      this.fallbackIdempotencyStore.set(key, TTL_24H);
      return false;
    }
  }

  private async checkLimit(
    key: string,
    limit: number,
    windowSeconds: number,
    fallbackMap: Map<string, { count: number; windowStart: number }>,
  ): Promise<{ allowed: boolean; remaining: number; resetAt: number }> {
    if (this.useRedis && this.redis) {
      // Redis INCR / EXPIRE pattern via pipeline for atomicity
      const current = Date.now();

      // Try to increment. If it doesn't exist, it's created at 0, then incremented to 1.
      const multi = this.redis.multi();
      multi.incr(key);
      multi.pttl(key);

      const results = await multi.exec();
      if (!results)
        return {
          allowed: true,
          remaining: limit - 1,
          resetAt: current + windowSeconds * 1000,
        };

      const count = results[0][1] as number;
      let ttl = results[1][1] as number;

      if (ttl === -1 || ttl === -2) {
        // Set expiry if missing or new
        await this.redis.expire(key, windowSeconds);
        ttl = windowSeconds * 1000;
      }

      return {
        allowed: count <= limit,
        remaining: limit - count,
        resetAt: current + ttl,
      };
    } else {
      // Fallback memory implementation
      const now = Date.now();
      const bucket = fallbackMap.get(key);

      if (!bucket || now - bucket.windowStart >= windowSeconds * 1000) {
        fallbackMap.set(key, { count: 1, windowStart: now });
        return {
          allowed: true,
          remaining: limit - 1,
          resetAt: now + windowSeconds * 1000,
        };
      }

      bucket.count++;
      const remaining = limit - bucket.count;
      const resetAt = bucket.windowStart + windowSeconds * 1000;

      return { allowed: bucket.count <= limit, remaining, resetAt };
    }
  }

  private extractIp(req: Request): string {
    return (
      (req.headers['x-forwarded-for'] as string)?.split(',')[0]?.trim() ??
      req.socket.remoteAddress ??
      'unknown'
    );
  }
}
