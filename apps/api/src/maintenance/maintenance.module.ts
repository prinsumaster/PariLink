import { Module } from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { MaintenanceController } from './maintenance.controller';
import { JobsController } from './jobs.controller';
import { JobsService } from './jobs.service';

@Module({
  controllers: [MaintenanceController, JobsController],
  providers: [MaintenanceService, JobsService],
  exports: [MaintenanceService, JobsService],
})
export class MaintenanceModule {}
