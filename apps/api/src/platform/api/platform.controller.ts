import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  Query,
  Res,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { HealthService } from './health.service';
import { LicenseService } from '../licensing/license.service';
import { FeatureToggleService } from '../feature-management/feature-toggle.service';
import { IamPolicyEngineService } from '../iam/iam-policy-engine.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import type { Response } from 'express';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../audit/audit.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

// ---------------------------------------------------------------------------
// Platform Controller — Enterprise Admin & Observability API
//
// Routes:
//   GET  /api/v1/platform/health              — Kubernetes readiness probe
//   GET  /api/v1/platform/health/liveness     — Kubernetes liveness probe
//   GET  /api/v1/platform/health/deep         — Full diagnostic (auth required)
//   GET  /api/v1/platform/metrics             — Platform metrics (admin)
//   GET  /api/v1/platform/license/:tenantId   — License state
//   POST /api/v1/platform/features/:key/kill  — Emergency flag kill switch
//   GET  /api/v1/platform/audit-log           — Audit log query (admin)
//   GET  /api/v1/platform/roles/:id/cache/invalidate  — IAM cache invalidation
// ---------------------------------------------------------------------------

@ApiTags('Platform')
@Controller('platform')
export class PlatformController {
  constructor(
    private readonly health: HealthService,
    private readonly license: LicenseService,
    private readonly features: FeatureToggleService,
    private readonly iam: IamPolicyEngineService,
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── Health Probes ───────────────────────────────────────────────────────

  @Get('health')
  async readiness(@Res() res: Response) {
    const result = await this.health.readiness();
    return res
      .status(
        result.status === 'UP' ? HttpStatus.OK : HttpStatus.SERVICE_UNAVAILABLE,
      )
      .json(result);
  }

  @Get('health/liveness')
  async liveness() {
    return this.health.liveness();
  }

  @Get('health/deep')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async deepHealth() {
    return this.health.deepHealth();
  }

  // ── License Management ──────────────────────────────────────────────────

  @Get('license/:tenantId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async getLicense(@Param('tenantId') tenantId: string) {
    return this.license.getLicense(tenantId);
  }

  @Post('license/:tenantId/invalidate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async invalidateLicense(@Param('tenantId') tenantId: string) {
    await this.license.invalidate(tenantId);
    return { message: `License cache invalidated for tenant ${tenantId}` };
  }

  // ── Feature Flag Management ─────────────────────────────────────────────

  @Post('features/:companyId/:key/enable')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async enableFlag(
    @Param('companyId') companyId: string,
    @Param('key') key: string,
    @Body('updatedBy') updatedBy: string,
  ) {
    await this.features.enable(companyId, key, updatedBy ?? 'ADMIN');
    return { message: `Feature ${key} enabled for tenant ${companyId}` };
  }

  @Post('features/:companyId/:key/kill')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async killFlag(
    @Param('companyId') companyId: string,
    @Param('key') key: string,
    @Body('updatedBy') updatedBy: string,
  ) {
    await this.features.killSwitch(companyId, key, updatedBy ?? 'ADMIN');
    return {
      message: `KILL SWITCH: Feature ${key} disabled for tenant ${companyId}`,
    };
  }

  // ── IAM Cache Management ─────────────────────────────────────────────────

  @Post('iam/roles/:roleId/cache/invalidate')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async invalidateRoleCache(@Param('roleId') roleId: string) {
    this.iam.invalidateRoleCache(roleId);
    return { message: `Permission cache cleared for role ${roleId}` };
  }

  // ── Platform Metrics ────────────────────────────────────────────────────

  @Get('metrics')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async getMetrics(
    @Query('companyId') companyId: string,
    @Query('category') category: string,
    @Query('limit') limit = '100',
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.platformMetric.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(category ? { category } : {}),
        },
        orderBy: { recordedAt: 'desc' },
        take: Math.min(Number(limit), 500),
      }),
    );
  }

  // ── Audit Log Query ─────────────────────────────────────────────────────

  @Get('audit-log')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  async getAuditLog(
    @Query('companyId') companyId: string,
    @Query('action') action: string,
    @Query('entity') entity: string,
    @Query('userId') userId: string,
    @Query('limit') limit = '50',
    @Query('cursor') cursor?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.auditLog.findMany({
        where: {
          ...(companyId ? { companyId } : {}),
          ...(action ? { action } : {}),
          ...(entity ? { entity } : {}),
          ...(userId ? { userId } : {}),
        },
        orderBy: { createdAt: 'desc' },
        take: Math.min(Number(limit), 200),
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
      }),
    );
  }

  // ── Audit Chain Verification ───────────────────────────────────────────

  @Get('audit-log/verify/:auditLogId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  @ApiOperation({ summary: 'Verify integrity of a single audit log record' })
  async verifyAuditRecord(@Param('auditLogId') auditLogId: string) {
    const isValid = await this.audit.verifyIntegrity(auditLogId);
    return { auditLogId, isValid };
  }

  @Get('audit-log/chain/:companyId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  @ApiOperation({ summary: 'Verify the hash chain for a tenant audit trail' })
  async verifyAuditChain(
    @Param('companyId') companyId: string,
    @Query('limit') limit = '1000',
  ) {
    return this.audit.verifyChain(companyId, Math.min(Number(limit), 5000));
  }

  @Get('audit-log/export/:companyId')
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @RequirePermissions('platform:admin')
  @ApiOperation({ summary: 'Export audit logs for compliance' })
  async exportAuditLogs(
    @Param('companyId') companyId: string,
    @Query('from') from: string,
    @Query('to') to: string,
    @Query('userId') userId?: string,
  ) {
    const fromDate = from
      ? new Date(from)
      : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const toDate = to ? new Date(to) : new Date();
    return this.audit.exportAuditLogs(companyId, fromDate, toDate, userId);
  }
}
