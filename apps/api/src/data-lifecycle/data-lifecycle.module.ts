import { Module } from '@nestjs/common';
import { RetentionService } from './retention.service';
import { BackupService } from './backup.service';

@Module({
  providers: [RetentionService, BackupService],
  exports: [RetentionService, BackupService],
})
export class DataLifecycleModule {}
