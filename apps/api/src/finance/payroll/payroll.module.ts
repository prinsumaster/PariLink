import { Module } from '@nestjs/common';
import { PayrollEngineService } from './services/payroll-engine/payroll-engine.service';
import { PayrollController } from './controllers/payroll/payroll.controller';

@Module({
  providers: [PayrollEngineService],
  controllers: [PayrollController],
})
export class PayrollModule {}
