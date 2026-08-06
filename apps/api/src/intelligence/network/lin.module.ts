import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { PrismaModule } from '../../prisma/prisma.module';
import { LinAnonymizationService } from './lin-anonymization.service';
import { LinBenchmarkEngine } from './lin-benchmark.engine';
import { LinController } from './lin.controller';

@Module({
  imports: [PrismaModule, ScheduleModule.forRoot()],
  controllers: [LinController],
  providers: [LinAnonymizationService, LinBenchmarkEngine],
  exports: [LinAnonymizationService, LinBenchmarkEngine],
})
export class LinModule {}
