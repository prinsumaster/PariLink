import { Module } from '@nestjs/common';
import { CommercialController } from './commercial.controller';
import { PricingService } from './engine/pricing.service';
import { ContractService } from './engine/contract.service';
import { TenderService } from './engine/tender.service';
import { ProfitabilityService } from './engine/profitability.service';
import { SlaTrackerService } from './engine/sla-tracker.service';

@Module({
  controllers: [CommercialController],
  providers: [
    PricingService,
    ContractService,
    TenderService,
    ProfitabilityService,
    SlaTrackerService,
  ],
  exports: [
    PricingService,
    ContractService,
    ProfitabilityService,
    SlaTrackerService,
  ],
})
export class CommercialModule {}
