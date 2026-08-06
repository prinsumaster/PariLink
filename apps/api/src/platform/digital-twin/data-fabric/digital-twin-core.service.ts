import { Injectable, Logger } from '@nestjs/common';
import { DataQualityEngine, RawTelemetryEvent } from './quality-engine.service';
import { FusionEngineService } from './fusion-engine.service';

@Injectable()
export class DigitalTwinCoreService {
  private readonly logger = new Logger(DigitalTwinCoreService.name);

  constructor(
    private readonly qualityEngine: DataQualityEngine,
    private readonly fusionEngine: FusionEngineService,
  ) {}

  /**
   * The single entry point for all telemetry data entering PariLink.
   * This represents the "Data Fabric" pipeline described in the V7.0 Architecture.
   *
   * Source Systems -> Connector Runtime -> Normalization -> (this method)
   * -> Validation -> Quality Engine -> Fusion Engine -> Digital Twin
   */
  async ingestTelemetry(event: RawTelemetryEvent): Promise<void> {
    try {
      this.logger.debug(
        `Ingesting telemetry for ${event.providerVehicleId} from ${event.provider}`,
      );

      // 1. Data Quality Check
      const qualityResult = this.qualityEngine.validateAndCleanse(event);

      if (!qualityResult.isValid) {
        this.logger.warn(
          `Telemetry event rejected: ${qualityResult.rejectionReason} (Score: ${qualityResult.score})`,
        );
        // We could route this to a Dead Letter Queue or Anomaly Detection table here
        return;
      }

      // 2. Data Fusion & Digital Twin Update
      await this.fusionEngine.processTelemetry(
        qualityResult.cleansedEvent,
        qualityResult.score,
      );
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      const errorStack = error instanceof Error ? error.stack : undefined;
      this.logger.error(
        `Error in Data Fabric pipeline: ${errorMessage}`,
        errorStack,
      );
      throw error;
    }
  }
}
