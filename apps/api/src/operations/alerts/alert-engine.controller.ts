import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AlertEngineService, AlertTriggerInput } from './alert-engine.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

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
    @Body() body: Record<string, unknown>,
  ) {
    return this.alertService.triggerAlert({
      ...(body as unknown as AlertTriggerInput),
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
    @Body()
    body: {
      name: string;
      description?: string;
      startTime: string;
      endTime: string;
      affectedServices: string[];
    },
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
    @Body()
    body: { name: string; severity: string; steps: Record<string, unknown>[] },
  ) {
    return this.alertService.createEscalationPolicy({
      companyId: user.companyId,
      name: body.name,
      severity: body.severity,
      steps: body.steps,
    });
  }
}
