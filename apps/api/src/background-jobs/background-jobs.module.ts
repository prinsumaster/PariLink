import { Module } from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service';
import { BackgroundJobsController } from './background-jobs.controller';
import {
  WebhooksDlqProcessor,
  BackgroundJobsDlqProcessor,
} from './dlq.processor';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BackgroundJobsController],
  providers: [
    BackgroundJobsService,
    WebhooksDlqProcessor,
    BackgroundJobsDlqProcessor,
  ],
  exports: [BackgroundJobsService],
})
export class BackgroundJobsModule {}
