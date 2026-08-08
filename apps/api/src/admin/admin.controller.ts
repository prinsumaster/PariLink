import { Controller, Get, Logger, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';

@ApiTags('Admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  @Get('dashboard')
  @RequirePermissions('system:admin')
  getAdminDashboard() {
    this.logger.log('Fetching global admin dashboard metrics');
    return {
      totalTenants: 154,
      activeUsers: 8432,
      apiUsage: 4500000,
      mrr: 245000,
    };
  }

  @Get('health')
  getSystemHealth() {
    return {
      status: 'healthy',
      postgres: 'connected',
      redis: 'connected',
      activeQueues: 5,
    };
  }
}
