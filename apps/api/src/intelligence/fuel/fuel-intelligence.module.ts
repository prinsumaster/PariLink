import { Module } from '@nestjs/common';
import { FuelIntelligenceController } from './fuel-intelligence.controller';
import { FuelIntelligenceService } from './fuel-intelligence.service';

@Module({
  controllers: [FuelIntelligenceController],
  providers: [FuelIntelligenceService],
  exports: [FuelIntelligenceService],
})
export class FuelIntelligenceModule {}
