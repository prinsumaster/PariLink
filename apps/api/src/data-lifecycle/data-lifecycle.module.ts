import { Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { RetentionService } from './retention.service';
import { BackupService } from './backup.service';
import { PartitionMaintenanceService } from './partitions/partition-maintenance.service';

@Module({
  // ScheduleModule.forRoot() is required for @Cron in this module to fire.
  // It is idempotent across modules -- operations.module.ts, lin.module.ts
  // and business-health.module.ts each call it too, and Nest resolves them
  // to one scheduler instance.
  imports: [ScheduleModule.forRoot()],
  providers: [RetentionService, BackupService, PartitionMaintenanceService],
  exports: [RetentionService, BackupService, PartitionMaintenanceService],
})
export class DataLifecycleModule {}
