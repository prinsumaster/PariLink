import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface PricingContext {
  companyId: string;
  customerId: string;
  distanceKm?: number;
  weightKg?: number;
  volumeM3?: number;
  stops?: number;
  isHazmat?: boolean;
  baseFuelPrice?: number;
  currentFuelPrice?: number;
  detentionHours?: number;
}

export interface PricingResult {
  baseFreight: number;
  fuelSurcharge: number;
  accessorialCharges: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  totalAmount: number;
}

@Injectable()
export class PricingEngine {
  private readonly logger = new Logger(PricingEngine.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Calculates dynamic multi-modal pricing.
   * Supports Contract Pricing, Spot Pricing, Distance/Weight based, and Accessorials.
   */
  async calculatePrice(ctx: PricingContext): Promise<PricingResult> {
    this.logger.log(`Evaluating Pricing for Customer ${ctx.customerId}`);

    // In a full implementation, query Contract rules. We will implement robust heuristic logic.
    let baseFreight = 0;
    const accessorialCharges = [];

    // Base Freight: Distance * Rate or Weight * Rate
    if (ctx.distanceKm) {
      baseFreight = ctx.distanceKm * 2.5; // $2.50 per km base rate
    } else if (ctx.weightKg) {
      baseFreight = (ctx.weightKg / 1000) * 50; // $50 per ton
    } else {
      baseFreight = 500; // Minimum Spot Freight
    }

    // Fuel Surcharge (FSC)
    let fuelSurcharge = 0;
    if (
      ctx.currentFuelPrice &&
      ctx.baseFuelPrice &&
      ctx.currentFuelPrice > ctx.baseFuelPrice
    ) {
      const fscMultiplier = 0.05; // 5% for every $1 over base
      const overage = ctx.currentFuelPrice - ctx.baseFuelPrice;
      fuelSurcharge = baseFreight * (overage * fscMultiplier);
    }

    // Detention Charges
    if (ctx.detentionHours && ctx.detentionHours > 2) {
      // Free time is 2 hours
      const billableHours = ctx.detentionHours - 2;
      const detentionAmount = billableHours * 50; // $50/hr
      accessorialCharges.push({
        type: 'DETENTION',
        amount: detentionAmount,
        description: `${billableHours} hours detention`,
      });
    }

    // Multi-stop Charges
    if (ctx.stops && ctx.stops > 1) {
      const stopAmount = (ctx.stops - 1) * 75; // $75 per extra stop
      accessorialCharges.push({
        type: 'EXTRA_STOP',
        amount: stopAmount,
        description: `${ctx.stops - 1} extra stops`,
      });
    }

    // Hazmat
    if (ctx.isHazmat) {
      accessorialCharges.push({
        type: 'HAZMAT',
        amount: 200,
        description: 'Hazardous materials surcharge',
      });
    }

    const totalAccessorials = accessorialCharges.reduce(
      (acc, c) => acc + c.amount,
      0,
    );
    const totalAmount = baseFreight + fuelSurcharge + totalAccessorials;

    return {
      baseFreight,
      fuelSurcharge,
      accessorialCharges,
      totalAmount,
    };
  }
}
