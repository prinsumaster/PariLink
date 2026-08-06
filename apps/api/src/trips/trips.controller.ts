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
import { TripsService } from './trips.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripQueryDto } from './dto/trip-query.dto';
import { AssignLoadsDto } from './dto/assign-loads.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('trips')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('trips')
export class TripsController {
  constructor(private readonly tripsService: TripsService) {}

  @Post()
  @RequirePermissions('trips:create')
  @ApiOperation({ summary: 'Create a new trip' })
  create(
    @GetUser() user: AuthenticatedUser,
    @Body() createTripDto: CreateTripDto,
  ) {
    return this.tripsService.create(user.companyId, createTripDto);
  }

  @Get()
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'List trips for current company' })
  findAll(@GetUser() user: AuthenticatedUser, @Query() query: TripQueryDto) {
    return this.tripsService.findAll(user.companyId, query);
  }

  @Get(':id')
  @RequirePermissions('trips:read')
  @ApiOperation({ summary: 'Get a trip by ID' })
  findOne(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tripsService.findOne(user.companyId, id);
  }

  @Patch(':id')
  @RequirePermissions('trips:update')
  @ApiOperation({ summary: 'Update a trip' })
  update(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() updateTripDto: UpdateTripDto,
  ) {
    return this.tripsService.update(user.companyId, id, updateTripDto);
  }

  @Post(':id/loads')
  @RequirePermissions('trips:update')
  @ApiOperation({ summary: 'Assign loads to a trip' })
  assignLoads(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() assignLoadsDto: AssignLoadsDto,
  ) {
    return this.tripsService.assignLoads(
      user.companyId,
      id,
      assignLoadsDto.loadIds,
    );
  }

  @Delete(':id')
  @RequirePermissions('trips:delete')
  @ApiOperation({ summary: 'Cancel/Delete a trip' })
  remove(@GetUser() user: AuthenticatedUser, @Param('id') id: string) {
    return this.tripsService.remove(user.companyId, id);
  }
}
