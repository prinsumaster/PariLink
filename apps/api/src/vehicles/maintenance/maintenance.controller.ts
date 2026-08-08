import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { MaintenanceService } from './maintenance.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('maintenance')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('vehicles/maintenance')
export class MaintenanceController {
  constructor(private readonly maintenance: MaintenanceService) {}

  @Post('workshops')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create Workshop' })
  async createWorkshop(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.maintenance.createWorkshop(user.companyId, data, user.id);
  }

  @Get('workshops')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Workshops' })
  async getWorkshops(@GetUser() user: AuthenticatedUser) {
    return this.maintenance.getWorkshops(user.companyId);
  }

  @Post('mechanics')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create Mechanic' })
  async createMechanic(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.maintenance.createMechanic(user.companyId, data, user.id);
  }

  @Get('mechanics')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Mechanics' })
  async getMechanics(
    @GetUser() user: AuthenticatedUser,
    @Query('workshopId') workshopId?: string,
  ) {
    return this.maintenance.getMechanics(user.companyId, workshopId);
  }

  @Post('job-cards')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create Job Card (Repair Order)' })
  async createJobCard(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.maintenance.createJobCard(user.companyId, data, user.id);
  }

  @Get('job-cards')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Job Cards' })
  async getJobCards(
    @GetUser() user: AuthenticatedUser,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.maintenance.getJobCards(user.companyId, vehicleId);
  }

  @Put('job-cards/:id/close')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Close Job Card' })
  async closeJobCard(
    @GetUser() user: AuthenticatedUser,
    @Param('id') id: string,
    @Body() data: any,
  ) {
    return this.maintenance.closeJobCard(user.companyId, id, data, user.id);
  }

  @Post('schedules')
  @RequirePermissions('vehicles:write')
  @ApiOperation({ summary: 'Create Maintenance Schedule' })
  async createSchedule(@GetUser() user: AuthenticatedUser, @Body() data: any) {
    return this.maintenance.createSchedule(user.companyId, data, user.id);
  }

  @Get('schedules')
  @RequirePermissions('vehicles:read')
  @ApiOperation({ summary: 'Get Maintenance Schedules' })
  async getSchedules(
    @GetUser() user: AuthenticatedUser,
    @Query('vehicleId') vehicleId?: string,
  ) {
    return this.maintenance.getSchedules(user.companyId, vehicleId);
  }
}
