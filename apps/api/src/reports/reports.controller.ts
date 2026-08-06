import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { GetUser } from '../auth/decorators/get-user.decorator';
import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import { ReportsService } from './reports.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../auth/guards/permissions.guard';
import { RequirePermissions } from '../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('reports')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportsService: ReportsService) {}

  @Get('dashboard')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get overview dashboard metrics' })
  getDashboardMetrics(@GetUser() user: AuthenticatedUser) {
    return this.reportsService.getDashboardMetrics(user.companyId);
  }

  @Get('customers')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get customer-wise report' })
  getCustomerReport(@GetUser() user: AuthenticatedUser) {
    return this.reportsService.getCustomerReport(user.companyId);
  }

  @Get('drivers')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get driver-wise report' })
  getDriverReport(@GetUser() user: AuthenticatedUser) {
    return this.reportsService.getDriverReport(user.companyId);
  }

  @Get('vehicles')
  @RequirePermissions('reports:read')
  @ApiOperation({ summary: 'Get vehicle-wise report' })
  getVehicleReport(@GetUser() user: AuthenticatedUser) {
    return this.reportsService.getVehicleReport(user.companyId);
  }
}
