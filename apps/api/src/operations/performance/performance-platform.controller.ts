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

@ApiTags('Operations - Performance Platform')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/performance')
export class PerformancePlatformController {
  constructor(private readonly perfService: PerformancePlatformService) {}

  @Post('profile')
  @RequirePermissions('operations:performance:write')
  @ApiOperation({
    summary:
      'Record a performance anomaly profile (slow query, CPU spike, memory leak, etc.)',
  })
  async recordProfile(
    @GetUser() user: { companyId: string },
    @Body() body: Omit<PerformanceProfileInput, 'companyId'>,
  ) {
    return this.perfService.recordProfile({
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
    return this.perfService.getSlowQueries(user.companyId, parseInt(limit, 10));
  }

  @Get('resource-utilization')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({
    summary: 'Get CPU, memory heap, GC, and disk utilization diagnostics',
  })
  async getResourceUtilization() {
    return this.perfService.getResourceUtilization();
  }

  @Get('cache')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({ summary: 'Get Redis cache hit/miss ratio and eviction rate' })
  async getCachePerformance() {
    return this.perfService.getCachePerformance();
  }

  @Get('workflows')
  @RequirePermissions('operations:performance:read')
  @ApiOperation({
    summary: 'Get workflow execution and queue processing latency metrics',
  })
  async getWorkflowPerformance(@GetUser() user: { companyId: string }) {
    return this.perfService.getWorkflowAndQueuePerformance(user.companyId);
  }
}
