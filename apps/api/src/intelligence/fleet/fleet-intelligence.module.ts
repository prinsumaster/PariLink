import { Module } from '@nestjs/common';
import { FleetIntelligenceService } from './fleet-intelligence.service';
import { FleetIntelligenceController } from './fleet-intelligence.controller';

@Module({
  controllers: [FleetIntelligenceController],
  providers: [FleetIntelligenceService],
  exports: [FleetIntelligenceService],
})
export class FleetIntelligenceModule {}
