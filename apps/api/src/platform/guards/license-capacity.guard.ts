import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

// ─── Decorator ───────────────────────────────────────────────────────────────
export const CHECK_CAPACITY_KEY = 'checkCapacity';
export const CheckCapacity = (resourceType: 'vehicle' | 'driver' | 'user') =>
  SetMetadata(CHECK_CAPACITY_KEY, resourceType);

// ─── Guard ───────────────────────────────────────────────────────────────────
/**
 * LicenseCapacityGuard
 *
 * Enforces the PariLink Enterprise Licensing Engine truck/vehicle capacity
 * limits. Applied via @CheckCapacity('vehicle') decorator on POST endpoints.
 *
 * Enforcement logic:
 *  1. Load TenantConfig for the requesting company
 *  2. If unlimitedMode = true → ALLOW (Super Admin override)
 *  3. If boostExpiresAt is in the future → use boostMaxVehicles
 *  4. Otherwise use maxVehicles
 *  5. Count current active resources for the tenant
 *  6. If count >= limit → block with HTTP 402 (Payment Required)
 *
 * Existing data is NEVER deleted. Only creation of new assets is blocked.
 */
@Injectable()
export class LicenseCapacityGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const resourceType = this.reflector.getAllAndOverride<string>(
      CHECK_CAPACITY_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!resourceType) return true;

    const request = context.switchToHttp().getRequest();
    const companyId: string = request.user?.companyId;

    if (!companyId) return true; // Auth guard handles missing user

    const config = await this.prisma.runAsSystem(async (tx) =>
      tx.tenantConfig.findUnique({ where: { companyId } }),
    );

    // If no config exists yet, apply generous defaults
    if (!config) return true;

    // ── Unlimited Mode (Super Admin override) ──────────────────────────────
    if (config.unlimitedMode) return true;

    // ── Determine effective limit ──────────────────────────────────────────
    const now = new Date();
    const isInBoostPeriod =
      config.boostExpiresAt && config.boostExpiresAt > now;

    let effectiveLimit: number;
    switch (resourceType) {
      case 'vehicle':
        effectiveLimit =
          isInBoostPeriod && config.boostMaxVehicles
            ? config.boostMaxVehicles
            : config.maxVehicles;
        break;
      case 'driver':
        effectiveLimit = config.maxDrivers;
        break;
      case 'user':
        effectiveLimit = config.maxUsers;
        break;
      default:
        return true;
    }

    // ── Count current resources ────────────────────────────────────────────
    const currentCount = await this.countResources(companyId, resourceType);

    if (currentCount >= effectiveLimit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.PAYMENT_REQUIRED,
          error: 'License Limit Reached',
          message: `Your current plan allows a maximum of ${effectiveLimit} ${resourceType}s. You have reached this limit (${currentCount}/${effectiveLimit}). Please upgrade your plan or contact your administrator.`,
          code: 'LICENSE_CAPACITY_EXCEEDED',
          resourceType,
          currentCount,
          effectiveLimit,
          upgradeUrl: '/billing/upgrade',
        },
        HttpStatus.PAYMENT_REQUIRED,
      );
    }

    return true;
  }

  private async countResources(
    companyId: string,
    resourceType: string,
  ): Promise<number> {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      switch (resourceType) {
        case 'vehicle':
          return tx.vehicle.count({
            where: { companyId },
          });
        case 'driver':
          return tx.driver.count({
            where: { companyId },
          });
        case 'user':
          return tx.user.count({
            where: { companyId, status: 'ACTIVE' },
          });
        default:
          return 0;
      }
    });
  }
}
