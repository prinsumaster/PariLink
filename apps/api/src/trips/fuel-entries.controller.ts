import { CreateFuelEntryDto } from './dto/create-fuel-entry.dto';
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { FuelEntriesService } from './fuel-entries.service';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trips-fuel')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('trips')
export class FuelEntriesController {
  constructor(private readonly fuelEntriesService: FuelEntriesService) {}

  @Post(':id/fuel')
  @RequirePermissions('trips:update')
  @ApiOperation({ summary: 'Add a fuel entry to a trip' })
  addFuel(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() dto: CreateFuelEntryDto,
  ) {
    return this.fuelEntriesService.addFuel(user.companyId, id, dto);
  }

  @Get(':id/fuel')
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'Get fuel entries for a trip' })
  getFuel(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
  ) {
    return this.fuelEntriesService.getFuelByTrip(user.companyId, id);
  }
}
