import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { Queue } from 'bullmq';

@Injectable()
export class BullMQHealthIndicator extends HealthIndicator {
  // We can pass specific queues we want to check, or just rely on Redis connectivity
  // since BullMQ uses Redis. A true check would evaluate if workers are active.
  async isHealthy(
    key: string,
    queues: Queue[],
  ): Promise<HealthIndicatorResult> {
    try {
      const statuses = await Promise.all(
        queues.map(async (q) => {
          const client = await q.client;
          if (client.status !== 'ready')
            throw new Error(`Queue ${q.name} Redis not ready`);
          return { name: q.name, status: 'ready' };
        }),
      );
      return this.getStatus(key, true, { queues: statuses });
    } catch (e) {
      throw new HealthCheckError(
        'BullMQHealthCheck failed',
        this.getStatus(key, false, { message: (e as Error).message }),
      );
    }
  }
}
