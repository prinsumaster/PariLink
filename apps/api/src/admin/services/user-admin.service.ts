import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import {
  InviteUserDto,
  BulkUserImportDto,
  UserStatusActionDto,
} from '../dto/enterprise-admin.dto';
import * as bcrypt from 'bcrypt';
import * as crypto from 'crypto';

@Injectable()
export class UserAdminService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async getUsers(companyId: string, status?: string) {
    const where: any = { companyId };
    if (status) where.status = status;
    return this.prisma.runAsSystem(async (tx) =>
      tx.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          phone: true,
          status: true,
          mfaEnabled: true,
          roleId: true,
          departmentId: true,
          teamId: true,
          costCenterId: true,
          createdAt: true,
          role: { select: { id: true, name: true } },
          department: { select: { id: true, name: true } },
          team: { select: { id: true, name: true } },
          costCenter: { select: { id: true, code: true, name: true } },
        },
        orderBy: { createdAt: 'desc' },
      }),
    );
  }

  async inviteUser(companyId: string, dto: InviteUserDto, adminUserId: string) {
    const existing = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: dto.email },
      }),
    );
    if (existing)
      throw new ConflictException(
        `User with email ${dto.email} already exists`,
      );

    const tempPassword = crypto.randomBytes(16).toString('hex');
    const hashedPassword = await bcrypt.hash(tempPassword, 10);

    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.create({
        data: {
          companyId,
          email: dto.email,
          firstName: dto.firstName,
          lastName: dto.lastName,
          password: hashedPassword,
          status: 'INVITED',
          roleId: dto.roleId,
          departmentId: dto.departmentId,
          teamId: dto.teamId,
          costCenterId: dto.costCenterId,
          preferences: {
            invitationToken: crypto.randomBytes(32).toString('hex'),
            invitedBy: adminUserId,
          },
        },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:user:invite',
      entity: 'User',
      entityId: user.id,
      userId: adminUserId,
      companyId,
      details: { email: dto.email, roleId: dto.roleId },
    });

    return {
      id: user.id,
      email: user.email,
      status: user.status,
      invitationSent: true,
    };
  }

  async bulkImportUsers(
    companyId: string,
    dto: BulkUserImportDto,
    adminUserId: string,
  ) {
    const results = {
      imported: 0,
      failed: 0,
      errors: [] as { email: string; reason: string }[],
    };

    const promises = dto.users.map(async (u) => {
      try {
        await this.inviteUser(companyId, u, adminUserId);
        return { success: true, email: u.email };
      } catch (e: any) {
        return {
          success: false,
          email: u.email,
          reason: e.message || 'Import error',
        };
      }
    });

    const settled = await Promise.all(promises);

    for (const res of settled) {
      if (res.success) {
        results.imported++;
      } else {
        results.failed++;
        results.errors.push({
          email: res.email,
          reason: res.reason as string,
        });
      }
    }

    await this.audit.logEvent({
      action: 'admin:user:bulk_import',
      entity: 'User',
      entityId: companyId,
      userId: adminUserId,
      companyId,
      details: { imported: results.imported, failed: results.failed },
    });

    return results;
  }

  async exportUsers(companyId: string) {
    const users = await this.getUsers(companyId);
    return {
      exportedAt: new Date().toISOString(),
      total: users.length,
      users,
    };
  }

  async suspendUser(
    companyId: string,
    targetUserId: string,
    dto: UserStatusActionDto,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: targetUserId },
        data: { status: 'SUSPENDED' },
      }),
    );

    await this.forceLogout(companyId, targetUserId, adminUserId);

    await this.audit.logEvent({
      action: 'admin:user:suspend',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { reason: dto.reason || 'Admin suspension' },
    });

    return updated;
  }

  async activateUser(
    companyId: string,
    targetUserId: string,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: targetUserId },
        data: { status: 'ACTIVE' },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:user:activate',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { previousStatus: user.status },
    });

    return updated;
  }

  async lockUser(
    companyId: string,
    targetUserId: string,
    dto: UserStatusActionDto,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: targetUserId },
        data: { status: 'LOCKED' },
      }),
    );

    await this.forceLogout(companyId, targetUserId, adminUserId);

    await this.audit.logEvent({
      action: 'admin:user:lock',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { reason: dto.reason || 'Admin lock' },
    });

    return updated;
  }

  async unlockUser(
    companyId: string,
    targetUserId: string,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: targetUserId },
        data: { status: 'ACTIVE' },
      }),
    );

    await this.audit.logEvent({
      action: 'admin:user:unlock',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { previousStatus: user.status },
    });

    return updated;
  }

  async forceLogout(
    companyId: string,
    targetUserId: string,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.refreshToken.deleteMany({ where: { userId: targetUserId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.trustedDevice.deleteMany({ where: { userId: targetUserId } }),
      ),
    ]);

    await this.audit.logEvent({
      action: 'admin:user:force_logout',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { revokedAllTokensAndSessions: true },
    });

    return {
      success: true,
      message: `All sessions revoked for user ${targetUserId}`,
    };
  }

  async forcePasswordReset(
    companyId: string,
    targetUserId: string,
    adminUserId: string,
  ) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    const currentPrefs = (user.preferences || {}) as Record<string, any>;
    const updatedPrefs = {
      ...currentPrefs,
      passwordResetRequired: true,
      forceResetAt: new Date().toISOString(),
    };

    await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: targetUserId },
        data: { preferences: updatedPrefs },
      }),
    );

    await this.forceLogout(companyId, targetUserId, adminUserId);

    await this.audit.logEvent({
      action: 'admin:user:force_password_reset',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { passwordResetRequired: true },
    });

    return {
      success: true,
      message: `Password reset enforced for user ${targetUserId}`,
    };
  }

  async resetMfa(companyId: string, targetUserId: string, adminUserId: string) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findFirst({
        where: { id: targetUserId, companyId },
      }),
    );
    if (!user) throw new NotFoundException(`User ${targetUserId} not found`);

    await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.backupCode.deleteMany({ where: { userId: targetUserId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.webAuthnCredential.deleteMany({ where: { userId: targetUserId } }),
      ),
      this.prisma.runAsSystem(async (tx) =>
        tx.user.update({
          where: { id: targetUserId },
          data: { mfaEnabled: false, totpSecret: null },
        }),
      ),
    ]);

    await this.audit.logEvent({
      action: 'admin:user:reset_mfa',
      entity: 'User',
      entityId: targetUserId,
      userId: adminUserId,
      companyId,
      details: { mfaReset: true },
    });

    return { success: true, message: `MFA reset for user ${targetUserId}` };
  }
}
