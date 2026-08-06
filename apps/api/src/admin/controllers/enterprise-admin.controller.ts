import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { PermissionsGuard } from '../../auth/guards/permissions.guard';
import { RequirePermissions } from '../../auth/decorators/permissions.decorator';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

import {
  UpdateTenantBrandingDto,
  UpdateTenantRegionalDto,
  UpdateTenantBusinessHoursDto,
  UpdateTenantStatusDto,
  CreateDepartmentDto,
  UpdateDepartmentDto,
  CreateTeamDto,
  UpdateTeamDto,
  CreateCostCenterDto,
  UpdateCostCenterDto,
  InviteUserDto,
  BulkUserImportDto,
  UserStatusActionDto,
  CreateRoleTemplateDto,
  SimulatePermissionDto,
  UpdateSecurityPolicyDto,
  CreateEnterpriseFlagDto,
  UpdateEnterpriseFlagDto,
  AssignPlanDto,
  CreateApiClientDto,
  CreateWebhookSecretDto,
  AuditQueryDto,
  AuditRetentionPolicyDto,
  UpdateSmtpSettingsDto,
  UpdateStorageSettingsDto,
  UpdateQueueSettingsDto,
  UpdateRedisSettingsDto,
  UpdateCdnSettingsDto,
  UpdateMaintenanceModeDto,
  SetTruckLimitDto,
  SetDriverLimitDto,
  SetBoostDto,
  SetUnlimitedModeDto,
} from '../dto/enterprise-admin.dto';

import { TenantAdminService } from '../services/tenant-admin.service';
import { OrgAdminService } from '../services/org-admin.service';
import { UserAdminService } from '../services/user-admin.service';
import { RbacAdminService } from '../services/rbac-admin.service';
import { SecurityPolicyAdminService } from '../services/security-policy-admin.service';
import { FeatureFlagAdminService } from '../services/feature-flag-admin.service';
import { LicenseAdminService } from '../services/license-admin.service';
import { ApiAdminService } from '../services/api-admin.service';
import { AuditAdminService } from '../services/audit-admin.service';
import { SystemSettingsAdminService } from '../services/system-settings-admin.service';
import { DashboardAdminService } from '../services/dashboard-admin.service';

// 1. Tenant Management Controller
@ApiTags('Enterprise Admin - Tenant Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/tenants')
export class TenantAdminController {
  constructor(private readonly service: TenantAdminService) {}

  @Get()
  @RequirePermissions('admin:tenant:read', 'admin:manage')
  @ApiOperation({ summary: 'List tenants with optional status filter' })
  async getTenants(@Query('status') status?: string) {
    return this.service.getTenants(status);
  }

  @Get(':id')
  @RequirePermissions('admin:tenant:read', 'admin:manage')
  @ApiOperation({ summary: 'Get detailed tenant configuration and metrics' })
  async getTenantById(@Param('id') id: string) {
    return this.service.getTenantById(id);
  }

  @Put(':id/status')
  @RequirePermissions('admin:tenant:write', 'admin:manage')
  @ApiOperation({
    summary: 'Update tenant status (ACTIVE, SUSPENDED, PENDING, DELETED)',
  })
  async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateTenantStatusDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateTenantStatus(id, dto, user.userId);
  }

  @Put(':id/branding')
  @RequirePermissions('admin:tenant:write', 'admin:manage')
  @ApiOperation({ summary: 'Update tenant custom branding' })
  async updateBranding(
    @Param('id') id: string,
    @Body() dto: UpdateTenantBrandingDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateBranding(id, dto, user.userId);
  }

  @Put(':id/regional')
  @RequirePermissions('admin:tenant:write', 'admin:manage')
  @ApiOperation({
    summary: 'Update tenant regional settings (timezone, currency)',
  })
  async updateRegional(
    @Param('id') id: string,
    @Body() dto: UpdateTenantRegionalDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateRegional(id, dto, user.userId);
  }

  @Put(':id/business-hours')
  @RequirePermissions('admin:tenant:write', 'admin:manage')
  @ApiOperation({ summary: 'Update tenant business hours' })
  async updateBusinessHours(
    @Param('id') id: string,
    @Body() dto: UpdateTenantBusinessHoursDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateBusinessHours(id, dto, user.userId);
  }
}

// 2. Organization Management Controller
@ApiTags('Enterprise Admin - Organization Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/org')
export class OrgAdminController {
  constructor(private readonly service: OrgAdminService) {}

