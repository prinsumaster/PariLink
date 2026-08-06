/* eslint-disable @typescript-eslint/no-explicit-any */
import { AuditService } from '../../platform/audit/audit.service';
import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuthService } from '../auth.service';
import { OidcService } from './oidc.service';
import { SamlService } from './saml.service';
import type { Request } from 'express';
import * as crypto from 'crypto';

@Injectable()
export class SsoService {
  private readonly logger = new Logger(SsoService.name);

  constructor(
    private readonly auditService: AuditService,

    private readonly prisma: PrismaService,
    private readonly authService: AuthService,
    private readonly oidcService: OidcService,
    private readonly samlService: SamlService,
  ) {}

  // ---------------------------------------------------------
  // Admin Operations
  // ---------------------------------------------------------

  async listProviders(companyId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.identityProvider.findMany({
        where: { companyId },
      }),
    );
  }

  async createProvider(companyId: string, payload: any, adminUserId?: string) {
    const idp = await this.prisma.runAsSystem(async (tx) =>
      tx.identityProvider.create({
        data: {
          ...payload,
          companyId,
        },
      }),
    );

    if (adminUserId) {
      await this.logAudit(
        companyId,
        adminUserId,
        'IdentityProvider',
        idp.id,
        'CREATE',
        { name: idp.name },
      );
    }
    return idp;
  }

  async updateProvider(
    companyId: string,
    idpId: string,
    payload: any,
    adminUserId?: string,
  ) {
    const idp = await this.prisma.runAsSystem(async (tx) =>
      tx.identityProvider.update({
        where: { id: idpId, companyId },
        data: payload,
      }),
    );

    if (adminUserId) {
      await this.logAudit(
        companyId,
        adminUserId,
        'IdentityProvider',
        idp.id,
        'UPDATE',
        { name: idp.name },
      );
    }
    return idp;
  }

  async deleteProvider(companyId: string, idpId: string, adminUserId?: string) {
    const idp = await this.prisma.runAsSystem(async (tx) =>
      tx.identityProvider.update({
        where: { id: idpId, companyId },
        data: { status: 'INACTIVE', deletedAt: new Date() },
      }),
    );

    if (adminUserId) {
      await this.logAudit(
        companyId,
        adminUserId,
        'IdentityProvider',
        idp.id,
        'DELETE',
        { name: idp.name },
      );
    }
    return { success: true };
  }

  // ---------------------------------------------------------
  // Auth Flows
  // ---------------------------------------------------------

  async generateLoginUrl(idpId: string, req: Request): Promise<string> {
    const idp = await this.getProvider(idpId);
    if (idp.type === 'OIDC') {
      return this.oidcService.generateLoginUrl(idp, req);
    } else if (idp.type === 'SAML') {
      return this.samlService.generateLoginUrl(idp, req);
    }
    throw new BadRequestException('Invalid IdP type');
  }

  async handleSamlCallback(idpId: string, body: any, req: Request) {
    const idp = await this.getProvider(idpId);
    const profile = await this.samlService.validateResponse(
      idp,
      body.SAMLResponse,
      req,
    );
    return this.processSsoLogin(idp, profile, req);
  }

  async handleOidcCallback(idpId: string, queryOrBody: any, req: Request) {
    const idp = await this.getProvider(idpId);
    const profile = await this.oidcService.validateCallback(
      idp,
      queryOrBody,
      req,
    );
    return this.processSsoLogin(idp, profile, req);
  }

  private async getProvider(idpId: string) {
    const idp = await this.prisma.runAsSystem(async (tx) =>
      tx.identityProvider.findUnique({ where: { id: idpId } }),
    );
    if (!idp || idp.status !== 'ACTIVE') {
      throw new NotFoundException('Identity Provider not found or inactive');
    }
    return idp;
  }

  private async processSsoLogin(idp: any, profile: any, req: Request) {
    // profile should have { id (providerUserId), email, firstName, lastName, groups? }
    const providerUserId = profile.id;
    let userIdentity = await this.prisma.runAsSystem(async (tx) =>
      tx.userIdentity.findUnique({
        where: {
          identityProviderId_providerUserId: {
            identityProviderId: idp.id,
            providerUserId,
          },
        },
        include: { user: true },
      }),
    );

    let user: any;

    if (!userIdentity) {
      // Identity doesn't exist. Check if user with email exists.
      user = await this.prisma.runAsSystem(async (tx) =>
        tx.user.findUnique({ where: { email: profile.email } }),
      );

      if (!user) {
        if (!idp.jitEnabled) {
          throw new BadRequestException(
            'User does not exist and JIT provisioning is disabled',
          );
        }

        // JIT domain validation
        if (idp.domainValidation) {
          const domains = idp.domainValidation
            .split(',')
            .map((d: string) => d.trim().toLowerCase());
          const emailDomain = profile.email.split('@')[1].toLowerCase();
          if (!domains.includes(emailDomain)) {
            throw new BadRequestException(
              'Domain not allowed for SSO provisioning',
            );
          }
        }

        // Create new user (JIT)
        user = await this.prisma.runAsSystem(async (tx) =>
          tx.user.create({
            data: {
              email: profile.email,
              firstName: profile.firstName || 'Unknown',
              lastName: profile.lastName || 'Unknown',
              password: crypto.randomUUID(), // Dummy password since they login via SSO
              companyId: idp.companyId,
              roleId: idp.jitDefaultRoleId || null,
              status: 'ACTIVE',
            },
          }),
        );

        this.logger.log(
          `JIT provisioned user ${user.id} via SSO (IdP: ${idp.id})`,
        );
        await this.logAudit(
          idp.companyId,
          user.id,
          'User',
          user.id,
          'CREATE_JIT_SSO',
          { idpId: idp.id },
        );
      } else {
        // Enforce company boundary
        if (user.companyId !== idp.companyId) {
          throw new BadRequestException('User belongs to a different tenant');
        }
      }

      // Link identity
      userIdentity = await this.prisma.runAsSystem(async (tx) =>
        tx.userIdentity.create({
          data: {
            userId: user.id,
            identityProviderId: idp.id,
            providerUserId,
            profileData: profile,
          },
          include: { user: true },
        }),
      );
    } else {
      user = userIdentity.user;
      if (user.status !== 'ACTIVE') {
        throw new BadRequestException('User account is inactive');
      }

      // Update profile data in background
      this.prisma
        .runAsSystem(async (tx) =>
          tx.userIdentity.update({
            where: { id: userIdentity?.id || '' },
            data: { profileData: profile, updatedAt: new Date() },
          }),
        )
        .catch((err) =>
          this.logger.error('Failed to update UserIdentity profile data', err),
        );
    }

    // Role mapping
    if (
      idp.roleMapping &&
      typeof idp.roleMapping === 'object' &&
      profile.groups
    ) {
      const mapping = idp.roleMapping as Record<string, string>;
      for (const group of profile.groups) {
        if (mapping[group]) {
          const newRoleId = mapping[group];
          if (user.roleId !== newRoleId) {
            await this.prisma.runAsSystem(async (tx) =>
              tx.user.update({
                where: { id: user.id },
                data: { roleId: newRoleId },
              }),
            );
            user.roleId = newRoleId;
            this.logger.log(
              `Mapped user ${user.id} to role ${newRoleId} via SSO group ${group}`,
            );
          }
          break; // Stop after first match
        }
      }
    }

    // Record SSO session
    if (profile.sessionId) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.ssoSession.upsert({
          where: {
            identityProviderId_sessionId: {
              identityProviderId: idp.id,
              sessionId: profile.sessionId,
            },
          },
          create: {
            identityProviderId: idp.id,
            sessionId: profile.sessionId,
            userId: user.id,
          },
          update: { userId: user.id },
        }),
      );
    }

    const ip = req.ip || '0.0.0.0';
    const userAgent = req.headers['user-agent'] || 'Unknown';
    await this.logAudit(
      idp.companyId,
      user.id,
      'SsoSession',
      profile.sessionId || 'unknown',
      'SSO_LOGIN',
      { idpId: idp.id, ip },
    );

    // Leverage existing auth service for JWT generation and MFA check
    return this.authService.issueTokensAfterLogin(user, ip, userAgent);
  }

  private async logAudit(
    companyId: string,
    userId: string,
    entity: string,
    entityId: string,
    action: string,
    details: any,
  ) {
    await this.prisma
      .runAsSystem(async (tx) =>
        this.auditService.logEvent(
          {
            companyId,
            userId,
            entity,
            entityId,
            action,
            details,
            source: 'SSO',
          },
          null,
          tx,
        ),
      )
      .catch((err) => this.logger.error('Failed to write audit log', err));
  }
}
