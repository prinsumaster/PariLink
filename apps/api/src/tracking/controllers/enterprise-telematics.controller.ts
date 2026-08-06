import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import {
  VehicleTelemetryDto,
  CreateGeofenceDto,
  CreateAlertRuleDto,
  UpdateAlertStatusDto,
} from '../dto/telematics.dto';

import { GeofenceEngineService } from '../services/geofence-engine.service';
import { TelematicsIngestionService } from '../services/telematics-ingestion.service';

@ApiTags('Enterprise Fleet Telematics, IoT & Geofence Intelligence Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('tracking/enterprise')
export class EnterpriseTelematicsController {
  constructor(
    private readonly geofenceEngine: GeofenceEngineService,
    private readonly telematicsService: TelematicsIngestionService,
  ) {}

  // --- TELEMETRY INGESTION ---
  @Post('telemetry')
  @RequirePermissions('tracking:write')
  @ApiOperation({
    summary:
      'Ingest real-time OBD-II and CAN-bus telemetry and evaluate alert rules',
  })
  async ingestTelemetry(
    @Body() dto: VehicleTelemetryDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.telematicsService.ingestTelemetry(user.companyId, dto);
  }

  // --- GEOFENCE MANAGEMENT ---
  @Post('geofences')
  @RequirePermissions('tracking:write')
  @ApiOperation({ summary: 'Create circular or polygon geofence' })
  async createGeofence(
    @Body() dto: CreateGeofenceDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.geofenceEngine.createGeofence(user.companyId, user.userId, dto);
  }

  @Get('geofences')
  @RequirePermissions('tracking:read')
  @ApiOperation({ summary: 'List active geofences' })
  async getGeofences(
    @Query('type') type?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.geofenceEngine.getGeofences(user.companyId, type);
  }

  @Get('geofences/:id')
  @RequirePermissions('tracking:read')
  @ApiOperation({ summary: 'Get geofence by ID with recent transition events' })
  async getGeofenceById(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.geofenceEngine.getGeofenceById(user.companyId, id);
  }

  @Delete('geofences/:id')
  @RequirePermissions('tracking:write')
  @ApiOperation({ summary: 'Delete geofence' })
  async deleteGeofence(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.geofenceEngine.deleteGeofence(user.companyId, id, user.userId);
  }

  @Post('geofences/evaluate')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('tracking:write')
  @ApiOperation({
    summary:
      'Evaluate GPS location against geofences and record boundary transitions',
  })
  async evaluateLocation(
    @Body()
    dto: {
      vehicleId: string;
      latitude: number;
      longitude: number;
      timestamp?: string;
    },
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.geofenceEngine.evaluateLocationAgainstGeofences(
      user.companyId,
      dto.vehicleId,
      dto.latitude,
      dto.longitude,
      dto.timestamp ? new Date(dto.timestamp) : new Date(),
    );
  }

  @Get('geofence-events')
  @RequirePermissions('tracking:read')
  @ApiOperation({
    summary: 'View recent geofence boundary transition and dwell time events',
  })
  async getGeofenceEvents(
    @Query('geofenceId') geofenceId?: string,
    @Query('vehicleId') vehicleId?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.geofenceEngine.getGeofenceEvents(
      user.companyId,
      geofenceId,
      vehicleId,
    );
  }

  // --- ALERT RULES & FLEET HEALTH ---
  @Post('alert-rules')
  @RequirePermissions('tracking:write')
  @ApiOperation({ summary: 'Create IoT/telematics alert rule' })
  async createAlertRule(
    @Body() dto: CreateAlertRuleDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.telematicsService.createAlertRule(
      user.companyId,
      user.userId,
      dto,
    );
  }

  @Get('alert-rules')
  @RequirePermissions('tracking:read')
  @ApiOperation({ summary: 'List alert rules' })
  async getAlertRules(@GetUser() user: AuthenticatedUser) {
    return this.telematicsService.getAlertRules(user.companyId);
  }

  @Delete('alert-rules/:id')
  @RequirePermissions('tracking:write')
  @ApiOperation({ summary: 'Delete alert rule' })
  async deleteAlertRule(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.telematicsService.deleteAlertRule(
      user.companyId,
      id,
      user.userId,
    );
  }

  @Get('alerts')
  @RequirePermissions('tracking:read')
  @ApiOperation({ summary: 'List generated telematics and safety alerts' })
  async getAlerts(
    @Query('status') status?: string,
    @Query('vehicleId') vehicleId?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.telematicsService.getAlerts(user.companyId, status, vehicleId);
  }

  @Put('alerts/:id/status')
  @RequirePermissions('tracking:write')
  @ApiOperation({ summary: 'Acknowledge or resolve an alert' })
  async updateAlertStatus(
    @Param('id') id: string,
    @Body() dto: UpdateAlertStatusDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.telematicsService.updateAlertStatus(
      user.companyId,
      id,
      user.userId,
      dto,
    );
  }

  @Get('analytics')
  @RequirePermissions('tracking:read')
  @ApiOperation({ summary: 'Get real-time fleet health and safety analytics' })
  async getAnalytics(@GetUser() user: AuthenticatedUser) {
    return this.telematicsService.getFleetHealthAnalytics(user.companyId);
  }
}