  @Get('overview')
  @RequirePermissions('admin:org:read', 'admin:manage')
  @ApiOperation({ summary: 'Get organization hierarchy overview' })
  async getOverview(@GetUser() user: AuthenticatedUser) {
    return this.service.getOrgOverview(user.companyId);
  }

  // Departments
  @Get('departments')
  @RequirePermissions('admin:org:read', 'admin:manage')
  @ApiOperation({ summary: 'List departments' })
  async getDepartments(@GetUser() user: AuthenticatedUser) {
    return this.service.getDepartments(user.companyId);
  }

  @Post('departments')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Create a new department' })
  async createDepartment(
    @Body() dto: CreateDepartmentDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.createDepartment(user.companyId, dto, user.userId);
  }

  @Put('departments/:id')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Update department details' })
  async updateDepartment(
    @Param('id') id: string,
    @Body() dto: UpdateDepartmentDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateDepartment(user.companyId, id, dto, user.userId);
  }

  @Delete('departments/:id')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Delete department' })
  async deleteDepartment(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.deleteDepartment(user.companyId, id, user.userId);
  }

  // Teams
  @Get('teams')
  @RequirePermissions('admin:org:read', 'admin:manage')
  @ApiOperation({ summary: 'List teams with optional department filter' })
  async getTeams(
    @Query('departmentId') departmentId?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.service.getTeams(user.companyId, departmentId);
  }

  @Post('teams')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Create a new team' })
  async createTeam(
    @Body() dto: CreateTeamDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.createTeam(user.companyId, dto, user.userId);
  }

  @Put('teams/:id')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Update team details' })
  async updateTeam(
    @Param('id') id: string,
    @Body() dto: UpdateTeamDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateTeam(user.companyId, id, dto, user.userId);
  }

  @Delete('teams/:id')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Delete team' })
  async deleteTeam(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.deleteTeam(user.companyId, id, user.userId);
  }

  // Cost Centers
  @Get('cost-centers')
  @RequirePermissions('admin:org:read', 'admin:manage')
  @ApiOperation({ summary: 'List cost centers' })
  async getCostCenters(@GetUser() user: AuthenticatedUser) {
    return this.service.getCostCenters(user.companyId);
  }

  @Post('cost-centers')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Create a cost center' })
  async createCostCenter(
    @Body() dto: CreateCostCenterDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.createCostCenter(user.companyId, dto, user.userId);
  }

  @Put('cost-centers/:id')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Update cost center' })
  async updateCostCenter(
    @Param('id') id: string,
    @Body() dto: UpdateCostCenterDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateCostCenter(user.companyId, id, dto, user.userId);
  }

  @Delete('cost-centers/:id')
  @RequirePermissions('admin:org:write', 'admin:manage')
  @ApiOperation({ summary: 'Delete cost center' })
  async deleteCostCenter(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.deleteCostCenter(user.companyId, id, user.userId);
  }
}

// 3. User Administration Controller
@ApiTags('Enterprise Admin - User Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/users')
export class UserAdminController {
  constructor(private readonly service: UserAdminService) {}

  @Get()
  @RequirePermissions('users:read', 'admin:manage')
  @ApiOperation({ summary: 'List all tenant users with filtering' })
  async getUsers(
    @Query('status') status?: string,
    @GetUser() user: AuthenticatedUser = {} as any,
  ) {
    return this.service.getUsers(user.companyId, status);
  }

  @Post('invite')
  @RequirePermissions('users:create', 'admin:manage')
  @ApiOperation({ summary: 'Invite a user to the organization' })
  async inviteUser(
    @Body() dto: InviteUserDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.inviteUser(user.companyId, dto, user.userId);
  }

  @Post('import')
  @RequirePermissions('users:create', 'admin:manage')
  @ApiOperation({ summary: 'Bulk import users' })
  async bulkImport(
    @Body() dto: BulkUserImportDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.bulkImportUsers(user.companyId, dto, user.userId);
  }

  @Get('export')
  @RequirePermissions('users:read', 'admin:manage')
  @ApiOperation({ summary: 'Export user directory' })
  async exportUsers(@GetUser() user: AuthenticatedUser) {
    return this.service.exportUsers(user.companyId);
  }

  @Put(':id/suspend')
  @RequirePermissions('users:suspend', 'admin:manage')
  @ApiOperation({ summary: 'Suspend a user account and revoke sessions' })
  async suspendUser(
    @Param('id') id: string,
    @Body() dto: UserStatusActionDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.suspendUser(user.companyId, id, dto, user.userId);
  }

