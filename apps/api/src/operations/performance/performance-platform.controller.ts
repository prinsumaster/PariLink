import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import {
  PerformancePlatformService,
  PerformanceProfileInput,
} from './performance-platform.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

import { IsString, IsOptional, IsNumber, IsEnum, IsObject, IsNotEmpty } from 'class-validator';

export enum ProfileType {
  SLOW_QUERY = 'SLOW_QUERY',
  CPU_SPIKE = 'CPU_SPIKE',
  MEMORY_LEAK = 'MEMORY_LEAK',
  HIGH_LATENCY = 'HIGH_LATENCY',
  CACHE_MISS_ANOMALY = 'CACHE_MISS_ANOMALY',
}

export class CreatePerformanceProfileDto {
  @IsEnum(ProfileType)
  profileType!: ProfileType;

  @IsString()
  @IsNotEmpty()
  targetResource!: string;

  @IsNumber()
  metricValue!: number;

  @IsNumber()
  thresholdValue!: number;

  @IsString()
  @IsOptional()
  stackTraceOrQuery?: string;

  @IsObject()
  @IsOptional()
  analysisDetails?: Record<string, unknown>;
}

@ApiTags('Operations - Performance Profiling')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/performance')
export class PerformancePlatformController {
  constructor(private readonly performanceService: PerformancePlatformService) {}

  @Post('profiles')
  @RequirePermissions('operations:performance:write')
  @ApiOperation({
    summary:
      'Log an anomalous performance profile (slow query, cpu spike, memory leak)',
  })
  async submitPerformanceProfile(
    @GetUser() user: { companyId: string },
    @Body() body: CreatePerformanceProfileDto,
  ) {
    return this.performanceService.recordProfile({
      ...body,
      companyId: user.companyId,
    });
  }

  @Get('slow-queries')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({
    summary: 'Get top slow database queries ranked by execution time',
  })
  async getSlowQueries(
    @GetUser() user: { companyId: string },
    @Query('limit') limit = '20',
  ) {
    return this.performanceService.getSlowQueries(user.companyId, parseInt(limit, 10));
  }

  @Get('resource-utilization')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({
    summary: 'Get CPU, memory heap, GC, and disk utilization diagnostics',
  })
  async getResourceUtilization() {
    return this.performanceService.getResourceUtilization();
  }

  @Get('cache')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({ summary: 'Get Redis cache hit/miss ratio and eviction rate' })
  async getCachePerformance() {
    return this.performanceService.getCachePerformance();
  }

  @Get('workflows')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({
    summary: 'Get workflow execution and queue processing latency metrics',
  })
  async getWorkflowPerformance(@GetUser() user: { companyId: string }) {
    return this.performanceService.getWorkflowAndQueuePerformance(user.companyId);
  }
}
