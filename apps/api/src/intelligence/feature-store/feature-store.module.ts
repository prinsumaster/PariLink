import { Module } from '@nestjs/common';
import { FeatureStoreService } from './feature-store.service';

@Module({
  providers: [FeatureStoreService],
  exports: [FeatureStoreService],
})
export class MlFeatureStoreModule {}
