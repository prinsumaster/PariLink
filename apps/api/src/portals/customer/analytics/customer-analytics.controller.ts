import {
  Controller,
  Get,
  UseGuards,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../../auth/decorators/get-user.decorator';
import { CustomerAnalyticsService } from './customer-analytics.service';

@ApiTags('customer-portal/analytics')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('customer-portal/analytics')
export class CustomerAnalyticsController {
  constructor(
    private readonly customerAnalyticsService: CustomerAnalyticsService,
  ) {}

  @Get('kpis')
  @ApiOperation({ summary: 'Get high-level KPIs for the customer dashboard' })
  getDashboardKpis(@GetUser() user: AuthenticatedUser) {
    if (!user.customerId)
      throw new UnauthorizedException(
        'User is not associated with a Customer account',
      );
    return this.customerAnalyticsService.getDashboardKpis(
      user.companyId,
      user.customerId,
    );
  }
}
