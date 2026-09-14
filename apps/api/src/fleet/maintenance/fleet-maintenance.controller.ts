import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { FleetMaintenanceService } from './fleet-maintenance.service';

@ApiTags('fleet/maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('fleet/maintenance')
export class FleetMaintenanceController {
  constructor(
    private readonly fleetMaintenanceService: FleetMaintenanceService,
  ) {}

  @Get('upcoming')
  @RequirePermissions('fleet:read')
  @ApiOperation({ summary: 'Get upcoming scheduled maintenance for the fleet' })
  getUpcomingMaintenance(@GetUser() user: AuthenticatedUser) {
    return this.fleetMaintenanceService.getUpcomingMaintenance(user.companyId);
  }

  @Post('breakdown')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Report a sudden vehicle breakdown' })
  reportBreakdown(
    @GetUser() user: AuthenticatedUser,
    @Body('vehicleId') vehicleId: string,
    @Body('description') description: string,
  ) {
    return this.fleetMaintenanceService.reportBreakdown(
      user.companyId,
      vehicleId,
      description,
    );
  }
}
