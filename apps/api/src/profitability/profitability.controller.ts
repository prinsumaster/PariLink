import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ProfitabilityService } from './profitability.service';

@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('profitability')
export class ProfitabilityController {
  constructor(private readonly profitabilityService: ProfitabilityService) {}

  @Get('summary')
  @RequirePermissions('finance:read')
  async companySummary(
    @GetUser() user: AuthenticatedUser,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.profitabilityService.companySummary(user.companyId, from, to);
  }

  @Get('trips')
  @RequirePermissions('finance:read')
  async listTripPnl(
    @GetUser() user: AuthenticatedUser,
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    const p = page ? parseInt(page, 10) : 1;
    const l = limit ? parseInt(limit, 10) : 20;
    return this.profitabilityService.listTripPnl(user.companyId, p, l);
  }

  @Get('trips/:id')
  @RequirePermissions('finance:read')
  async tripPnl(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.profitabilityService.tripPnl(user.companyId, id);
  }

  @Get('vehicles/:id')
  @RequirePermissions('finance:read')
  async vehiclePnl(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.profitabilityService.vehiclePnl(user.companyId, id);
  }
}
