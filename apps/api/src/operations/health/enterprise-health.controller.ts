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
  EnterpriseHealthService,
  GlobalHealthReport,
} from './enterprise-health.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Operations - Enterprise Health Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/health')
export class EnterpriseHealthController {
  constructor(private readonly healthService: EnterpriseHealthService) {}

  @Get('global')
  @RequirePermissions('operations:health:read')
  @ApiOperation({
    summary: 'Get Global Health Dashboard across all 10 system subsystems',
  })
  async getGlobalHealth(
    @GetUser() user: { companyId: string },
    @Query('companyId') queryCompanyId?: string,
  ): Promise<GlobalHealthReport> {
    const targetCompanyId = user.companyId;
    return this.healthService.getGlobalHealth(targetCompanyId);
  }

  @Get('api')
  @RequirePermissions('operations:health:read')
  @ApiOperation({ summary: 'Get API Gateway health diagnostics' })
  async getApiHealth(@GetUser() user: { companyId: string }) {
    return this.healthService.checkApiHealth(user.companyId);
  }

  @Get('database')
  @RequirePermissions('operations:health:read')
  @ApiOperation({
    summary: 'Get PostgreSQL database health and connection pool status',
  })
  async getDatabaseHealth() {
    return this.healthService.checkDatabaseHealth();
  }

  @Get('queues')
  @RequirePermissions('operations:health:read')
  @ApiOperation({
    summary: 'Get BullMQ async job queues health and backlog depth',
  })
  async getQueueHealth(@GetUser() user: { companyId: string }) {
    return this.healthService.checkQueueHealth(user.companyId);
  }
}
