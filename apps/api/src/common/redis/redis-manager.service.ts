import { Injectable, OnModuleDestroy, Logger } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisManagerService implements OnModuleDestroy {
  private readonly logger = new Logger(RedisManagerService.name);
  private client: Redis;

  constructor() {
    const url = process.env.REDIS_URL || 'redis://localhost:6379';
    this.logger.log(
      `Initializing Redis Connection Pool at ${url.split('@').pop()}`,
    );
    this.client = new Redis(url, {
      maxRetriesPerRequest: 3,
      enableReadyCheck: true,
      retryStrategy(times) {
        return Math.min(times * 50, 2000);
      },
    });

    this.client.on('error', (err) => {
      this.logger.error('Redis Connection Error', err);
    });
  }

  getClient(): Redis {
    return this.client;
  }

  onModuleDestroy() {
    this.logger.log('Closing Redis Connection Pool');
    this.client.disconnect();
  }
}
