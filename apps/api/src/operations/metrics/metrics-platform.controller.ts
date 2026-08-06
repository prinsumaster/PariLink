import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  MetricsPlatformService,
  MetricQueryFilter,
} from './metrics-platform.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Operations - Metrics Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/metrics')
export class MetricsPlatformController {
  constructor(private readonly metricsService: MetricsPlatformService) {}

  @Post()
  @RequirePermissions('operations:metrics:write')
  @ApiOperation({
    summary: 'Record custom metric datapoint with multi-dimensional tags',
  })
  async recordMetric(
    @GetUser() user: { companyId: string },
    @Body()
    body: {
      category: string;
      metricName: string;
      metricValue: number;
      dimensions?: Record<string, unknown>;
    },
  ) {
    return this.metricsService.recordMetric(
      user.companyId,
      body.category,
      body.metricName,
      body.metricValue,
      body.dimensions || {},
    );
  }

  @Post('query')
  @RequirePermissions('operations:metrics:read')
  @ApiOperation({
    summary: 'Query historical metrics with time series aggregation',
  })
  async queryMetrics(
    @GetUser() user: { companyId: string },
    @Body() filter: Record<string, unknown>,
  ) {
    return this.metricsService.queryMetrics({
      ...(filter as MetricQueryFilter),
      companyId: user.companyId,
    });
  }

  @Get('dashboard')
  @RequirePermissions('operations:metrics:read')
  @ApiOperation({
    summary:
      'Get comprehensive metrics dashboard across System, Business, Queue, API, and Database',
  })
  async getDashboard(@GetUser() user: { companyId: string }) {
    return this.metricsService.getComprehensiveMetricsDashboard(user.companyId);
  }

  @Get('system')
  @RequirePermissions('operations:metrics:read')
  @ApiOperation({ summary: 'Get live CPU, memory, and disk usage metrics' })
  async getSystemMetrics() {
    return this.metricsService.getSystemMetrics();
  }

  @Get('tenant')
  @RequirePermissions('operations:metrics:read')
  @ApiOperation({
    summary:
      'Get tenant utilization metrics (storage, API volume, active users)',
  })
  async getTenantMetrics(@GetUser() user: { companyId: string }) {
    return this.metricsService.getTenantMetrics(user.companyId);
  }
}
