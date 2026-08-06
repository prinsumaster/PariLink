import { Injectable, Logger } from '@nestjs/common';

export interface ConstraintContext {
  load: {
    weight?: number | null;
    volume?: number | null;
    equipmentType?: string | null;
    pickupDate: Date;
    deliveryDate: Date;
  };
  vehicle: {
    id: string;
    capacityWeight?: number | null;
    capacityVolume?: number | null;
    type: string;
    status: string;
  };
  driver: {
    id: string;
    licenseExpiry?: Date | null;
    status: string;
  };
}

export interface ConstraintResult {
  passed: boolean;
  violations: Array<{
    constraint: string;
    message: string;
    isFatal: boolean;
    vehicleId?: string;
    driverId?: string;
  }>;
}

@Injectable()
export class ConstraintEngine {
  private readonly logger = new Logger(ConstraintEngine.name);

  evaluate(ctx: ConstraintContext, config?: any): ConstraintResult {
    const violations: ConstraintResult['violations'] = [];

    // Default strictness to true if not provided in config
    const strictWeight = config?.strictWeight !== false;
    const strictVolume = config?.strictVolume !== false;

    // ── Vehicle Constraints ─────────────────────────────────

    // 1. Vehicle must be IN_SERVICE
    if (ctx.vehicle.status !== 'IN_SERVICE') {
      violations.push({
        constraint: 'VEHICLE_NOT_AVAILABLE',
        message: `Vehicle ${ctx.vehicle.id} status is ${ctx.vehicle.status}, not IN_SERVICE.`,
        isFatal: true,
        vehicleId: ctx.vehicle.id,
      });
    }

    // 2. Weight Capacity
    if (ctx.load.weight && ctx.vehicle.capacityWeight) {
      if (ctx.load.weight > ctx.vehicle.capacityWeight) {
        violations.push({
          constraint: 'WEIGHT_EXCEEDED',
          message: `Load weight ${ctx.load.weight}kg exceeds vehicle capacity ${ctx.vehicle.capacityWeight}kg.`,
          isFatal: strictWeight,
          vehicleId: ctx.vehicle.id,
        });
      }
    }

    // 3. Volume Capacity
    if (ctx.load.volume && ctx.vehicle.capacityVolume) {
      if (ctx.load.volume > ctx.vehicle.capacityVolume) {
        violations.push({
          constraint: 'VOLUME_EXCEEDED',
          message: `Load volume ${ctx.load.volume}m³ exceeds vehicle capacity ${ctx.vehicle.capacityVolume}m³.`,
          isFatal: strictVolume,
          vehicleId: ctx.vehicle.id,
        });
      }
    }

    // 4. Equipment Type Compatibility
    if (ctx.load.equipmentType && ctx.vehicle.type) {
      if (
        ctx.load.equipmentType === 'REFRIGERATED' &&
        ctx.vehicle.type !== 'REEFER'
      ) {
        violations.push({
          constraint: 'EQUIPMENT_MISMATCH',
          message: `Load requires REFRIGERATED equipment but vehicle type is ${ctx.vehicle.type}.`,
          isFatal: true,
          vehicleId: ctx.vehicle.id,
        });
      }
    }

    // ── Driver Constraints ──────────────────────────────────

    // 5. Driver must be AVAILABLE
    if (ctx.driver.status !== 'AVAILABLE') {
      violations.push({
        constraint: 'DRIVER_NOT_AVAILABLE',
        message: `Driver ${ctx.driver.id} status is ${ctx.driver.status}, not AVAILABLE.`,
        isFatal: true,
        driverId: ctx.driver.id,
      });
    }

    // 6. Driver Licence Expiry
    if (ctx.driver.licenseExpiry) {
      const now = new Date();
      if (ctx.driver.licenseExpiry < now) {
        violations.push({
          constraint: 'LICENSE_EXPIRED',
          message: `Driver ${ctx.driver.id} licence expired on ${ctx.driver.licenseExpiry.toISOString()}.`,
          isFatal: true,
          driverId: ctx.driver.id,
        });
      }
      // Warn if licence expires within 30 days
      const thirtyDays = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
      if (ctx.driver.licenseExpiry < thirtyDays) {
        violations.push({
          constraint: 'LICENSE_EXPIRING_SOON',
          message: `Driver ${ctx.driver.id} licence expires on ${ctx.driver.licenseExpiry.toISOString()}.`,
          isFatal: false,
          driverId: ctx.driver.id,
        });
      }
    }

    return {
      passed: violations.filter((v) => v.isFatal).length === 0,
      violations,
    };
  }
}
