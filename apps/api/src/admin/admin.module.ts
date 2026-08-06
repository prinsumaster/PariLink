import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

import {
  TenantAdminController,
  OrgAdminController,
  UserAdminController,
  RbacAdminController,
  SecurityPolicyAdminController,
  FeatureFlagAdminController,
  LicenseAdminController,
  ApiAdminController,
  AuditAdminController,
  SystemSettingsAdminController,
  DashboardAdminController,
} from './controllers/enterprise-admin.controller';

import { TenantAdminService } from './services/tenant-admin.service';
import { OrgAdminService } from './services/org-admin.service';
import { UserAdminService } from './services/user-admin.service';
import { RbacAdminService } from './services/rbac-admin.service';
import { SecurityPolicyAdminService } from './services/security-policy-admin.service';
import { FeatureFlagAdminService } from './services/feature-flag-admin.service';
import { LicenseAdminService } from './services/license-admin.service';
import { ApiAdminService } from './services/api-admin.service';
import { AuditAdminService } from './services/audit-admin.service';
import { SystemSettingsAdminService } from './services/system-settings-admin.service';
import { DashboardAdminService } from './services/dashboard-admin.service';

@Module({
  imports: [AuthModule],
  controllers: [
    AdminController,
    TenantAdminController,
    OrgAdminController,
    UserAdminController,
    RbacAdminController,
    SecurityPolicyAdminController,
    FeatureFlagAdminController,
    LicenseAdminController,
    ApiAdminController,
    AuditAdminController,
    SystemSettingsAdminController,
    DashboardAdminController,
  ],
  providers: [
    AdminService,
    TenantAdminService,
    OrgAdminService,
    UserAdminService,
    RbacAdminService,
    SecurityPolicyAdminService,
    FeatureFlagAdminService,
    LicenseAdminService,
    ApiAdminService,
    AuditAdminService,
    SystemSettingsAdminService,
    DashboardAdminService,
  ],
  exports: [
    AdminService,
    TenantAdminService,
    OrgAdminService,
    UserAdminService,
    RbacAdminService,
    SecurityPolicyAdminService,
    FeatureFlagAdminService,
    LicenseAdminService,
    ApiAdminService,
    AuditAdminService,
    SystemSettingsAdminService,
    DashboardAdminService,
  ],
})
export class AdminModule {}
