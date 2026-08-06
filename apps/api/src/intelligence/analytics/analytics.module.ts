import { Module } from '@nestjs/common';
import { DriverScoringService } from './driver.scoring.service';

@Module({
  providers: [DriverScoringService],
  exports: [DriverScoringService],
})
export class AnalyticsModule {}
