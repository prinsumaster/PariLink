import { Controller, Get, Post, Patch, Body, Param, Query, UseGuards } from '@nestjs/common';
import { FuelService } from './fuel.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('fuel-logs')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('fuel-logs')
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  @Get()
  @RequirePermissions('fleet:read')
  @ApiOperation({ summary: 'List all fuel logs' })
  getFuelLogs(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.fuelService.getFuelLogs(user.companyId, status);
  }

  @Post()
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Create a new fuel log' })
  createFuelLog(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: any,
  ) {
    return this.fuelService.createFuelLog(user.companyId, dto);
  }

  @Patch(':id/status')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Approve or update fuel log status' })
  updateFuelLogStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.fuelService.updateFuelLogStatus(user.companyId, id, body.status);
  }
}
