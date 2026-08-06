import { Injectable, Logger } from '@nestjs/common';
import { OnEvent } from '@nestjs/event-emitter';
import { FeatureStoreService } from '../feature-store/feature-store.service';
import { PredictionService } from '../prediction/prediction.service';

@Injectable()
export class TelemetryProcessorService {
  private readonly logger = new Logger(TelemetryProcessorService.name);

  constructor(
    private featureStore: FeatureStoreService,
    private predictionEngine: PredictionService,
  ) {}

  @OnEvent('GpsPing.Received', { async: true })
  async handleGpsPing(payload: any) {
    this.logger.debug(
      `Processing telemetry for AI pipelines: Vehicle ${payload.vehicleId}`,
    );

    // 1. Update ML Feature Store
    await this.featureStore.pushTelemetryFeature(payload.vehicleId, {
      lat: payload.latitude,
      lng: payload.longitude,
      speed: payload.speed,
    });

    // 2. Predict new ETA if on a trip
    if (payload.tripId) {
      await this.predictionEngine.predictEta(
        payload.tripId,
        payload.latitude,
        payload.longitude,
        payload.companyId,
      );
    }
  }
}
