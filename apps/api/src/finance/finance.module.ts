import { Module } from '@nestjs/common';
import { FinanceController } from './finance.controller';
import { FinanceService } from './finance.service';
import { PricingEngine } from './pricing/pricing.engine';
import { SettlementEngine } from './settlements/settlement.engine';
import { ProfitabilityEngine } from './analytics/profitability.engine';
import { FinOpsOrchestratorService } from './events/finops-orchestrator.service';
import { InvoicesModule } from '../invoices/invoices.module';
import { BankReconciliationModule } from './bank-reconciliation/bank-reconciliation.module';
import { PayrollModule } from './payroll/payroll.module';
import { GlMapperService } from './gl-mapper.service';

import { InvoicingController } from './invoicing/invoicing.controller';
import { InvoicingService } from './invoicing/invoicing.service';
import { AccountsPayableController } from './payables/accounts-payable.controller';
import { AccountsPayableService } from './payables/accounts-payable.service';
import { FastagController } from './fastag/fastag.controller';
import { FastagService } from './fastag/fastag.service';
import { GeneralLedgerController } from './ledger/general-ledger.controller';
import { GeneralLedgerService } from './ledger/general-ledger.service';

@Module({
  imports: [InvoicesModule, BankReconciliationModule, PayrollModule],
  controllers: [
    FinanceController,
    InvoicingController,
    AccountsPayableController,
    FastagController,
    GeneralLedgerController,
  ],
  providers: [
    FinanceService,
    PricingEngine,
    SettlementEngine,
    ProfitabilityEngine,
    FinOpsOrchestratorService,
    GlMapperService,
    InvoicingService,
    AccountsPayableService,
    FastagService,
    GeneralLedgerService,
  ],
  exports: [PricingEngine, ProfitabilityEngine],
})
export class FinanceModule {}
