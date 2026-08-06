import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HttpHealthIndicator,
  MemoryHealthIndicator,
  PrismaHealthIndicator,
  HealthCheck,
} from '@nestjs/terminus';
import { PrismaService } from '../prisma/prisma.service';
import { RedisHealthIndicator } from './redis.health';
import { BullMQHealthIndicator } from './bullmq.health';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';

@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private http: HttpHealthIndicator,
    private memory: MemoryHealthIndicator,
    private prismaHealth: PrismaHealthIndicator,
    private prismaService: PrismaService,
    private redisIndicator: RedisHealthIndicator,
    private bullmqIndicator: BullMQHealthIndicator,
    @InjectQueue('background_jobs') private jobsQueue: Queue,
  ) {}

  @Get('liveness')
  @HealthCheck()
  checkLiveness() {
    return this.health.check([
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
    ]);
  }

  @Get('readiness')
  @HealthCheck()
  checkReadiness() {
    return this.health.check([
      // Database health
      () => this.prismaHealth.pingCheck('database', this.prismaService),
      // Memory heap health - alert if > 500MB
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
      // RSS memory health - alert if > 800MB
      () => this.memory.checkRSS('memory_rss', 800 * 1024 * 1024),
      // Redis health
      () => this.redisIndicator.isHealthy('redis'),
      // BullMQ health
      () => this.bullmqIndicator.isHealthy('queues', [this.jobsQueue]),
    ]);
  }
}
