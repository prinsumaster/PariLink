import { Module } from '@nestjs/common';
import { GpsService } from './gps.service';
import { TimelineService } from './timeline.service';
import { GpsController } from './gps.controller';

@Module({
  controllers: [GpsController],
  providers: [GpsService, TimelineService],
  exports: [GpsService, TimelineService],
})
export class GpsModule {}
