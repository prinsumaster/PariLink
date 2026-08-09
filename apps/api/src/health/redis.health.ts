import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { RedisManagerService } from '../common/redis/redis-manager.service';

@Injectable()
export class RedisHealthIndicator extends HealthIndicator {
  constructor(private readonly redisManager: RedisManagerService) {
    super();
  }

  async isHealthy(key: string): Promise<HealthIndicatorResult> {
    const client = this.redisManager.getClient();
    try {
      await client.ping();
      return this.getStatus(key, true, { status: 'connected' });
    } catch (e) {
      throw new HealthCheckError(
        'RedisHealthCheck failed',
        this.getStatus(key, false, { message: (e as Error).message }),
      );
    }
  }
}
