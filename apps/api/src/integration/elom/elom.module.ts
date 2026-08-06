import { Module } from '@nestjs/common';
import { ElomOrchestratorService } from './elom-orchestrator.service';
import { InvoicesModule } from '../../invoices/invoices.module';
import { PlatformModule } from '../../platform/platform.module';

@Module({
  imports: [InvoicesModule, PlatformModule],
  providers: [ElomOrchestratorService],
})
export class ElomModule {}
