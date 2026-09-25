import {
  Controller,
  Get,
  Post,
  Patch,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { FuelService } from './fuel.service';
import { RequireAuth } from '../auth/decorators/require-auth.decorator';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('fuel')
@RequireAuth()
@Controller()
export class FuelController {
  constructor(private readonly fuelService: FuelService) {}

  // --- FUEL CARDS ---
  @Get('fuel-cards')
  @RequirePermissions('fleet:read')
  @ApiOperation({ summary: 'List all fuel cards' })
  getFuelCards(@GetUser() user: AuthenticatedUser) {
    return this.fuelService.getFuelCards(user.companyId);
  }

  @Post('fuel-cards')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Create a new fuel card' })
  createFuelCard(@GetUser() user: AuthenticatedUser, @Body() dto: any) {
    return this.fuelService.createFuelCard(user.companyId, dto);
  }

  @Get('fuel-cards/:id/billing-status')
  @RequirePermissions('fleet:read')
  @ApiOperation({ summary: 'Check if fuel card is overdue' })
  getFuelCardBillingStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.fuelService.getFuelCardBillingStatus(user.companyId, id);
  }

  // --- FUEL LOGS ---
  @Get('fuel-logs')
  @RequirePermissions('fleet:read')
  @ApiOperation({ summary: 'List all fuel logs' })
  getFuelLogs(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status?: string,
  ) {
    return this.fuelService.getFuelLogs(user.companyId, status);
  }

  @Post('fuel-logs')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Create a new fuel log request' })
  createFuelLog(@GetUser() user: AuthenticatedUser, @Body() dto: any) {
    return this.fuelService.createFuelLog(user.companyId, dto);
  }

  @Patch('fuel-logs/:id/approve')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Approve a fuel log request and generate OTP' })
  approveFuelLog(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.fuelService.approveFuelLog(user.companyId, id);
  }

  @Post('fuel-logs/:id/fill')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Complete a fuel log fill using OTP' })
  fillFuelLog(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { otp: string },
  ) {
    return this.fuelService.fillFuelLog(user.companyId, id, body.otp);
  }

  @Patch('fuel-logs/:id/status')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Legacy generic status update' })
  updateFuelLogStatus(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() body: { status: string },
  ) {
    return this.fuelService.updateFuelLogStatus(
      user.companyId,
      id,
      body.status,
    );
  }
}
