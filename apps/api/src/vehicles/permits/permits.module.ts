import { Module } from '@nestjs/common';
import { PermitComplianceService } from './services/permit-compliance/permit-compliance.service';
import { PermitController } from './controllers/permit/permit.controller';

@Module({
  providers: [PermitComplianceService],
  controllers: [PermitController],
})
export class PermitsModule {}
