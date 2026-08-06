import { Module } from '@nestjs/common';
import { DriverIntelligenceService } from './driver-intelligence.service';
import { DriverIntelligenceController } from './driver-intelligence.controller';

@Module({
  controllers: [DriverIntelligenceController],
  providers: [DriverIntelligenceService],
  exports: [DriverIntelligenceService],
})
export class DriverIntelligenceModule {}
