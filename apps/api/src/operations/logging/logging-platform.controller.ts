import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import {
  LoggingPlatformService,
  LogSearchFilter,
} from './logging-platform.service';
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
  IsEnum,
  IsISO8601,
  IsNotEmpty,
} from 'class-validator';

export enum LogLevel {
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
  DEBUG = 'DEBUG',
  FATAL = 'FATAL',
}

export enum ExportFormat {
  JSON = 'JSON',
  CSV = 'CSV',
}

export class LogEntryDto {
  @IsEnum(LogLevel)
  level!: LogLevel;

  @IsString()
  @IsNotEmpty()
  service!: string;

  @IsString()
  @IsNotEmpty()
  message!: string;

  @IsObject()
  @IsOptional()
  structuredData?: Record<string, unknown>;

  @IsString()
  @IsOptional()
  correlationId?: string;

  @IsString()
  @IsOptional()
  traceId?: string;

  @IsString()
  @IsOptional()
  spanId?: string;

  @IsOptional()
  error?: unknown;
}

export class LogSearchFilterDto {
  @IsString()
  @IsOptional()
  level?: string;

  @IsString()
  @IsOptional()
  service?: string;

  @IsString()
  @IsOptional()
  query?: string;

  @IsString()
  @IsOptional()
  correlationId?: string;

  @IsString()
  @IsOptional()
  traceId?: string;

  @IsString()
  @IsOptional()
  errorGroup?: string;

  @IsString()
  @IsISO8601()
  @IsOptional()
  startTime?: string;

  @IsString()
  @IsISO8601()
  @IsOptional()
  endTime?: string;

  @IsNumber()
  @IsOptional()
  limit?: number;
}

export class ExportLogsDto {
  @IsString()
  @IsISO8601()
  from!: string;

  @IsString()
  @IsISO8601()
  to!: string;

  @IsEnum(ExportFormat)
  @IsOptional()
  format?: ExportFormat;

  @IsString()
  @IsOptional()
  level?: string;
}

@ApiTags('Operations - Logging Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/logs')
export class LoggingPlatformController {
  constructor(private readonly loggingService: LoggingPlatformService) {}

  @Post()
  @RequirePermissions('operations:logs:write')
  @ApiOperation({
    summary:
      'Ingest a structured log entry with automatic sensitive data redaction',
  })
  async log(
    @GetUser() user: { companyId: string },
    @Body() body: LogEntryDto,
  ) {
    return this.loggingService.log({ ...body, companyId: user.companyId });
  }

  @Post('search')
  @RequirePermissions('operations:logs:read')
  @ApiOperation({
    summary:
      'Full-text search across all enterprise log records with level/service/time filters',
  })
  async searchLogs(
    @GetUser() user: { companyId: string },
    @Body() filter: LogSearchFilterDto,
  ) {
    return this.loggingService.searchLogs({
      ...filter,
      startTime: filter.startTime ? new Date(filter.startTime) : undefined,
      endTime: filter.endTime ? new Date(filter.endTime) : undefined,
      companyId: user.companyId,
    });
  }

  @Get('error-groups')
  @RequirePermissions('operations:logs:read')
  @ApiOperation({
    summary:
      'Get aggregated error groups by message fingerprint (Sentry-style error grouping)',
  })
  async getErrorGroups(@GetUser() user: { companyId: string }) {
    return this.loggingService.getErrorGroupsSummary(user.companyId);
  }

  @Post('export')
  @RequirePermissions('operations:logs:admin')
  @ApiOperation({
    summary:
      'Export enterprise logs to JSON/CSV for SIEM ingestion or compliance audit',
  })
  async exportLogs(
    @GetUser() user: { companyId: string },
    @Body() body: ExportLogsDto,
  ) {
    const filter: LogSearchFilter = {
      companyId: user.companyId,
      startTime: new Date(body.from),
      endTime: new Date(body.to),
      level: body.level,
    };
    return this.loggingService.exportLogs(filter, body.format || 'JSON');
  }
}
