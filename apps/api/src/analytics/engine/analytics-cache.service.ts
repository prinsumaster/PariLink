import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisManagerService } from '../../common/redis/redis-manager.service';

@Injectable()
export class AnalyticsCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(AnalyticsCacheService.name);
  private redis: Redis;

  constructor(private readonly redisManager: RedisManagerService) {
    this.redis = this.redisManager.getClient();
  }

  async onModuleDestroy() {
    // Rely on RedisManagerService to close the pool
  }

  async getCachedMetric(key: string): Promise<any | null> {
    try {
      const data = await this.redis.get(key);
      if (data) return JSON.parse(data);
    } catch (e) {
      this.logger.warn(`Cache GET failed for ${key}`);
    }
    return null;
  }

  async setCachedMetric(
    key: string,
    value: any,
    ttlSeconds: number = 300,
  ): Promise<void> {
    try {
      await this.redis.set(key, JSON.stringify(value), 'EX', ttlSeconds);
    } catch (e) {
      this.logger.warn(`Cache SET failed for ${key}`);
    }
  }

  async invalidatePrefix(prefix: string): Promise<void> {
    try {
      const keys = await this.redis.keys(`${prefix}*`);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (e) {
      this.logger.warn(`Cache invalidate failed for prefix ${prefix}`);
    }
  }
}
