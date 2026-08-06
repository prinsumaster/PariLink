import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { HttpModule } from '@nestjs/axios';
import { HealthController } from './health.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { RedisManagerModule } from '../common/redis/redis-manager.module';
import { BullModule } from '@nestjs/bullmq';
import { RedisHealthIndicator } from './redis.health';
import { BullMQHealthIndicator } from './bullmq.health';

@Module({
  imports: [
    TerminusModule,
    HttpModule,
    PrismaModule,
    RedisManagerModule,
    BullModule.registerQueue({ name: 'background_jobs' }), // Using one core queue for readiness check
  ],
  controllers: [HealthController],
  providers: [RedisHealthIndicator, BullMQHealthIndicator],
})
export class HealthModule {}
