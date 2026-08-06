import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import Redis from 'ioredis';
import { Logger } from '@nestjs/common';
import { INestApplicationContext } from '@nestjs/common';

export class RedisIoAdapter extends IoAdapter {
  private adapterConstructor: ReturnType<typeof createAdapter>;
  private readonly logger = new Logger(RedisIoAdapter.name);

  constructor(app: INestApplicationContext) {
    super(app);
  }

  async connectToRedis(): Promise<void> {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

    const pubClient = new Redis(redisUrl);
    const subClient = new Redis(redisUrl);

    pubClient.on('error', (err: any) =>
      this.logger.error('Redis PubClient Error', err),
    );
    subClient.on('error', (err: any) =>
      this.logger.error('Redis SubClient Error', err),
    );

    this.adapterConstructor = createAdapter(pubClient, subClient);
    this.logger.log(`Redis IO Adapter connected to ${redisUrl}`);
  }

  createIOServer(port: number, options?: ServerOptions): any {
    const server = super.createIOServer(port, options);
    server.adapter(this.adapterConstructor);
    return server;
  }
}