  @Put(':id/activate')
  @RequirePermissions('users:update', 'admin:manage')
  @ApiOperation({ summary: 'Activate or restore a suspended/locked user' })
  async activateUser(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.activateUser(user.companyId, id, user.userId);
  }

  @Put(':id/lock')
  @RequirePermissions('users:lock', 'admin:manage')
  @ApiOperation({ summary: 'Manually lock user account' })
  async lockUser(
    @Param('id') id: string,
    @Body() dto: UserStatusActionDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.lockUser(user.companyId, id, dto, user.userId);
  }

  @Put(':id/unlock')
  @RequirePermissions('users:update', 'admin:manage')
  @ApiOperation({ summary: 'Unlock user account' })
  async unlockUser(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.unlockUser(user.companyId, id, user.userId);
  }

  @Post(':id/force-logout')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('users:update', 'admin:manage')
  @ApiOperation({
    summary: 'Revoke all refresh tokens and active sessions for a user',
  })
  async forceLogout(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.forceLogout(user.companyId, id, user.userId);
  }

  @Post(':id/force-password-reset')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('users:update', 'admin:manage')
  @ApiOperation({ summary: 'Force user to reset password on next login' })
  async forcePasswordReset(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.forcePasswordReset(user.companyId, id, user.userId);
  }

  @Post(':id/reset-mfa')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('users:update', 'admin:manage')
  @ApiOperation({ summary: 'Reset and clear MFA methods for user' })
  async resetMfa(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    return this.service.resetMfa(user.companyId, id, user.userId);
  }
}

// 4. Enterprise RBAC Controller
@ApiTags('Enterprise Admin - RBAC')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/rbac')
export class RbacAdminController {
  constructor(private readonly service: RbacAdminService) {}

  @Get('groups')
  @RequirePermissions('admin:rbac:read', 'admin:manage')
  @ApiOperation({ summary: 'Get system permission groups by domain' })
  getPermissionGroups() {
    return this.service.getPermissionGroups();
  }

  @Get('templates')
  @RequirePermissions('admin:rbac:read', 'admin:manage')
  @ApiOperation({ summary: 'Get standard role templates' })
  getRoleTemplates() {
    return this.service.getRoleTemplates();
  }

  @Post('from-template')
  @RequirePermissions('admin:rbac:write', 'admin:manage')
  @ApiOperation({ summary: 'Create custom role from template' })
  async createFromTemplate(
    @Body() dto: CreateRoleTemplateDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.createRoleFromTemplate(
      user.companyId,
      dto,
      user.userId,
    );
  }

  @Get('roles')
  @RequirePermissions('admin:rbac:read', 'admin:manage')
  @ApiOperation({ summary: 'List custom roles' })
  async getRoles(@GetUser() user: AuthenticatedUser) {
    return this.service.getRoles(user.companyId);
  }

  @Get('roles/:id')
  @RequirePermissions('admin:rbac:read', 'admin:manage')
  @ApiOperation({ summary: 'Get role by id' })
  async getRoleById(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.getRoleById(user.companyId, id);
  }

  @Put('roles/:id')
  @RequirePermissions('admin:rbac:write', 'admin:manage')
  @ApiOperation({ summary: 'Update role' })
  async updateRole(
    @Param('id') id: string,
    @Body() dto: Partial<CreateRoleTemplateDto>,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateRole(user.companyId, id, dto, user.userId);
  }

  @Delete('roles/:id')
  @RequirePermissions('admin:rbac:write', 'admin:manage')
  @ApiOperation({ summary: 'Delete role' })
  async deleteRole(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.deleteRole(user.companyId, id, user.userId);
  }

  @Put('delegated-scope/:userId')
  @RequirePermissions('admin:rbac:write', 'admin:manage')
  @ApiOperation({ summary: 'Set delegated administration scope for a user' })
  async setDelegatedScope(
    @Param('userId') userId: string,
    @Body() scopes: Record<string, any>,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.setDelegatedScope(
      user.companyId,
      userId,
      scopes,
      user.userId,
    );
  }

  @Post('temporary-permission/:userId')
  @RequirePermissions('admin:rbac:write', 'admin:manage')
  @ApiOperation({ summary: 'Grant time-bound temporary permission to user' })
  async grantTemporaryPermission(
    @Param('userId') userId: string,
    @Body() body: { permission: string; expiresAt: string },
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.grantTemporaryPermission(
      user.companyId,
      userId,
      body.permission,
      body.expiresAt,
      user.userId,
    );
  }

