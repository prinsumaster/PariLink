import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { ControlTowerService } from './engine/control-tower.service';
import { AiOperationsService } from './engine/ai-operations.service';
import { LiveFleetService } from './engine/live-fleet.service';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';

@ApiTags('dispatch-operations')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('dispatch/operations')
export class DispatchOperationsController {
  constructor(
    private readonly controlTowerService: ControlTowerService,
    private readonly aiOpsService: AiOperationsService,
    private readonly liveFleetService: LiveFleetService,
  ) {}

  @Get('control-tower/dashboard')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get Live Control Tower Dashboard' })
  async getLiveDashboard(@GetUser() user: AuthenticatedUser) {
    return this.controlTowerService.getLiveDashboard(user.companyId);
  }

  @Get('control-tower/active-trips')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get Active Trips with Deviations' })
  async getActiveTrips(@GetUser() user: AuthenticatedUser) {
    return this.controlTowerService.getActiveTripsWithDeviations(
      user.companyId,
    );
  }

  @Get('live-fleet/map')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Get Live Fleet Map for Control Tower' })
  async getLiveMap(@GetUser() user: AuthenticatedUser) {
    return this.liveFleetService.getLiveMap(user.companyId);
  }

  @Get('ai/trip/:tripId/predict-eta')
  @RequirePermissions('dispatch:execute')
  @ApiOperation({ summary: 'Predict Trip ETA via AI' })
  async predictEta(
    @GetUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
  ) {
    return this.aiOpsService.predictTripEta(user.companyId, tripId);
  }

  @Get('ai/trip/:tripId/risk')
  @RequirePermissions('dispatch:read')
  @ApiOperation({ summary: 'Evaluate Trip Risk Score' })
  async evaluateRisk(
    @GetUser() user: AuthenticatedUser,
    @Param('tripId') tripId: string,
  ) {
    return this.aiOpsService.evaluateRiskScore(user.companyId, tripId);
  }

  @Get('ai/load/:loadId/recommend-driver')
  @RequirePermissions('dispatch:execute')
  @ApiOperation({ summary: 'AI Recommend Optimal Driver for Load' })
  async recommendDriver(
    @GetUser() user: AuthenticatedUser,
    @Param('loadId') loadId: string,
  ) {
    return this.aiOpsService.recommendDriverForLoad(user.companyId, loadId);
  }
}
