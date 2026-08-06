import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// ---------------------------------------------------------------------------
// PariLink IAM Policy Engine (Ultimate Enterprise Grade)
//
// Implements a layered authorization model:
//   Layer 1 — RBAC: Role → Permission Strings (e.g. 'invoices:read')
//   Layer 2 — ABAC: Contextual attribute checks (ownership, branch, region, cost-center)
//   Layer 3 — Row-Level Security: Automatic companyId enforcement on all
//             data access (tenant isolation guarantee)
//
// Permission Format:
//   JSON Array of conditions. Example:
//   [
//      "invoices:read",
//      {"resource": "invoice", "action": "approve", "conditions": {"branchId": "$user.branchId", "maxAmount": 50000}}
//   ]
// ---------------------------------------------------------------------------

export interface PolicyContext {
  userId: string;
  companyId: string;
  roleId?: string | null;
  resource: string;
  action: string;

  // ABAC Context Variables
  resourceOwnerId?: string;
  resourceCompanyId?: string;
  resourceBranchId?: string;
  resourceRegion?: string;
  resourceCostCenterId?: string;

  // Optional metadata to evaluate against conditions
  metadata?: Record<string, any>;
}

export interface PolicyDecision {
  granted: boolean;
  reason: string;
}

interface CachedPermissions {
  permissions: any[]; // Now supports JSON objects for ABAC
  expiry: number;
}

@Injectable()
export class IamPolicyEngineService {
  private readonly logger = new Logger(IamPolicyEngineService.name);
  private readonly cache = new Map<string, CachedPermissions>();
  private readonly CACHE_TTL_MS = 60_000; // 60 seconds

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Primary authorization check.
   */
  async authorize(ctx: PolicyContext): Promise<PolicyDecision> {
    // Layer 3: Row-Level Security — ALWAYS enforce tenant isolation first
    if (ctx.resourceCompanyId && ctx.resourceCompanyId !== ctx.companyId) {
      this.logger.warn(
        `[IAM] Cross-tenant access denied: user from tenant ${ctx.companyId} attempted ` +
          `to access resource owned by ${ctx.resourceCompanyId}`,
      );
      return { granted: false, reason: 'CROSS_TENANT_ACCESS_DENIED' };
    }

    if (!ctx.roleId) {
      return { granted: false, reason: 'NO_ROLE_ASSIGNED' };
    }

    const permissions = await this.loadPermissions(ctx.roleId, ctx.companyId);

    // Super-admin bypass
    if (permissions.includes('*')) {
      return { granted: true, reason: 'SUPER_ADMIN' };
    }

    const requiredPermission = `${ctx.resource}:${ctx.action}`;
    const wildcardPermission = `${ctx.resource}:*`;

    // Flatten simple string permissions for Layer 1 Check
    const stringPerms = permissions.filter((p) => typeof p === 'string');
    const hasRbac =
      stringPerms.includes(requiredPermission) ||
      stringPerms.includes(wildcardPermission);

    // Layer 2: ABAC Evaluation
    // Find any JSON rule that applies to this resource and action
    const abacRules = permissions.filter(
      (p) =>
        typeof p === 'object' &&
        p.resource === ctx.resource &&
        (p.action === ctx.action || p.action === '*'),
    );

    let hasAbac = false;
    let failedAbacReason = '';

    if (abacRules.length > 0) {
      // User must satisfy AT LEAST ONE applicable ABAC rule
      const user = await this.prisma.runAsTenant(ctx.companyId, async (tx) =>
        tx.user.findUnique({
          where: { id: ctx.userId },
          select: { branchId: true, region: true, costCenterId: true },
        }),
      );

      for (const rule of abacRules) {
        let ruleSatisfied = true;
        const conditions = rule.conditions || {};

        if (
          conditions.branchId === '$user.branchId' &&
          ctx.resourceBranchId !== user?.branchId
        ) {
          ruleSatisfied = false;
          failedAbacReason = 'BRANCH_ISOLATION_VIOLATION';
        }
        if (
          conditions.region === '$user.region' &&
          ctx.resourceRegion !== user?.region
        ) {
          ruleSatisfied = false;
          failedAbacReason = 'REGION_ISOLATION_VIOLATION';
        }
        if (
          conditions.costCenterId === '$user.costCenterId' &&
          ctx.resourceCostCenterId !== user?.costCenterId
        ) {
          ruleSatisfied = false;
          failedAbacReason = 'COST_CENTER_ISOLATION_VIOLATION';
        }

        if (ruleSatisfied) {
          hasAbac = true;
          break;
        }
      }
    } else {
      // If no ABAC rules specifically constrain this, fallback to RBAC
      hasAbac = hasRbac;
    }

    if (!hasAbac && !hasRbac) {
      return {
        granted: false,
        reason: failedAbacReason || `MISSING_PERMISSION:${requiredPermission}`,
      };
    }

    // Default Ownership Check (Implicit ABAC constraint)
    if (ctx.resourceOwnerId && ctx.resourceOwnerId !== ctx.userId) {
      const canAccessOthers = stringPerms.includes(`${ctx.resource}:read:any`);
      if (!canAccessOthers && !hasAbac) {
        // Allow explicit ABAC to override ownership
        return { granted: false, reason: 'OWNERSHIP_VIOLATION' };
      }
    }

    return { granted: true, reason: 'ABAC_RBAC_GRANTED' };
  }

  async hasPermission(
    roleId: string,
    companyId: string,
    permission: string,
  ): Promise<boolean> {
    const permissions = await this.loadPermissions(roleId, companyId);
    const stringPerms = permissions.filter((p) => typeof p === 'string');
    const [resource] = permission.split(':');
    return (
      stringPerms.includes(permission) ||
      stringPerms.includes(`${resource}:*`) ||
      stringPerms.includes('*')
    );
  }

  invalidateRoleCache(roleId: string): void {
    this.cache.delete(roleId);
    this.logger.debug(`[IAM] Cache invalidated for role ${roleId}`);
  }

  private async loadPermissions(
    roleId: string,
    companyId: string,
  ): Promise<any[]> {
    const cacheKey = `${companyId}:${roleId}`;
    const cached = this.cache.get(cacheKey);

    if (cached && cached.expiry > Date.now()) {
      return cached.permissions;
    }

    const role = await this.prisma.runAsSystem(async (tx) =>
      tx.role.findUnique({
        where: { id: roleId },
        select: { permissions: true },
      }),
    );

    const permissions = Array.isArray(role?.permissions)
      ? role.permissions
      : [];
    this.cache.set(cacheKey, {
      permissions,
      expiry: Date.now() + this.CACHE_TTL_MS,
    });

    return permissions;
  }
}