  @Post('simulate')
  @RequirePermissions('admin:rbac:read', 'admin:manage')
  @ApiOperation({
    summary: 'Simulate effective permission for a user and action',
  })
  async simulate(
    @Body() dto: SimulatePermissionDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.simulatePermission(user.companyId, dto);
  }
}

// 5. Security Policies Controller
@ApiTags('Enterprise Admin - Security Policies')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/security-policies')
export class SecurityPolicyAdminController {
  constructor(private readonly service: SecurityPolicyAdminService) {}

  @Get()
  @RequirePermissions('security:policies:read', 'admin:manage')
  @ApiOperation({ summary: 'Get active tenant security policies' })
  async getPolicies(@GetUser() user: AuthenticatedUser) {
    return this.service.getSecurityPolicies(user.companyId);
  }

  @Put()
  @RequirePermissions('security:policies:write', 'admin:manage')
  @ApiOperation({ summary: 'Update tenant security policies' })
  async updatePolicies(
    @Body() dto: UpdateSecurityPolicyDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateSecurityPolicies(
      user.companyId,
      dto,
      user.userId,
    );
  }
}

// 6. Feature Flag Platform Controller
@ApiTags('Enterprise Admin - Feature Flags')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/feature-flags')
export class FeatureFlagAdminController {
  constructor(private readonly service: FeatureFlagAdminService) {}

  @Get()
  @RequirePermissions('admin:flags:read', 'admin:manage')
  @ApiOperation({ summary: 'Get all tenant and global feature flags' })
  async getFlags(@GetUser() user: AuthenticatedUser) {
    return this.service.getFlags(user.companyId);
  }

  @Post()
  @RequirePermissions('admin:flags:write', 'admin:manage')
  @ApiOperation({
    summary: 'Create or update feature flag with percentage rollout',
  })
  async upsertFlag(
    @Body() dto: CreateEnterpriseFlagDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.upsertFlag(user.companyId, dto, user.userId);
  }

  @Put(':id')
  @RequirePermissions('admin:flags:write', 'admin:manage')
  @ApiOperation({ summary: 'Update feature flag rules and rollout' })
  async updateFlag(
    @Param('id') id: string,
    @Body() dto: UpdateEnterpriseFlagDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateFlag(user.companyId, id, dto, user.userId);
  }

  @Post(':id/kill-switch')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('admin:flags:write', 'admin:manage')
  @ApiOperation({
    summary: 'Immediately disable feature flag via emergency kill switch',
  })
  async triggerKillSwitch(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.triggerKillSwitch(user.companyId, id, user.userId);
  }
}

// 7. License Management Controller
@ApiTags('Enterprise Admin - License Management')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/licenses')
export class LicenseAdminController {
  constructor(private readonly service: LicenseAdminService) {}

  @Get()
  @RequirePermissions('admin:license:read', 'admin:manage')
  @ApiOperation({
    summary: 'Get license overview, seat usage, quotas, capacity limits',
  })
  async getOverview(@GetUser() user: AuthenticatedUser) {
    return this.service.getLicenseOverview(user.companyId);
  }

  @Put('assign-plan')
  @RequirePermissions('admin:license:write', 'admin:manage')
  @ApiOperation({
    summary:
      'Assign subscription plan — automatically sets default capacity limits',
  })
  async assignPlan(
    @Body() dto: AssignPlanDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.assignPlan(user.companyId, dto, user.userId);
  }

  // ─── Truck Capacity Management (Enterprise Licensing Engine) ─────────────────

  @Put('trucks/limit')
  @RequirePermissions('admin:license:write', 'admin:manage')
  @ApiOperation({
    summary:
      'Override truck/vehicle capacity limit instantly (no plan change required)',
  })
  async setTruckLimit(
    @Body() dto: SetTruckLimitDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.setTruckLimit(user.companyId, dto, user.userId);
  }

  @Put('drivers/limit')
  @RequirePermissions('admin:license:write', 'admin:manage')
  @ApiOperation({ summary: 'Override driver capacity limit' })
  async setDriverLimit(
    @Body() dto: SetDriverLimitDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.setDriverLimit(user.companyId, dto, user.userId);
  }

