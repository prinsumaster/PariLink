import { Module } from '@nestjs/common';
import { BankSyncService } from './services/bank-sync/bank-sync.service';
import { BankStatementController } from './controllers/bank-statement/bank-statement.controller';

@Module({
  providers: [BankSyncService],
  controllers: [BankStatementController],
})
export class BankReconciliationModule {}
