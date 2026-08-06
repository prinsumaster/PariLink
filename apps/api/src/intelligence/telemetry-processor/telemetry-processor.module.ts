import { Module } from '@nestjs/common';
import { TelemetryProcessorService } from './telemetry-processor.service';
import { MlFeatureStoreModule } from '../feature-store/feature-store.module';
import { PredictionEngineModule } from '../prediction/prediction.module';

@Module({
  imports: [MlFeatureStoreModule, PredictionEngineModule],
  providers: [TelemetryProcessorService],
})
export class TelemetryProcessorModule {}