  @Put('trucks/boost')
  @RequirePermissions('admin:license:write', 'admin:manage')
  @ApiOperation({
    summary: 'Set a temporary truck capacity boost with expiry date',
  })
  async setBoost(@Body() dto: SetBoostDto, @GetUser() user: AuthenticatedUser) {
    return this.service.setBoost(user.companyId, dto, user.userId);
  }

  @Put('unlimited')
  @RequirePermissions('admin:license:write', 'admin:manage')
  @ApiOperation({
    summary: 'Enable or disable Unlimited Mode (bypasses all capacity checks)',
  })
  async setUnlimitedMode(
    @Body() dto: SetUnlimitedModeDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.setUnlimitedMode(user.companyId, dto, user.userId);
  }

  @Get('plans')
  @RequirePermissions('admin:license:read', 'admin:manage')
  @ApiOperation({ summary: 'List all available subscription plans' })
  async listPlans() {
    return this.service.listPlans();
  }

  @Get('usage')
  @RequirePermissions('admin:license:read', 'admin:manage')
  @ApiOperation({
    summary: 'Get real-time usage dashboard for the current tenant',
  })
  async getUsage(@GetUser() user: AuthenticatedUser) {
    return this.service.getUsageDashboard(user.companyId);
  }

  @Get('tenants')
  @RequirePermissions('admin:super', 'admin:manage')
  @ApiOperation({
    summary: '[Super Admin] List all tenants with license summary',
  })
  async listAllTenants() {
    return this.service.listAllTenantsWithLicense();
  }
}

// 8. API Administration Controller
@ApiTags('Enterprise Admin - API Administration')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/api-clients')
export class ApiAdminController {
  constructor(private readonly service: ApiAdminService) {}

  @Get('keys')
  @RequirePermissions('admin:api:read', 'admin:manage')
  @ApiOperation({ summary: 'List API keys and rate limits' })
  async getApiClients(@GetUser() user: AuthenticatedUser) {
    return this.service.getApiClients(user.companyId);
  }

  @Post('keys')
  @RequirePermissions('admin:api:write', 'admin:manage')
  @ApiOperation({
    summary: 'Create API key with scopes and rate limit override',
  })
  async createApiClient(
    @Body() dto: CreateApiClientDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.createApiClient(user.companyId, dto, user.userId);
  }

  @Delete('keys/:id')
  @RequirePermissions('admin:api:write', 'admin:manage')
  @ApiOperation({ summary: 'Revoke API key' })
  async revokeApiClient(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.revokeApiClient(user.companyId, id, user.userId);
  }

  @Get('oauth-clients')
  @RequirePermissions('admin:api:read', 'admin:manage')
  @ApiOperation({ summary: 'List OAuth 2.0 applications' })
  async getOAuthClients(@GetUser() user: AuthenticatedUser) {
    return this.service.getOAuthClients(user.companyId);
  }

  @Get('scopes')
  @RequirePermissions('admin:api:read', 'admin:manage')
  @ApiOperation({ summary: 'List available API permissions and scopes' })
  getScopes() {
    return this.service.getAvailableScopes();
  }

  @Get('webhooks')
  @RequirePermissions('admin:api:read', 'admin:manage')
  @ApiOperation({ summary: 'List webhook endpoints' })
  async getWebhooks(@GetUser() user: AuthenticatedUser) {
    return this.service.getWebhookEndpoints(user.companyId);
  }

  @Post('webhooks')
  @RequirePermissions('admin:api:write', 'admin:manage')
  @ApiOperation({ summary: 'Create webhook endpoint and signing secret' })
  async createWebhook(
    @Body() dto: CreateWebhookSecretDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.createWebhookSecret(user.companyId, dto, user.userId);
  }
}

// 9. Audit Center Controller
@ApiTags('Enterprise Admin - Audit Center')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/audit')
export class AuditAdminController {
  constructor(private readonly service: AuditAdminService) {}

  @Get('timeline')
  @RequirePermissions('admin:audit:read', 'admin:manage')
  @ApiOperation({ summary: 'Query global/tenant audit timeline' })
  async queryTimeline(
    @Query() dto: AuditQueryDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.queryAuditLogs(user.companyId, dto, false);
  }

  @Get('user-timeline/:userId')
  @RequirePermissions('admin:audit:read', 'admin:manage')
  @ApiOperation({ summary: 'Query audit history for a specific user' })
  async getUserTimeline(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.getUserTimeline(
      user.companyId,
      userId,
      Number(page),
      Number(limit),
    );
  }

