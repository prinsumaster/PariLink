import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { BillingService } from './billing.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('SaaS Billing')
@ApiBearerAuth()
@Controller('saas/billing')
@UseGuards(JwtAuthGuard)
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get('plans')
  @ApiOperation({ summary: 'Get all subscription plans' })
  async getPlans() {
    return this.billingService.getSubscriptionPlans();
  }

  @Get('info')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Get current billing info for company' })
  async getBillingInfo(@GetUser() user: AuthenticatedUser) {
    return this.billingService.getCompanyBillingInfo(user.companyId);
  }

  @Post('checkout')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Create Stripe checkout session for plan upgrade' })
  async createCheckout(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { planId: string; successUrl: string; cancelUrl: string },
  ) {
    return this.billingService.upgradePlan(
      user.companyId,
      dto.planId,
      dto.successUrl,
      dto.cancelUrl,
    );
  }
}
