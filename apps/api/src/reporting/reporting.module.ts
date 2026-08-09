import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bullmq';
import { ReportingController } from './reporting.controller';
import { ReportingService } from './reporting.service';
import { ReportingProcessor } from './reporting.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { PlatformModule } from '../platform/platform.module';

@Module({
  imports: [
    PrismaModule,
    PlatformModule,
    BullModule.registerQueue({
      name: 'reporting-queue',
      defaultJobOptions: {
        attempts: 3,
        backoff: { type: 'exponential', delay: 2000 },
        removeOnComplete: true,
        removeOnFail: 1000,
      },
    }),
  ],
  controllers: [ReportingController],
  providers: [ReportingService, ...(process.env.RUN_WORKERS === 'true' ? [ReportingProcessor] : [])],
  exports: [ReportingService],
})
export class ReportingModule {}