  @Get('security-events')
  @RequirePermissions('admin:audit:read', 'admin:manage')
  @ApiOperation({ summary: 'Query security-specific audit logs' })
  async getSecurityEvents(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.getSecurityEvents(
      user.companyId,
      Number(page),
      Number(limit),
    );
  }

  @Get('compliance-report')
  @RequirePermissions('admin:audit:read', 'admin:manage')
  @ApiOperation({ summary: 'Generate 30-day compliance report' })
  async getComplianceReport(@GetUser() user: AuthenticatedUser) {
    return this.service.getComplianceReport(user.companyId);
  }

  @Get('retention')
  @RequirePermissions('admin:audit:read', 'admin:manage')
  @ApiOperation({ summary: 'Get audit retention policy' })
  async getRetentionPolicy(@GetUser() user: AuthenticatedUser) {
    return this.service.getRetentionPolicy(user.companyId);
  }

  @Put('retention')
  @RequirePermissions('admin:audit:write', 'admin:manage')
  @ApiOperation({ summary: 'Update audit retention days' })
  async updateRetentionPolicy(
    @Body() dto: AuditRetentionPolicyDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateRetentionPolicy(user.companyId, dto, user.userId);
  }

  @Post('purge')
  @HttpCode(HttpStatus.OK)
  @RequirePermissions('admin:audit:write', 'admin:manage')
  @ApiOperation({
    summary: 'Manually purge expired audit logs beyond retention window',
  })
  async purgeExpired(@GetUser() user: AuthenticatedUser) {
    return this.service.purgeExpiredLogs(user.companyId, user.userId);
  }
}

// 10. System Settings Controller
@ApiTags('Enterprise Admin - System Settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/system-settings')
export class SystemSettingsAdminController {
  constructor(private readonly service: SystemSettingsAdminService) {}

  @Get()
  @RequirePermissions('admin:system:read', 'admin:manage')
  @ApiOperation({ summary: 'Get system infrastructure settings' })
  async getSettings(@GetUser() user: AuthenticatedUser) {
    return this.service.getSystemSettings(user.companyId);
  }

  @Put('smtp')
  @RequirePermissions('admin:system:write', 'admin:manage')
  @ApiOperation({ summary: 'Update SMTP configurations' })
  async updateSmtp(
    @Body() dto: UpdateSmtpSettingsDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateSmtp(user.companyId, dto, user.userId);
  }

  @Put('storage')
  @RequirePermissions('admin:system:write', 'admin:manage')
  @ApiOperation({ summary: 'Update S3/storage configurations' })
  async updateStorage(
    @Body() dto: UpdateStorageSettingsDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateStorage(user.companyId, dto, user.userId);
  }

  @Put('queue')
  @RequirePermissions('admin:system:write', 'admin:manage')
  @ApiOperation({ summary: 'Update background job queue settings' })
  async updateQueue(
    @Body() dto: UpdateQueueSettingsDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateQueue(user.companyId, dto, user.userId);
  }

  @Put('redis')
  @RequirePermissions('admin:system:write', 'admin:manage')
  @ApiOperation({ summary: 'Update Redis cache configurations' })
  async updateRedis(
    @Body() dto: UpdateRedisSettingsDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateRedis(user.companyId, dto, user.userId);
  }

  @Put('cdn')
  @RequirePermissions('admin:system:write', 'admin:manage')
  @ApiOperation({ summary: 'Update CDN settings' })
  async updateCdn(
    @Body() dto: UpdateCdnSettingsDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateCdn(user.companyId, dto, user.userId);
  }

  @Put('maintenance')
  @RequirePermissions('admin:system:write', 'admin:manage')
  @ApiOperation({ summary: 'Toggle system maintenance mode' })
  async updateMaintenance(
    @Body() dto: UpdateMaintenanceModeDto,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.service.updateMaintenanceMode(user.companyId, dto, user.userId);
  }
}

// 11. Enterprise Admin Dashboard Controller
@ApiTags('Enterprise Admin - Dashboard')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, PermissionsGuard)
@Controller('admin/dashboard')
export class DashboardAdminController {
  constructor(private readonly service: DashboardAdminService) {}

  @Get()
  @RequirePermissions('admin:dashboard:read', 'admin:manage')
  @ApiOperation({
    summary:
      'Get comprehensive enterprise admin dashboard metrics and security score',
  })
  async getDashboard(@GetUser() user: AuthenticatedUser) {
    return this.service.getDashboardSummary(user.companyId, false);
  }
}
