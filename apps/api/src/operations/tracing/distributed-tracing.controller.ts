import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import { DistributedTracingService } from './distributed-tracing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import {
  IsString,
  IsOptional,
  IsNumber,
  IsObject,
  IsArray,
  IsISO8601,
  IsNotEmpty,
} from 'class-validator';

export class RecordSpanDto {
  @IsString()
  @IsNotEmpty()
  traceId!: string;

  @IsString()
  @IsNotEmpty()
  spanId!: string;

  @IsString()
  @IsOptional()
  parentSpanId?: string;

  @IsString()
  @IsNotEmpty()
  serviceName!: string;

  @IsString()
  @IsNotEmpty()
  operationName!: string;

  @IsString()
  @IsISO8601()
  startTime!: string;

  @IsString()
  @IsISO8601()
  endTime!: string;

  @IsNumber()
  durationMs!: number;

  @IsString()
  @IsNotEmpty()
  status!: string;

  @IsObject()
  @IsOptional()
  tags?: Record<string, unknown>;

  @IsArray()
  @IsOptional()
  events?: Record<string, unknown>[];
}

export class SearchTracesDto {
  @IsString()
  @IsOptional()
  serviceName?: string;

  @IsString()
  @IsOptional()
  operationName?: string;

  @IsString()
  @IsOptional()
  status?: string;

  @IsNumber()
  @IsOptional()
  minDurationMs?: number;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

@ApiTags('Operations - Distributed Tracing')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/tracing')
export class DistributedTracingController {
  constructor(private readonly tracingService: DistributedTracingService) {}

  @Post('span')
  @RequirePermissions('operations:tracing:write')
  @ApiOperation({
    summary:
      'Record a trace span (HTTP, Queue, Workflow, DB, ExternalAPI, Webhook)',
  })
  async recordSpan(
    @GetUser() user: { companyId: string },
    @Body() body: RecordSpanDto,
  ) {
    return this.tracingService.recordSpan({
      traceId: body.traceId,
      spanId: body.spanId,
      parentSpanId: body.parentSpanId || null,
      companyId: user.companyId,
      serviceName: body.serviceName,
      operationName: body.operationName,
      startTime: new Date(body.startTime),
      endTime: new Date(body.endTime),
      durationMs: body.durationMs,
      status: body.status,
      tags: body.tags || {},
      events: body.events || [],
    });
  }

  @Get('trace/:traceId')
  @RequirePermissions('operations:tracing:read')
  @ApiOperation({
    summary:
      'Get full distributed trace with all child spans assembled in waterfall order (Trace Explorer)',
  })
  async getTrace(
    @GetUser() user: { companyId: string },
    @Param('traceId') traceId: string,
  ) {
    return this.tracingService.getTraceTree(traceId);
  }

  @Post('search')
  @RequirePermissions('operations:tracing:read')
  @ApiOperation({
    summary: 'Search traces by service, operation, status, or minimum duration',
  })
  async searchTraces(
    @GetUser() user: { companyId: string },
    @Body() filter: SearchTracesDto,
  ) {
    return this.tracingService.searchTraces({
      ...filter,
      companyId: user.companyId,
    });
  }

  @Get('slowest')
  @RequirePermissions('operations:tracing:read')
  @ApiOperation({ summary: 'Get top-N slowest trace spans sorted by duration' })
  async getSlowestSpans(
    @GetUser() user: { companyId: string },
    @Query('limit') limit = '20',
  ) {
    return this.tracingService.searchTraces({
      companyId: user.companyId,
      minDurationMs: 500,
      limit: parseInt(limit, 10),
    });
  }
}
