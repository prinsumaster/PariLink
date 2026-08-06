import {
  Controller,
  Post,
  Get,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { IsOptional, IsString, IsUUID } from 'class-validator';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { PlanningService } from './planning.service';
import { ExceptionService } from './exception.service';
import { CustomerPromiseService } from './customer-promise.service';
import { DispatchKpiService } from './dispatch-kpi.service';

class CreatePlanDto {
  @IsUUID() loadId!: string;
}

class AssignPlanDto {
  @IsOptional() @IsUUID() candidateId?: string;
  @IsOptional() @IsString() overrideReason?: string;
}

class RejectDriverDto {
  @IsUUID() driverId!: string;
  @IsString() reason!: string;
}

@ApiTags('dispatch/planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dispatch/plans')
export class PlanningController {
  constructor(
    private readonly planning: PlanningService,
    private readonly exceptions: ExceptionService,
    private readonly promises: CustomerPromiseService,
    private readonly kpi: DispatchKpiService,
  ) {}

  // ── Planning ───────────────────────────────────────────────

  @Post()
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Create a dispatch plan for a load' })
  createPlan(@GetUser() user: AuthenticatedUser, @Body() dto: CreatePlanDto) {
    return this.planning.createPlan(user.companyId, dto.loadId, user.userId);
  }

  @Post(':planId/candidates')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Run candidate generation and scoring for a plan' })
  generateCandidates(
    @GetUser() user: AuthenticatedUser,
    @Param('planId') planId: string,
  ) {
    return this.planning.generateCandidates(user.companyId, planId);
  }

  @Post(':planId/assign')
  @RequirePermissions('dispatch:write')
  @ApiOperation({
    summary: 'Execute the assignment — reserves resources and creates a Trip',
  })
  assign(
    @GetUser() user: AuthenticatedUser,
    @Param('planId') planId: string,
    @Body() dto: AssignPlanDto,
  ) {
    return this.planning.assign(
      user.companyId,
      planId,
      user.userId,
      dto.candidateId,
      dto.overrideReason,
    );
  }

  @Post(':planId/cancel')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Cancel a dispatch plan' })
  cancel(
    @GetUser() user: AuthenticatedUser,
    @Param('planId') planId: string,
    @Body() body: { reason: string },
  ) {
    return this.planning.cancel(
      user.companyId,
      planId,
      body.reason,
      user.userId,
    );
  }

  @Get()
  @RequirePermissions('dispatch:read')
  @ApiOperation({
    summary: 'List all dispatch plans (optionally filtered by status)',
  })
  listPlans(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.planning.listPlans(user.companyId, status);
  }

  @Get('kpi')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get Dispatch KPIs' })
  getKpis(@GetUser() user: AuthenticatedUser) {
    return this.kpi.getKpis(user.companyId);
  }

  @Get(':planId')
  @RequirePermissions('dispatch:read')
  @ApiOperation({
    summary: 'Get full plan detail with candidates and violations',
  })
  getPlan(@GetUser() user: AuthenticatedUser, @Param('planId') planId: string) {
    return this.planning.getPlan(user.companyId, planId);
  }

  // ── Exception Console ────────────────────────────────────

  @Post(':planId/exceptions/driver-rejection')
  @RequirePermissions('dispatch:write')
  @ApiOperation({
    summary: 'Register a driver rejection and auto-recommend next candidate',
  })
  driverRejection(
    @GetUser() user: AuthenticatedUser,
    @Param('planId') planId: string,
    @Body() dto: RejectDriverDto,
  ) {
    return this.exceptions.handleDriverRejection(
      user.companyId,
      planId,
      dto.driverId,
      dto.reason,
    );
  }
}
