import { Module } from '@nestjs/common';
import { AttendanceTrackingService } from './services/attendance-tracking/attendance-tracking.service';
import { AttendanceController } from './controllers/attendance/attendance.controller';

@Module({
  providers: [AttendanceTrackingService],
  controllers: [AttendanceController],
})
export class AttendanceModule {}
