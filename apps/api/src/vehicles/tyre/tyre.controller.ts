import { RemoveTyreDto } from './dto/remove-tyre.dto';
import { FitTyreDto } from './dto/fit-tyre.dto';
import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { TyreService } from './tyre.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('tyres')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller()
export class TyreController {
  constructor(private readonly tyreService: TyreService) {}

  @Post('vehicles/:id/tyres')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Fit a tyre on a vehicle' })
  async fitTyre(
    @GetUser() user: AuthenticatedUser,
    @Param('id') vehicleId: string,
    @Body() data: FitTyreDto,
  ) {
    return this.tyreService.fitTyre(user.companyId, vehicleId, data);
  }

  @Post('tyres/:id/remove')
  @RequirePermissions('fleet:write')
  @ApiOperation({ summary: 'Remove a tyre' })
  async removeTyre(
    @GetUser() user: AuthenticatedUser,
    @Param('id') tyreId: string,
    @Body() data: RemoveTyreDto,
  ) {
    return this.tyreService.removeTyre(user.companyId, tyreId, data);
  }

  @Get('vehicles/:id/tyres')
  @RequirePermissions('fleet:read')
  @ApiOperation({ summary: 'Get active tyres for a vehicle' })
  async getVehicleTyres(
    @GetUser() user: AuthenticatedUser,
    @Param('id') vehicleId: string,
    @Query('currentKm') currentKm?: string,
  ) {
    return this.tyreService.getVehicleTyres(user.companyId, vehicleId, currentKm ? Number(currentKm) : 0);
  }
}
