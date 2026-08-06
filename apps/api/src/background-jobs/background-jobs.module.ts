import { Module } from '@nestjs/common';
import { BackgroundJobsService } from './background-jobs.service';
import { BackgroundJobsController } from './background-jobs.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [PrismaModule, AuthModule],
  controllers: [BackgroundJobsController],
  providers: [BackgroundJobsService],
  exports: [BackgroundJobsService],
})
export class BackgroundJobsModule {}
