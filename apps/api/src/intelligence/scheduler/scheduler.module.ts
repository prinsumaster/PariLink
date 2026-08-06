import { Module } from '@nestjs/common';
import { AiSchedulerService } from './scheduler.service';
import { PredictionEngineModule } from '../prediction/prediction.module';
import { RiskEngineModule } from '../risk/risk.module';

@Module({
  imports: [PredictionEngineModule, RiskEngineModule],
  providers: [AiSchedulerService],
})
export class AiSchedulerModule {}
