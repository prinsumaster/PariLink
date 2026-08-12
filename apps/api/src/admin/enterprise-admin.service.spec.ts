import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
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

describe('Enterprise Administration Platform Services', () => {
  let tenantService: TenantAdminService;
  let orgService: OrgAdminService;
  let userService: UserAdminService;
  let rbacService: RbacAdminService;
  let securityPolicyService: SecurityPolicyAdminService;
  let featureFlagService: FeatureFlagAdminService;
  let licenseService: LicenseAdminService;
  let apiService: ApiAdminService;
  let auditService: AuditAdminService;
  let systemSettingsService: SystemSettingsAdminService;
  let dashboardService: DashboardAdminService;

  const mockPrisma: any = {
    runAsTenant: jest
      .fn()
      .mockImplementation(async (tenantId, cb) => await cb(mockPrisma)),
    runAsSystem: jest
      .fn()
      .mockImplementation(async (cb) => await cb(mockPrisma)),
    company: {
      count: jest.fn().mockResolvedValue(10),
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 'comp-1', name: 'Test Corp', status: 'ACTIVE' },
        ]),
      findUnique: jest.fn().mockResolvedValue({
        id: 'comp-1',
        name: 'Test Corp',
        status: 'ACTIVE',
        subscriptionPlan: { id: 'plan-1', name: 'Enterprise' },
      }),
      update: jest
        .fn()
        .mockResolvedValue({ id: 'comp-1', status: 'SUSPENDED' }),
    },
    tenantConfiguration: {
      findUnique: jest.fn().mockResolvedValue({
        id: 'config-1',
        companyId: 'comp-1',
        theme: { primaryColor: '#000000' },
        settings: {},
        policies: {},
      }),
      create: jest.fn().mockResolvedValue({
        id: 'config-1',
        companyId: 'comp-1',
        theme: {},
        settings: {},
        policies: {},
      }),
      update: jest.fn().mockResolvedValue({
        id: 'config-1',
        companyId: 'comp-1',
        theme: { primaryColor: '#ff0000' },
      }),
    },
    tenantConfig: {
      findUnique: jest.fn().mockResolvedValue({
        companyId: 'comp-1',
        maxUsers: 100,
        storageQuotaMb: 50000,
        apiRateLimit: 5000,
      }),
      findFirst: jest.fn().mockResolvedValue({
        companyId: 'comp-1',
        maxUsers: 100,
        storageQuotaMb: 50000,
        apiRateLimit: 5000,
      }),
      upsert: jest.fn().mockResolvedValue({ companyId: 'comp-1' }),
    },
    department: {
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 'dept-1', name: 'Engineering', code: 'ENG' },
        ]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({ id: 'dept-1', name: 'Engineering', code: 'ENG' }),
      update: jest
        .fn()
        .mockResolvedValue({ id: 'dept-1', name: 'Engineering Updated' }),
      delete: jest.fn().mockResolvedValue({ id: 'dept-1' }),
    },
    team: {
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 'team-1', name: 'Backend Team' }]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({ id: 'team-1', name: 'Backend Team' }),
    },
    costCenter: {
      findMany: jest
        .fn()
        .mockResolvedValue([{ id: 'cc-1', code: 'CC-101', name: 'R&D' }]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest
        .fn()
        .mockResolvedValue({ id: 'cc-1', code: 'CC-101', name: 'R&D' }),
    },
    vehicle: { count: jest.fn().mockResolvedValue(10) },
    driver: { count: jest.fn().mockResolvedValue(10) },
    trip: { count: jest.fn().mockResolvedValue(10) },
    load: { count: jest.fn().mockResolvedValue(10) },

    user: {
      count: jest.fn().mockResolvedValue(25),
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'usr-1',
          email: 'user@test.com',
          status: 'ACTIVE',
          mfaEnabled: true,
        },
      ]),
      findUnique: jest.fn().mockResolvedValue(null),
      findFirst: jest.fn().mockResolvedValue({
        id: 'usr-1',
        email: 'user@test.com',
        status: 'ACTIVE',
        preferences: {},
      }),
      create: jest.fn().mockResolvedValue({
        id: 'usr-1',
        email: 'new@test.com',
        status: 'INVITED',
      }),
      update: jest.fn().mockResolvedValue({ id: 'usr-1', status: 'SUSPENDED' }),
    },
    role: {
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 'role-1', name: 'Custom Admin', permissions: ['*'] },
        ]),
      findFirst: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'role-1',
        name: 'Custom Role',
        permissions: ['users:*'],
      }),
      update: jest.fn().mockResolvedValue({
        id: 'role-1',
        name: 'Updated Role',
        permissions: ['users:*'],
      }),
      delete: jest.fn().mockResolvedValue({ id: 'role-1' }),
    },
    featureFlag: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'flag-1',
          key: 'new-ui',
          isEnabled: true,
          rules: { percentageRollout: 50 },
        },
      ]),
      findFirst: jest.fn().mockResolvedValue({
        id: 'flag-1',
        companyId: 'comp-1',
        key: 'new-ui',
        isEnabled: true,
        rules: {},
      }),
      upsert: jest
        .fn()
        .mockResolvedValue({ id: 'flag-1', key: 'new-ui', isEnabled: true }),
      update: jest.fn().mockResolvedValue({
        id: 'flag-1',
        isEnabled: false,
        rules: { killSwitch: true },
      }),
    },
    apiKey: {
      findMany: jest.fn().mockResolvedValue([
        {
          id: 'key-1',
          name: 'Test Key',
          scopes: ['api:read'],
          isActive: true,
        },
      ]),
      findFirst: jest
        .fn()
        .mockResolvedValue({ id: 'key-1', name: 'Test Key', isActive: true }),
      create: jest.fn().mockResolvedValue({
        id: 'key-1',
        name: 'New Key',
        scopes: ['api:read'],
        isActive: true,
      }),
      update: jest.fn().mockResolvedValue({ id: 'key-1', isActive: false }),
      count: jest.fn().mockResolvedValue(3),
    },
    oAuthClient: {
      findMany: jest.fn().mockResolvedValue([]),
    },
    webhookEndpoint: {
      findMany: jest.fn().mockResolvedValue([]),
      create: jest.fn().mockResolvedValue({
        id: 'wh-1',
        url: 'https://example.com/webhook',
        events: ['*'],
        isActive: true,
      }),
    },
    auditLog: {
      count: jest.fn().mockResolvedValue(10),
      findMany: jest
        .fn()
        .mockResolvedValue([
          { id: 'audit-1', action: 'admin:test', createdAt: new Date() },
        ]),
      deleteMany: jest.fn().mockResolvedValue({ count: 5 }),
    },
    refreshToken: { deleteMany: jest.fn().mockResolvedValue({ count: 2 }) },
    trustedDevice: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    backupCode: { deleteMany: jest.fn().mockResolvedValue({ count: 1 }) },
    webAuthnCredential: {
      deleteMany: jest.fn().mockResolvedValue({ count: 0 }),
    },
    branch: { findMany: jest.fn().mockResolvedValue([]) },
    warehouse: { findMany: jest.fn().mockResolvedValue([]) },
  };

  const mockAudit: any = {
    logEvent: jest.fn().mockResolvedValue({}),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        { provide: PrismaService, useValue: mockPrisma },
        { provide: AuditService, useValue: mockAudit },
      ],
    }).compile();

    tenantService = module.get<TenantAdminService>(TenantAdminService);
    orgService = module.get<OrgAdminService>(OrgAdminService);
    userService = module.get<UserAdminService>(UserAdminService);
    rbacService = module.get<RbacAdminService>(RbacAdminService);
    securityPolicyService = module.get<SecurityPolicyAdminService>(
      SecurityPolicyAdminService,
    );
    featureFlagService = module.get<FeatureFlagAdminService>(
      FeatureFlagAdminService,
    );
    licenseService = module.get<LicenseAdminService>(LicenseAdminService);
    apiService = module.get<ApiAdminService>(ApiAdminService);
    auditService = module.get<AuditAdminService>(AuditAdminService);
    systemSettingsService = module.get<SystemSettingsAdminService>(
      SystemSettingsAdminService,
    );
    dashboardService = module.get<DashboardAdminService>(DashboardAdminService);
  });

  it('should be defined', () => {
    expect(tenantService).toBeDefined();
    expect(orgService).toBeDefined();
    expect(userService).toBeDefined();
    expect(rbacService).toBeDefined();
    expect(securityPolicyService).toBeDefined();
    expect(featureFlagService).toBeDefined();
    expect(licenseService).toBeDefined();
    expect(apiService).toBeDefined();
    expect(auditService).toBeDefined();
    expect(systemSettingsService).toBeDefined();
    expect(dashboardService).toBeDefined();
  });

  describe('TenantAdminService', () => {
    it('should list tenants and get tenant by id', async () => {
      const tenants = await tenantService.getTenants();
      expect(tenants).toHaveLength(1);
      const tenant = await tenantService.getTenantById('comp-1');
      expect(tenant.id).toBe('comp-1');
    });

    it('should update branding and log audit event', async () => {
      await tenantService.updateBranding(
        'comp-1',
        { primaryColor: '#ff0000' },
        'admin-1',
      );
      expect(mockPrisma.tenantConfiguration.update).toHaveBeenCalled();
      expect(mockAudit.logEvent).toHaveBeenCalledWith(
        expect.objectContaining({ action: 'admin:tenant:update_branding' }),
      );
    });
  });

  describe('OrgAdminService', () => {
    it('should get org overview', async () => {
      const overview = await orgService.getOrgOverview('comp-1');
      expect(overview.departments).toBeDefined();
      expect(overview.teams).toBeDefined();
    });

    it('should create department', async () => {
      const dept = await orgService.createDepartment(
        'comp-1',
        { name: 'Engineering', code: 'ENG' },
        'admin-1',
      );
      expect(dept.name).toBe('Engineering');
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });
  });

  describe('UserAdminService', () => {
    it('should list users', async () => {
      const users = await userService.getUsers('comp-1');
      expect(users).toHaveLength(1);
    });

    it('should invite user', async () => {
      const res = await userService.inviteUser(
        'comp-1',
        { email: 'new@test.com', firstName: 'Jane', lastName: 'Doe' },
        'admin-1',
      );
      expect(res.invitationSent).toBe(true);
    });

    it('should force logout user by deleting tokens and sessions', async () => {
      const res = await userService.forceLogout('comp-1', 'usr-1', 'admin-1');
      expect(res.success).toBe(true);
      expect(mockPrisma.refreshToken.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'usr-1' },
      });
      expect(mockPrisma.trustedDevice.deleteMany).toHaveBeenCalledWith({
        where: { userId: 'usr-1' },
      });
    });
  });

  describe('RbacAdminService', () => {
    it('should simulate permissions correctly', async () => {
      mockPrisma.user.findFirst.mockResolvedValueOnce({
        id: 'usr-1',
        email: 'user@test.com',
        role: { name: 'Custom Admin', permissions: ['users:*', 'trips:read'] },
        preferences: {},
      });
      const res = await rbacService.simulatePermission('comp-1', {
        userId: 'usr-1',
        permission: 'users:create',
      });
      expect(res.allowed).toBe(true);
    });
  });

  describe('SecurityPolicyAdminService', () => {
    it('should get and update security policies', async () => {
      const policies =
        await securityPolicyService.getSecurityPolicies('comp-1');
      expect(policies.policies.passwordMinLength).toBe(8);

      await securityPolicyService.updateSecurityPolicies(
        'comp-1',
        { requireMfa: true },
        'admin-1',
      );
      expect(mockAudit.logEvent).toHaveBeenCalled();
    });
  });

  describe('FeatureFlagAdminService', () => {
    it('should trigger kill switch on a flag', async () => {
      await featureFlagService.triggerKillSwitch('comp-1', 'flag-1', 'admin-1');
      expect(mockPrisma.featureFlag.update).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({ isEnabled: false }),
        }),
      );
    });
  });

  describe('LicenseAdminService', () => {
    it('should get license overview with seat utilization', async () => {
      const overview = await licenseService.getLicenseOverview('comp-1');
      expect(overview.capacity.users.limit).toBeGreaterThan(0);
      expect(overview.capacity.vehicles.limit).toBeGreaterThan(0);
    });
  });

  describe('DashboardAdminService', () => {
    it('should calculate dashboard summary and security score', async () => {
      const summary = await dashboardService.getDashboardSummary('comp-1');
      expect(summary.securityScore).toBeGreaterThanOrEqual(0);
      expect(summary.securityScore).toBeLessThanOrEqual(100);
      expect(summary.userStatistics.total).toBe(25);
    });
  });
});
