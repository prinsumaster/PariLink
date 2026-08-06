import { Module } from '@nestjs/common';
import { TenantController } from './tenant.controller';
import { TenantOnboardingService } from './tenant-onboarding.service';
import { TenantProvisioningService } from './tenant-provisioning.service';
import { PrismaModule } from '../../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [TenantController],
  providers: [TenantOnboardingService, TenantProvisioningService],
  exports: [TenantOnboardingService, TenantProvisioningService],
})
export class TenantModule {}
