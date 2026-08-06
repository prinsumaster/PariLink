import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  DisasterRecoveryService,
  CreateDrPlanInput,
  StartDrillInput,
} from './disaster-recovery.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Operations - Disaster Recovery')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/dr')
export class DisasterRecoveryController {
  constructor(private readonly drService: DisasterRecoveryService) {}

  @Post('plans')
  @RequirePermissions('operations:dr:write')
  @ApiOperation({
    summary:
      'Create a Disaster Recovery Plan with RTO/RPO targets and failover procedures',
  })
  async createPlan(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Body() body: Omit<CreateDrPlanInput, 'companyId' | 'actorId'>,
  ) {
    return this.drService.createRecoveryPlan({
      ...body,
      companyId: user.companyId,
      actorId: user.userId || user.id,
    });
  }

  @Post('drills')
  @RequirePermissions('operations:dr:write')
  @ApiOperation({
    summary:
      'Execute a Disaster Recovery Drill to validate failover procedures',
  })
  async startDrill(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Body() body: Omit<StartDrillInput, 'companyId' | 'conductedBy'>,
  ) {
    return this.drService.startDrill({
      ...body,
      companyId: user.companyId,
      conductedBy: user.userId || user.id,
    });
  }

  @Get('readiness')
  @RequirePermissions('operations:dr:read')
  @ApiOperation({
    summary: 'Get Business Continuity & Disaster Recovery Readiness Report',
  })
  async getReadiness(
    @GetUser() user: { companyId: string; role?: string },
    @Query('companyId') queryCompanyId?: string,
  ) {
    const targetCompanyId =
      user.role === 'SUPER_ADMIN'
        ? queryCompanyId || user.companyId
        : user.companyId;
    return this.drService.getReadinessReport(targetCompanyId);
  }
}
