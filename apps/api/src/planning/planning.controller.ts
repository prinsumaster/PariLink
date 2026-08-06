import { Controller, Post, Get, Param, UseGuards, Body } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { PlanningEngineService } from './planning-engine.service';

@ApiTags('planning')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('planning')
export class PlanningController {
  constructor(private readonly planningEngine: PlanningEngineService) {}

  @Post('run')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Trigger the daily operational planning pipeline' })
  async runPlanningPipeline(@GetUser() user: AuthenticatedUser) {
    return this.planningEngine.runPipeline(user.companyId);
  }

  @Get('today')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get the latest generated plan for today' })
  async getTodayPlan(@GetUser() user: AuthenticatedUser) {
    return this.planningEngine.getLatestPlan(user.companyId);
  }

  @Post('items/:id/approve')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Approve a specific plan item exception' })
  async approvePlanItem(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.planningEngine.approveItem(user.companyId, id);
  }

  @Post('items/:id/reject')
  @RequirePermissions('dispatch:write')
  @ApiOperation({ summary: 'Reject a specific plan item exception' })
  async rejectPlanItem(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body('reason') reason: string,
  ) {
    return this.planningEngine.rejectItem(user.companyId, id, reason);
  }
}
