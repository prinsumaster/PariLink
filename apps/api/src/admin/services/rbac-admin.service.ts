/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  CreatePermissionGroupDto,
  CreateRoleTemplateDto,
  SimulatePermissionDto,
} from '../dto/enterprise-admin.dto';

@Injectable()
export class RbacAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  // ── 1. Permission Groups
  getPermissionGroups() {
    return [
      {
        domain: 'admin',
        name: 'Administration & System',
        description: 'System administration, tenant config, audit logs',
        permissions: [
          'admin:*',
          'admin:tenant:read',
          'admin:tenant:write',
          'admin:audit:read',
        ],
      },
      {
        domain: 'users',
        name: 'User Management',
        description: 'Manage users, roles, invitations, security status',
        permissions: [
          'users:*',
          'users:read',
          'users:create',
          'users:update',
          'users:suspend',
          'users:lock',
        ],
      },
      {
        domain: 'dispatch',
        name: 'Dispatch & Operations',
        description: 'Manage trips, loads, drivers, vehicles',
        permissions: [
          'dispatch:*',
          'dispatch:read',
          'dispatch:assign',
          'dispatch:update',
          'trips:*',
        ],
      },
      {
        domain: 'finance',
        name: 'Billing & Finance',
        description: 'Manage invoices, payments, rate cards, expenses',
        permissions: [
          'finance:*',
          'billing:read',
          'billing:write',
          'invoices:*',
          'payments:*',
        ],
      },
      {
        domain: 'security',
        name: 'Security & Compliance',
        description: 'Manage security policies, SSO, MFA rules',
        permissions: [
          'security:*',
          'security:policies:read',
          'security:policies:write',
          'sso:admin',
        ],
      },
      {
        domain: 'reports',
        name: 'Analytics & Reporting',
        description: 'Access reports, BI dashboards, data export',
        permissions: ['reports:*', 'analytics:read', 'reports:export'],
      },
    ];
  }

  // ── 2. Role Templates
  getRoleTemplates() {
    return [
      {
        name: 'Super Admin',
        description: 'Full access across all modules',
        permissions: ['*'],
        isTemplate: true,
      },
      {
        name: 'Tenant Admin',
        description: 'Tenant administration and user management',
        permissions: ['admin:*', 'users:*', 'security:*'],
        isTemplate: true,
      },
      {
        name: 'Dispatcher',
        description: 'Operations and dispatch management',
        permissions: ['dispatch:*', 'trips:*', 'users:read'],
        isTemplate: true,
      },
      {
        name: 'Finance Manager',
        description: 'Billing, invoicing, and accounting',
        permissions: ['finance:*', 'billing:*', 'invoices:*', 'reports:read'],
        isTemplate: true,
      },
      {
        name: 'Read-Only Auditor',
        description: 'Read-only access to logs and records',
        permissions: ['*:read', 'admin:audit:read'],
        isTemplate: true,
      },
    ];
  }

  async createRoleFromTemplate(
    companyId: string,
    dto: CreateRoleTemplateDto,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.role.findFirst({
        where: { companyId, name: dto.name },
      }),
    );
    if (existing)
      throw new ConflictException(`Role ${dto.name} already exists`);

    const role = await this.prisma.runAsSystem(async (tx) =>
      tx.role.create({
        data: {
          companyId,
          name: dto.name,
          description: dto.description || `Created from template: ${dto.name}`,
          permissions: dto.permissions as any,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:rbac:create_role',
      entity: 'Role',
      entityId: role.id,
      userId: adminUserId,
      companyId,
      details: { role: dto },
    });

    return role;
  }

  // ── 3. Custom Roles CRUD
  async getRoles(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.role.findMany({
        where: { companyId },
        include: { _count: { select: { users: true } } },
        orderBy: { name: 'asc' },
      }),
    );
  }

  async getRoleById(companyId: string, roleId: string) {
    const role = await this.prisma.runAsSystem(async (tx) =>
      tx.role.findFirst({
        where: { id: roleId, companyId },
        include: {
          users: {
            select: { id: true, email: true, firstName: true, lastName: true },
          },
        },
      }),
    );
    if (!role) throw new NotFoundException(`Role ${roleId} not found`);
    return role;
  }

  async updateRole(
    companyId: string,
    roleId: string,
    dto: Partial<CreateRoleTemplateDto>,
    adminUserId: string,
  ) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.role.findFirst({
        where: { id: roleId, companyId },
      }),
    );
    if (!existing) throw new NotFoundException(`Role ${roleId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.role.update({
        where: { id: roleId },
        data: {
          name: dto.name ?? existing.name,
          description: dto.description ?? existing.description,
          permissions: (dto.permissions ?? existing.permissions) as any,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:rbac:update_role',
      entity: 'Role',
      entityId: roleId,
      userId: adminUserId,
      companyId,
      details: {
        oldPermissions: existing.permissions,
        newPermissions: updated.permissions,
      },
    });

    return updated;
  }

  async deleteRole(companyId: string, roleId: string, adminUserId: string) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.role.findFirst({
        where: { id: roleId, companyId },
        include: { _count: { select: { users: true } } },
      }),
    );
    if (!existing) throw new NotFoundException(`Role ${roleId} not found`);
    if (existing._count.users > 0) {
      throw new ConflictException(
        `Cannot delete role ${existing.name} because it has ${existing._count.users} assigned users`,
      );
    }

    await this.prisma.runAsSystem(async (tx) =>
      tx.role.delete({ where: { id: roleId } }),
    );

    await this.audit.logEvent({
      action: 'admin:rbac:delete_role',
      entity: 'Role',
      entityId: roleId,
      userId: adminUserId,
      companyId,
      details: { name: existing.name },
    });

    return { success: true };
  }

  // ── 4. Delegated Administration & 5. Temporary Permissions
  async setDelegatedScope(
    companyId: string,
    userId: string,
    delegatedScopes: Record<string, any>,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({ where: { id: userId, companyId } }),
    );
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const currentPrefs = (user.preferences || {}) as Record<string, any>;
    const updatedPrefs = { ...currentPrefs, delegatedScopes };

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: userId },
        data: { preferences: updatedPrefs },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:rbac:set_delegated_scope',
      entity: 'User',
      entityId: userId,
      userId: adminUserId,
      companyId,
      details: { delegatedScopes },
    });

    return { id: updated.id, email: updated.email, delegatedScopes };
  }

  async grantTemporaryPermission(
    companyId: string,
    userId: string,
    permission: string,
    expiresAtIso: string,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({ where: { id: userId, companyId } }),
    );
    if (!user) throw new NotFoundException(`User ${userId} not found`);

    const currentPrefs = (user.preferences || {}) as Record<string, any>;
    const tempPerms = Array.isArray(currentPrefs.tempPermissions)
      ? currentPrefs.tempPermissions
      : [];
    tempPerms.push({
      permission,
      expiresAt: expiresAtIso,
      grantedBy: adminUserId,
      grantedAt: new Date().toISOString(),
    });

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: userId },
        data: { preferences: { ...currentPrefs, tempPermissions: tempPerms } },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:rbac:grant_temp_permission',
      entity: 'User',
      entityId: userId,
      userId: adminUserId,
      companyId,
      details: { permission, expiresAt: expiresAtIso },
    });

    return { id: updated.id, email: updated.email, tempPermissions: tempPerms };
  }

  // ── 6. Permission Simulator
  async simulatePermission(companyId: string, dto: SimulatePermissionDto) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: dto.userId, companyId },
        include: { role: true, department: true, team: true },
      }),
    );
    if (!user) throw new NotFoundException(`User ${dto.userId} not found`);

    const rolePerms = Array.isArray(user.role?.permissions)
      ? (user.role.permissions as string[])
      : [];
    const currentPrefs = (user.preferences || {}) as Record<string, any>;
    const tempPerms = Array.isArray(currentPrefs.tempPermissions)
      ? currentPrefs.tempPermissions
      : [];

    const now = new Date().getTime();
    const activeTempPerms = tempPerms
      .filter((p: any) => new Date(p.expiresAt).getTime() > now)
      .map((p: any) => p.permission);

    const allPerms = [...rolePerms, ...activeTempPerms];
    const hasWildcard = allPerms.includes('*');
    const exactMatch = allPerms.includes(dto.permission);
    const domainPrefix = dto.permission.split(':')[0] + ':*';
    const domainMatch = allPerms.includes(domainPrefix);

    const isAllowed = hasWildcard || exactMatch || domainMatch;

    return {
      userId: user.id,
      email: user.email,
      roleName: user.role?.name || 'No Role',
      simulatedAction: dto.permission,
      allowed: isAllowed,
      reason: hasWildcard
        ? 'Allowed by wildcard (*) permission on role'
        : exactMatch
          ? `Allowed by exact permission match (${dto.permission})`
          : domainMatch
            ? `Allowed by domain wildcard (${domainPrefix})`
            : 'Denied: permission not granted on role or active temporary permissions',
      effectivePermissions: allPerms,
      delegatedScopes: currentPrefs.delegatedScopes || null,
    };
  }
}
