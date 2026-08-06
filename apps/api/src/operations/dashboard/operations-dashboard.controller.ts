import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { OperationsDashboardService } from './operations-dashboard.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Operations - Enterprise Operations Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@SkipThrottle()
@Controller('operations/dashboard')
export class OperationsDashboardController {
  constructor(private readonly dashboardService: OperationsDashboardService) {}

  @Get('snapshot')
  @RequirePermissions('operations:dashboard:read')
  @ApiOperation({
    summary:
      'Get Enterprise Operations Dashboard snapshot: health, incidents, alerts, jobs, capacity, security',
  })
  async getSnapshot(
    @GetUser() user: { companyId: string; role?: string },
    @Query('companyId') queryCompanyId?: string,
  ) {
    const targetCompanyId =
      user.role === 'SUPER_ADMIN'
        ? queryCompanyId || user.companyId
        : user.companyId;
    return this.dashboardService.getDashboardSnapshot(targetCompanyId);
  }
}
