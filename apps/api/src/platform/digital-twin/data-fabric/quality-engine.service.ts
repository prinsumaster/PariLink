import { Injectable, Logger } from '@nestjs/common';

export interface RawTelemetryEvent {
  tenantId: string;
  provider: string; // e.g., 'SAMSARA', 'TATA_FLEET_EDGE', 'FASTAG'
  providerVehicleId: string;
  vehicleId?: string;
  timestamp: Date;
  latitude?: number;
  longitude?: number;
  speed?: number;
  heading?: number;
  ignition?: boolean;
  fuelLevel?: number;
  odometer?: number;
}

export interface QualityValidationResult {
  isValid: boolean;
  score: number; // 0 to 100
  rejectionReason?: string;
  cleansedEvent: RawTelemetryEvent;
}

@Injectable()
export class DataQualityEngine {
  private readonly logger = new Logger(DataQualityEngine.name);

  validateAndCleanse(event: RawTelemetryEvent): QualityValidationResult {
    let score = 100;

    // 1. Validate Geospatial integrity
    if (event.latitude !== undefined && event.longitude !== undefined) {
      if (
        event.latitude < -90 ||
        event.latitude > 90 ||
        event.longitude < -180 ||
        event.longitude > 180 ||
        (event.latitude === 0 && event.longitude === 0)
      ) {
        return {
          isValid: false,
          score: 0,
          rejectionReason: 'INVALID_COORDINATES',
          cleansedEvent: event,
        };
      }
    }

    // 2. Validate Speed limits (Impossible physics)
    if (event.speed !== undefined) {
      if (event.speed < 0 || event.speed > 250) {
        // Max realistic speed is < 250 km/h for fleet
        this.logger.warn(
          `Dropping impossible speed ${event.speed} km/h from provider ${event.provider}`,
        );
        event.speed = undefined;
        score -= 20;
      }
    }

    // 3. Impute missing heading if speed > 0 and coordinates exist
    // (A real AI model might interpolate from the last known state, here we just penalize quality)
    if (event.speed && event.speed > 0 && event.heading === undefined) {
      score -= 5;
    }

    // 4. Timestamp anomalies
    const ageInMinutes =
      (new Date().getTime() - new Date(event.timestamp).getTime()) / 60000;
    if (ageInMinutes > 60) {
      score -= Math.min(30, Math.floor(ageInMinutes / 60)); // Penalize old data
    } else if (ageInMinutes < -5) {
      return {
        isValid: false,
        score: 0,
        rejectionReason: 'FUTURE_TIMESTAMP',
        cleansedEvent: event,
      };
    }

    return {
      isValid: true,
      score,
      cleansedEvent: event,
    };
  }
}
