import { Controller, Post, Body, Param, UseGuards, Put } from '@nestjs/common';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { TenantProvisioningService } from './tenant-provisioning.service';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';

@ApiTags('Tenant SaaS')
@ApiBearerAuth()
@Controller('saas/tenant')
@UseGuards(JwtAuthGuard)
export class TenantController {
  constructor(
    private readonly onboarding: TenantOnboardingService,
    private readonly provisioning: TenantProvisioningService,
  ) {}

  @Post('onboarding/complete')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Complete company onboarding wizard' })
  async completeOnboarding(
    @GetUser() user: AuthenticatedUser,
    @Body()
    dto: {
      timezone: string;
      currency: string;
      language: string;
      fiscalYearStartMonth: number;
    },
  ) {
    return this.onboarding.completeOnboarding(user.companyId, dto);
  }

  @Put('branding/logo')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Update company logo' })
  async updateLogo(
    @GetUser() user: AuthenticatedUser,
    @Body() dto: { logoUrl: string },
  ) {
    return this.onboarding.uploadLogo(user.companyId, dto.logoUrl);
  }

  @Post('provisioning/defaults')
  @RequirePermissions('admin:manage')
  @ApiOperation({ summary: 'Provision default roles and data' })
  async provisionDefaults(@GetUser() user: AuthenticatedUser) {
    return this.provisioning.provisionDefaults(user.companyId);
  }
}
