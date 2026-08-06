import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { Redis } from 'ioredis';
import { RedisManagerService } from '../../common/redis/redis-manager.service';

@Injectable()
export class AiCacheService implements OnModuleDestroy {
  private readonly logger = new Logger(AiCacheService.name);
  private redisClient: Redis;

  constructor(private readonly redisManager: RedisManagerService) {
    this.redisClient = this.redisManager.getClient();
  }

  async onModuleDestroy() {
    // Rely on RedisManagerService to close the pool
  }

  /**
   * Phase 11: Performance - Caches LLM Prompts and Embeddings
   */
  async getOrSetCache(
    key: string,
    ttlSeconds: number,
    fetcher: () => Promise<string>,
  ): Promise<string> {
    const cached = await this.redisClient.get(key);
    if (cached) {
      this.logger.log(`AI Cache HIT for key: ${key}`);
      return cached;
    }

    this.logger.log(`AI Cache MISS for key: ${key}`);
    const freshData = await fetcher();
    await this.redisClient.setex(key, ttlSeconds, freshData);

    return freshData;
  }
}
