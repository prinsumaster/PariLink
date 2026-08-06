import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  LoggingPlatformService,
  LogEntryInput,
  LogSearchFilter,
} from './logging-platform.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

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
    @Body() body: Omit<LogEntryInput, 'companyId'>,
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
    @Body() filter: Omit<LogSearchFilter, 'companyId'>,
  ) {
    return this.loggingService.searchLogs({
      ...filter,
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
    @Body()
    body: { from: string; to: string; format?: 'JSON' | 'CSV'; level?: string },
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
