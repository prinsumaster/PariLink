import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { FuelService } from './fuel.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('fuel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vehicles/fuel')
export class FuelController {
  constructor(private readonly fuel: FuelService) {}

  @Post('cards')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create Fuel Card' })
  async createFuelCard(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.fuel.createFuelCard(user.companyId, data, user.id);
  }

  @Get('cards')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Fuel Cards' })
  async getFuelCards(@GetUser() user: AuthenticatedUser) {
    return this.fuel.getFuelCards(user.companyId);
  }

  @Post('stations')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create Fuel Station' })
  async createFuelStation(
    @GetUser() user: AuthenticatedUser,
    @Body() data: any,
  ) {
    return this.fuel.createFuelStation(user.companyId, data, user.id);
  }

  @Get('stations')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Fuel Stations' })
  async getFuelStations(@GetUser() user: AuthenticatedUser) {
    return this.fuel.getFuelStations(user.companyId);
  }

  @Post('transactions')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Log Fuel Transaction' })
  async logFuelTransaction(
    @GetUser() user: AuthenticatedUser,
    @Body() data: any,
  ) {
    return this.fuel.logFuelTransaction(user.companyId, data, user.id);
  }

  @Get('transactions')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Fuel Transactions' })
  async getFuelTransactions(
    @GetUser() user: AuthenticatedUser,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.fuel.getFuelTransactions(user.companyId, vehicleId);
  }
}
