import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { AlertEngineService } from './alert-engine.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsObject,
  IsISO8601,
  IsNotEmpty,
} from 'class-validator';

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export class AlertTriggerDto {
  @IsString()
  @IsOptional()
  ruleId?: string;

  @IsString()
  @IsNotEmpty()
  type!: string;

  @IsEnum(AlertSeverity)
  severity!: AlertSeverity;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  vehicleId?: string;

  @IsString()
  @IsOptional()
  driverId?: string;
}

export class CreateMaintenanceWindowDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsISO8601()
  startTime!: string;

  @IsString()
  @IsISO8601()
  endTime!: string;

  @IsArray()
  @IsString({ each: true })
  affectedServices!: string[];
}

export class CreateEscalationPolicyDto {
  @IsString()
  @IsNotEmpty()
  name!: string;

  @IsString()
  @IsNotEmpty()
  severity!: string;

  @IsArray()
  steps!: Record<string, unknown>[];
}

@ApiTags('Operations - Alert Engine')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/alerts')
export class AlertEngineController {
  constructor(private readonly alertService: AlertEngineService) {}

  @Post('trigger')
  @RequirePermissions('operations:alerts:write')
  @ApiOperation({
    summary:
      'Trigger an alert (checking threshold rules and maintenance window suppression)',
  })
  async triggerAlert(
    @GetUser() user: { companyId: string },
    @Body() body: AlertTriggerDto,
  ) {
    return this.alertService.triggerAlert({
      ...body,
      companyId: user.companyId,
    });
  }

  @Post(':id/ack')
  @RequirePermissions('operations:alerts:write')
  @ApiOperation({ summary: 'Acknowledge an active alert' })
  async acknowledgeAlert(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
  ) {
    return this.alertService.acknowledgeAlert(
      user.companyId,
      id,
      user.userId || user.id,
    );
  }

  @Post(':id/resolve')
  @RequirePermissions('operations:alerts:write')
  @ApiOperation({ summary: 'Resolve an active alert' })
  async resolveAlert(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
  ) {
    return this.alertService.resolveAlert(
      user.companyId,
      id,
      user.userId || user.id,
    );
  }

  @Post('maintenance-window')
  @RequirePermissions('operations:alerts:admin')
  @ApiOperation({
    summary:
      'Create a maintenance window (suppresses alerts for affected subsystems)',
  })
  async createMaintenanceWindow(
    @GetUser() user: { companyId: string },
    @Body() body: CreateMaintenanceWindowDto,
  ) {
    return this.alertService.createMaintenanceWindow({
      companyId: user.companyId,
      name: body.name,
      description: body.description,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      affectedServices: body.affectedServices,
    });
  }

  @Post('escalation-policy')
  @RequirePermissions('operations:alerts:admin')
  @ApiOperation({ summary: 'Create an alert escalation policy' })
  async createEscalationPolicy(
    @GetUser() user: { companyId: string },
    @Body() body: CreateEscalationPolicyDto,
  ) {
    return this.alertService.createEscalationPolicy({
      companyId: user.companyId,
      name: body.name,
      severity: body.severity,
      steps: body.steps,
    });
  }
}
