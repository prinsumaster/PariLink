import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
export class AdminController {
  private readonly logger = new Logger(AdminController.name);

  @Get('dashboard')
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
