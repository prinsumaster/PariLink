import { Module } from '@nestjs/common';
import { ProcessEngine } from './process.engine';
import { AutomationEngine } from './automation.engine';
import { TaskManagementService } from './task-management.service';
import { FormEngine } from './form.engine';
import { BpmAnalyticsService } from './bpm-analytics.service';
import { DigitalTwinModule } from '../digital-twin/digital-twin.module';
import { InvoicesModule } from '../../invoices/invoices.module';

@Module({
  imports: [InvoicesModule],
  providers: [
    ProcessEngine,
    AutomationEngine,
    TaskManagementService,
    FormEngine,
    BpmAnalyticsService,
  ],
  exports: [
    ProcessEngine,
    TaskManagementService,
    FormEngine,
    BpmAnalyticsService,
  ],
})
export class BpmModule {}
