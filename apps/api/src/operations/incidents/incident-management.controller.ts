import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  IncidentManagementService
} from './incident-management.service';
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
  ValidateNested,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum IncidentSeverity {
  SEV1 = 'SEV1',
  SEV2 = 'SEV2',
  SEV3 = 'SEV3',
  SEV4 = 'SEV4',
}

export enum IncidentStatus {
  INVESTIGATING = 'INVESTIGATING',
  IDENTIFIED = 'IDENTIFIED',
  MONITORING = 'MONITORING',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED',
}

export enum ActionItemStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

export class CreateIncidentDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsEnum(IncidentSeverity)
  severity!: IncidentSeverity;

  @IsString()
  @IsOptional()
  assignedToId?: string;

  @IsArray()
  @IsString({ each: true })
  affectedServices!: string[];
}

export class UpdateIncidentStatusDto {
  @IsEnum(IncidentStatus)
  status!: IncidentStatus;

  @IsString()
  @IsOptional()
  rootCause?: string;

  @IsString()
  @IsOptional()
  mitigationSteps?: string;
}

export class TimelineEventDto {
  @IsString()
  @IsNotEmpty()
  eventType!: string;

  @IsString()
  @IsNotEmpty()
  description!: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, unknown>;
}

export class ActionItemDto {
  @IsString()
  @IsNotEmpty()
  id!: string;

  @IsString()
  @IsNotEmpty()
  task!: string;

  @IsString()
  @IsNotEmpty()
  ownerId!: string;

  @IsEnum(ActionItemStatus)
  status!: ActionItemStatus;
}

export class PostmortemDto {
  @IsString()
  @IsNotEmpty()
  title!: string;

  @IsString()
  @IsNotEmpty()
  summary!: string;

  @IsString()
  @IsNotEmpty()
  rootCauseAnalysis!: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ActionItemDto)
  actionItems!: ActionItemDto[];

  @IsString()
  @IsOptional()
  preventativeMeasures?: string;
}

@ApiTags('Operations - Incident Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/incidents')
export class IncidentManagementController {
  constructor(private readonly incidentService: IncidentManagementService) {}

  @Post()
  @RequirePermissions('operations:incidents:write')
  @ApiOperation({
    summary:
      'Create a new production incident (SEV1-SEV4) and initialize timeline',
  })
  async createIncident(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Body() body: CreateIncidentDto,
  ) {
    return this.incidentService.createIncident({
      ...body,
      companyId: user.companyId,
      actorId: user.userId || user.id,
    });
  }

  @Post(':id/status')
  @RequirePermissions('operations:incidents:write')
  @ApiOperation({
    summary:
      'Transition incident status and record root cause or mitigation steps',
  })
  async updateStatus(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
    @Body() body: UpdateIncidentStatusDto,
  ) {
    return this.incidentService.updateIncidentStatus({
      ...body,
      incidentId: id,
      companyId: user.companyId,
      actorId: user.userId || user.id,
    });
  }

  @Post(':id/timeline')
  @RequirePermissions('operations:incidents:write')
  @ApiOperation({
    summary:
      'Add a note, action taken, or alert link to the incident chronological timeline',
  })
  async addTimelineEvent(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
    @Body() body: TimelineEventDto,
  ) {
    return this.incidentService.addTimelineEvent({
      incidentId: id,
      companyId: user.companyId,
      eventType: body.eventType,
      description: body.description,
      metadata: body.metadata || {},
      actorId: user.userId || user.id,
    });
  }

  @Get('metrics')
  @RequirePermissions('operations:incidents:read')
  @ApiOperation({ summary: 'Calculate MTTD, MTTR, and severity counts' })
  async getMetrics(
    @GetUser() user: { companyId: string; role?: string },
    @Query('companyId') queryCompanyId?: string,
  ) {
    const targetCompanyId =
      user.role === 'SUPER_ADMIN'
        ? queryCompanyId || user.companyId
        : user.companyId;
    return this.incidentService.getIncidentMetrics(targetCompanyId);
  }

  @Get(':id')
  @RequirePermissions('operations:incidents:read')
  @ApiOperation({
    summary:
      'Get incident details with full timeline and attached postmortem report',
  })
  async getIncident(
    @GetUser() user: { companyId: string },
    @Param('id') id: string,
  ) {
    return this.incidentService.getIncidentDetails(user.companyId, id);
  }

  @Post(':id/postmortem')
  @RequirePermissions('operations:incidents:write')
  @ApiOperation({
    summary:
      'Generate or update structured postmortem report for a resolved incident',
  })
  async savePostmortem(
    @GetUser() user: { companyId: string; userId?: string; id?: string },
    @Param('id') id: string,
    @Body() body: PostmortemDto,
  ) {
    return this.incidentService.savePostmortem({
      ...body,
      incidentId: id,
      companyId: user.companyId,
      authorId: user.userId || user.id,
    });
  }
}
