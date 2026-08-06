import { Module } from '@nestjs/common';
import { WorkflowModule } from '../workflow/workflow.module';
import { DriversService } from './drivers.service';
import { DriversController } from './drivers.controller';
import { AttendanceModule } from './attendance/attendance.module';

@Module({
  imports: [WorkflowModule, AttendanceModule],
  controllers: [DriversController],
  providers: [DriversService],
  exports: [DriversService],
})
export class DriversModule {}
