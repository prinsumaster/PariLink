import { Module } from '@nestjs/common';
import { CrmLeadService } from './services/crm-lead/crm-lead.service';
import { CrmLeadController } from './controllers/crm-lead/crm-lead.controller';

@Module({
  providers: [CrmLeadService],
  controllers: [CrmLeadController],
})
export class CrmModule {}
