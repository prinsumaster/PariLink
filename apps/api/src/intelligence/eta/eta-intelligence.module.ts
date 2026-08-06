import { Module } from '@nestjs/common';
import { EtaIntelligenceService } from './eta-intelligence.service';
import { EtaIntelligenceController } from './eta-intelligence.controller';

@Module({
  controllers: [EtaIntelligenceController],
  providers: [EtaIntelligenceService],
  exports: [EtaIntelligenceService],
})
export class EtaIntelligenceModule {}
