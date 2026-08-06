import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import { VehiclesService } from './vehicles.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import {
  LicenseCapacityGuard,
  CheckCapacity,
} from '../platform/guards/license-capacity.guard';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('vehicles')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vehicles')
export class VehiclesController {
  constructor(private readonly vehiclesService: VehiclesService) {}

  @Post()
  @RequirePermissions('vehicles:create')
  @CheckCapacity('vehicle')
  @UseGuards(LicenseCapacityGuard)
  @ApiOperation({ summary: 'Create a new vehicle (License capacity enforced)' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createVehicleDto: CreateVehicleDto,
  ) {
    return this.vehiclesService.create(user.companyId, createVehicleDto);
  }

  @Get()
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'List vehicles for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: VehicleQueryDto) {
    return this.vehiclesService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get a vehicle by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.vehiclesService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('vehicles:update')
  @ApiOperation({ summary: 'Update a vehicle' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateVehicleDto: UpdateVehicleDto,
  ) {
    return this.vehiclesService.update(user.companyId, id, updateVehicleDto);
  }

  @Delete(':id')
  @RequirePermissions('vehicles:delete')
  @ApiOperation({ summary: 'Soft delete a vehicle' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.vehiclesService.remove(user.companyId, id);
  }
}
