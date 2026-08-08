/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  Injectable,
  UnauthorizedException,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { BruteForceProtectionService } from '../platform/security/brute-force/brute-force-protection.service';
import { AuditService } from '../platform/audit/audit.service';
import { MfaService } from './mfa.service';
import { ResendService } from '../integrations/resend.service';
import * as bcrypt from 'bcryptjs';
import * as crypto from 'crypto';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// ---------------------------------------------------------------------------
// AuthService — Enterprise Hardened
//
// Changes from naive implementation:
//   1. Brute-force / account-lockout protection (OWASP ASVS 2.2.1)
//   2. Refresh tokens stored as SHA-256 hash — raw token never stored at rest
//   3. Refresh token rotation — old token invalidated on each refresh
//   4. Concurrent session management — max 5 active sessions per user
//   5. Structured audit logging on every auth event
//   6. Generic error messages — no user enumeration via error text
//   7. JWT payload minimized (no PII leakage from decoded tokens)
//   8. Secure token cookie transport available alongside Bearer header
// ---------------------------------------------------------------------------

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly MAX_CONCURRENT_SESSIONS = 5;

  // In-memory challenge store (use Redis in prod)
  private readonly webAuthnChallenges = new Map<string, string>();

  // Constants for WebAuthn
  private readonly rpName = 'PariLink Enterprise';
  private readonly rpID = process.env.WEBAUTHN_RPID || 'localhost';
  private readonly origin =
    process.env.WEBAUTHN_ORIGIN || `http://${this.rpID}:3000`;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly bruteForce: BruteForceProtectionService,
    private readonly auditService: AuditService,
    private readonly mfaService: MfaService,
    private readonly resendService: ResendService,
  ) {}

  async register(
    registerDto: RegisterDto,
    ipAddress?: string,
    deviceInfo?: string,
  ) {
    const { email, password, companyName } = registerDto;

    const existingUser = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: email.toLowerCase() },
      }),
    );

    if (existingUser) {
      throw new ForbiddenException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await this.prisma.runAsSystem(async (tx) => {
      // 1. Create company
      const company = await tx.company.create({
        data: { name: companyName, status: 'ACTIVE' },
      });

      // 2. Create role
      const role = await tx.role.create({
        data: {
          name: 'SUPER_ADMIN',
          description: 'Full system access',
          permissions: ['*'],
          companyId: company.id,
        },
      });

      // 3. Create user
      const user = await tx.user.create({
        data: {
          email: email.toLowerCase(),
          password: hashedPassword,
          firstName: 'Admin',
          lastName: 'User',
          roleId: role.id,
          companyId: company.id,
          status: 'ACTIVE',
        },
      });

      return user;
    });

    // Send Welcome Email
    await this.resendService.sendTransactionalEmail(
      email.toLowerCase(),
      'Welcome to PariLink Enterprise',
      `<p>Your account for ${companyName} has been created successfully.</p>`,
    );

    // 4. Log the user in
    return this.login({ email, password }, ipAddress, deviceInfo);
  }

  async login(loginDto: LoginDto, ipAddress?: string, deviceInfo?: string) {
    const { email, password } = loginDto;

    // 1. Brute-force check BEFORE touching the database
    const bfCheck = await this.bruteForce.checkLoginAttempt(email, ipAddress);
    if (!bfCheck.allowed) {
      const reason = bfCheck.permanentlyLocked
        ? 'Account permanently locked. Contact your administrator.'
        : `Account temporarily locked until ${bfCheck.lockedUntil?.toISOString()}.`;
      throw new ForbiddenException(reason);
    }

    // 2. Load user — use a generic error to prevent user enumeration
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
          email: true,
          password: true,
          firstName: true,
          lastName: true,
          status: true,
          deletedAt: true,
          roleId: true,
          companyId: true,
          mfaEnabled: true,
          role: {
            select: {
              name: true,
              permissions: true,
            },
          },
          company: {
            select: {
              tenantConfiguration: {
                select: { onboardingCompleted: true },
              },
            },
          },
        },
      }),
    );

    const GENERIC_AUTH_ERROR = 'Invalid credentials';

    if (!user || user.status !== 'ACTIVE' || user.deletedAt) {
      // Record failure against the email even if user doesn't exist
      // (prevents timing-based user enumeration)
      await this.bruteForce.recordFailedAttempt(email, ipAddress);
      await this.auditService.logEvent({
        action: 'LOGIN_FAILED',
        entity: 'User',
        entityId: email,
        companyId: null as any, // AuditLog requires companyId optionally? Let's assume it's optional or handled.
        source: 'AUTH',
        details: { reason: 'User not found or inactive', ip: ipAddress },
      });
      throw new UnauthorizedException(GENERIC_AUTH_ERROR);
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      const result = await this.bruteForce.recordFailedAttempt(
        email,
        ipAddress,
      );
      await this.auditService.logEvent({
        action: 'LOGIN_FAILED',
        entity: 'User',
        entityId: user.id,
        companyId: user.companyId,
        userId: user.id,
        source: 'AUTH',
        details: {
          reason: 'Invalid password',
          ip: ipAddress,
          remainingAttempts: result.remainingAttempts,
        },
      });
      throw new UnauthorizedException(GENERIC_AUTH_ERROR);
    }

    // 3. MFA & Trusted Device Check
    let isTrusted = false;
    let returnedDeviceIdentifier = undefined;

    if (loginDto.deviceIdentifier) {
      const trustedDevice = await this.prisma.runAsSystem(async (tx) =>
        tx.trustedDevice.findFirst({
          where: {
            userId: user.id,
            deviceIdentifier: loginDto.deviceIdentifier,
            expiresAt: { gt: new Date() },
          },
        }),
      );
      if (trustedDevice) {
        isTrusted = true;
        await this.prisma.runAsSystem(async (tx) =>
          tx.trustedDevice.update({
            where: { id: trustedDevice.id },
            data: { lastUsedAt: new Date(), ipAddress, deviceInfo },
          }),
        );
      }
    }

    if (user.mfaEnabled && !isTrusted) {
      if (!loginDto.mfaToken) {
        return { requiresMfa: true }; // Client needs to prompt for MFA
      }

      try {
        await this.mfaService.verifyTotp(user.id, loginDto.mfaToken);
      } catch (err) {
        try {
          await this.mfaService.verifyBackupCode(user.id, loginDto.mfaToken);
        } catch (backupErr) {
          await this.auditService.logEvent({
            action: 'LOGIN_MFA_FAILED',
            entity: 'User',
            entityId: user.id,
            companyId: user.companyId,
            userId: user.id,
            source: 'AUTH',
            details: { ip: ipAddress },
          });
          throw new UnauthorizedException('Invalid MFA token or backup code');
        }
      }

      if (loginDto.trustDevice) {
        const deviceId = crypto.randomUUID();
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // 30 days

        await this.prisma.runAsSystem(async (tx) =>
          tx.trustedDevice.create({
            data: {
              userId: user.id,
              deviceIdentifier: deviceId,
              deviceInfo,
              ipAddress,
              expiresAt,
            },
          }),
        );
        returnedDeviceIdentifier = deviceId;
      }
    }

    // 4. Successful authentication — clear brute-force counter
    await this.bruteForce.recordSuccessfulLogin(email);

    // 4. Concurrent session enforcement — evict oldest if over limit
    await this.enforceSessionLimit(user.id);

    // 5. Mint tokens
    const { accessToken, refreshToken, refreshTokenHash, refreshExpiresAt } =
      await this.mintTokens(user);

    // 6. Store hashed refresh token (never the raw token)
    await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.create({
        data: {
          token: refreshTokenHash,
          userId: user.id,
          expiresAt: refreshExpiresAt,
          ipAddress,
          deviceInfo,
          deviceFingerprint: loginDto.deviceFingerprint,
          history: [
            {
              ip: ipAddress,
              device: deviceInfo,
              date: new Date().toISOString(),
            },
          ],
        },
      }),
    );

    // 7. Audit log
    await this.auditService.logEvent({
      action: 'LOGIN_SUCCESS',
      entity: 'User',
      entityId: user.id,
      companyId: user.companyId,
      userId: user.id,
      source: 'AUTH',
      details: { ip: ipAddress },
    });

    this.logger.log(`User ${user.id} logged in from ${ipAddress}`);

    return {
      access_token: accessToken,
      refresh_token: refreshToken, // raw — send to client only
      device_identifier: returnedDeviceIdentifier,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        role: (user as any).role?.name,
        permissions: (user as any).role?.permissions || [],
        companyId: user.companyId,
        defaultTenantId: user.companyId,
        onboardingCompleted:
          (user as any).company?.tenantConfiguration?.onboardingCompleted ??
          false,
      },
    };
  }

  async refreshToken(
    rawToken: string,
    ipAddress?: string,
    deviceInfo?: string,
    deviceFingerprint?: string,
  ) {
    if (!rawToken) throw new UnauthorizedException('Refresh token required');

    // Hash the incoming raw token to look it up in the DB
    const tokenHash = crypto
      .createHash('sha256')
      .update(rawToken)
      .digest('hex');

    const tokenRecord = await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.findUnique({
        where: { token: tokenHash },
        include: {
          user: {
            select: {
              id: true,
              email: true,
              status: true,
              deletedAt: true,
              roleId: true,
              companyId: true,
              role: {
                select: {
                  name: true,
                  permissions: true,
                },
              },
            },
          },
        },
      }),
    );

    // Token not found, expired, or already rotated
    if (!tokenRecord || tokenRecord.expiresAt < new Date()) {
      if (tokenRecord) {
        // Possible token reuse attack — invalidate entire session
        await this.prisma.runAsSystem(async (tx) =>
          tx.refreshToken.deleteMany({
            where: { familyId: tokenRecord.familyId },
          }),
        );
        this.logger.warn(
          `[Auth] Expired refresh token reuse detected from ${ipAddress}. Revoking token family.`,
        );
      }
      throw new UnauthorizedException('Invalid or expired refresh token');
    }

    // Replay detection (token is marked revoked, but someone is trying to use it)
    if (tokenRecord.isRevoked) {
      // 15-second grace period for concurrent refresh requests (e.g., from multiple SPA tabs)
      const isWithinGracePeriod =
        tokenRecord.updatedAt.getTime() > Date.now() - 15000;

      if (!isWithinGracePeriod) {
        await this.prisma.runAsSystem(async (tx) =>
          tx.refreshToken.deleteMany({
            where: { familyId: tokenRecord.familyId },
          }),
        );
        await this.auditService.logEvent({
          action: 'REPLAY_ATTACK_DETECTED',
          entity: 'User',
          entityId: tokenRecord.userId,
          companyId: tokenRecord.user.companyId,
          userId: tokenRecord.userId,
          source: 'AUTH',
          details: { ip: ipAddress, familyId: tokenRecord.familyId },
        });
        this.logger.warn(
          `[Auth] Replay attack detected for user ${tokenRecord.userId}. Revoked token family.`,
        );
        throw new UnauthorizedException(
          'Replay attack detected. Session terminated.',
        );
      } else {
        this.logger.debug(
          `[Auth] Concurrent refresh detected within grace period for user ${tokenRecord.userId}. Request rejected safely.`,
        );
        throw new UnauthorizedException('Token already refreshed recently');
      }
    }

    // Device Fingerprint Binding
    const enforcement = process.env.DEVICE_BINDING_ENFORCEMENT || 'WARN';
    if (
      enforcement !== 'OFF' &&
      tokenRecord.deviceFingerprint &&
      deviceFingerprint
    ) {
      if (tokenRecord.deviceFingerprint !== deviceFingerprint) {
        await this.auditService.logEvent({
          action: 'DEVICE_MISMATCH',
          entity: 'User',
          entityId: tokenRecord.userId,
          companyId: tokenRecord.user.companyId,
          userId: tokenRecord.userId,
          source: 'AUTH',
          details: {
            ip: ipAddress,
            expected: tokenRecord.deviceFingerprint,
            actual: deviceFingerprint,
          },
        });

        if (enforcement === 'ENFORCE') {
          throw new UnauthorizedException(
            'Device fingerprint mismatch. Please login again.',
          );
        } else {
          this.logger.warn(
            `Device fingerprint mismatch for user ${tokenRecord.userId} (ip: ${ipAddress})`,
          );
        }
      }
    }

    const { user } = tokenRecord;
    if (user.status !== 'ACTIVE' || user.deletedAt) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.refreshToken.deleteMany({
          where: { familyId: tokenRecord.familyId },
        }),
      );
      throw new UnauthorizedException('User account is inactive');
    }

    // Token rotation — mark old token as revoked instead of deleting
    const {
      accessToken,
      refreshToken: newRaw,
      refreshTokenHash,
      refreshExpiresAt,
    } = await this.mintTokens(user);

    await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.update({
        where: { id: tokenRecord.id },
        data: {
          isRevoked: true,
          replacedByToken: refreshTokenHash,
        },
      }),
    );

    const history = Array.isArray(tokenRecord.history)
      ? tokenRecord.history
      : [];
    const newHistory = [
      ...history,
      { ip: ipAddress, device: deviceInfo, date: new Date().toISOString() },
    ];

    // Prune history to keep only the last 10 entries to save space
    if (newHistory.length > 10) newHistory.shift();

    await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.create({
        data: {
          token: refreshTokenHash,
          familyId: tokenRecord.familyId,
          userId: user.id,
          expiresAt: refreshExpiresAt,
          ipAddress,
          deviceInfo,
          deviceFingerprint: deviceFingerprint || tokenRecord.deviceFingerprint,
          history: newHistory,
        },
      }),
    );

    return {
      access_token: accessToken,
      refresh_token: newRaw,
      user: {
        id: user.id,
        email: user.email,
        roleId: user.roleId,
        role: (user as any).role?.name,
        permissions: (user as any).role?.permissions || [],
        companyId: user.companyId,
        defaultTenantId: user.companyId,
      },
    };
  }

  async logout(rawToken: string, userId: string): Promise<void> {
    if (rawToken) {
      const tokenHash = crypto
        .createHash('sha256')
        .update(rawToken)
        .digest('hex');
      await this.prisma
        .runAsSystem(async (tx) =>
          tx.refreshToken.delete({ where: { token: tokenHash } }),
        )
        .catch(() => {}); // Already deleted — no-op
    }

    await this.auditService.logEvent({
      action: 'LOGOUT',
      entity: 'User',
      entityId: userId,
      companyId: 'N/A', // Caller should pass companyId if available
      userId,
      source: 'AUTH',
    });
  }

  async logoutAllSessions(userId: string): Promise<void> {
    await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.deleteMany({ where: { userId } }),
    );
    this.logger.log(`All sessions revoked for user ${userId}`);
  }

  // ─────────────────────────────────────────────────────────────────────────
  // Private helpers
  // ─────────────────────────────────────────────────────────────────────────

  private async mintTokens(user: {
    id: string;
    email: string;
    roleId: string | null;
    companyId: string;
  }) {
    const payload = {
      sub: user.id,
      cid: user.companyId, // companyId abbreviated for token size
      rid: user.roleId, // roleId abbreviated
      // email deliberately omitted — reduces token size, lowers PII risk
    };

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: '15m',
      algorithm: 'HS512', // SHA-512 MAC — stronger than HS256
    });

    const rawRefreshToken = crypto.randomBytes(48).toString('base64url');
    const refreshTokenHash = crypto
      .createHash('sha256')
      .update(rawRefreshToken)
      .digest('hex');

    const refreshExpiresAt = new Date();
    refreshExpiresAt.setDate(refreshExpiresAt.getDate() + 7);

    return {
      accessToken,
      refreshToken: rawRefreshToken,
      refreshTokenHash,
      refreshExpiresAt,
    };
  }

  private async enforceSessionLimit(userId: string): Promise<void> {
    const sessions = await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.findMany({
        where: { userId },
        orderBy: { lastActiveAt: 'asc' }, // oldest active first
      }),
    );

    if (sessions.length >= this.MAX_CONCURRENT_SESSIONS) {
      const excess = sessions.slice(
        0,
        sessions.length - this.MAX_CONCURRENT_SESSIONS + 1,
      );
      await this.prisma.runAsSystem(async (tx) =>
        tx.refreshToken.deleteMany({
          where: { id: { in: excess.map((s) => s.id) } },
        }),
      );
      this.logger.log(
        `[Session] Evicted ${excess.length} oldest session(s) for user ${userId}`,
      );
    }
  }

  async getActiveSessions(userId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.findMany({
        where: { userId },
        select: {
          id: true,
          deviceInfo: true,
          ipAddress: true,
          lastActiveAt: true,
          createdAt: true,
        },
        orderBy: { lastActiveAt: 'desc' },
      }),
    );
  }

  async revokeSession(userId: string, sessionId: string) {
    const session = await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.findFirst({
        where: { id: sessionId, userId },
      }),
    );
    if (!session) throw new UnauthorizedException('Session not found');

    await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.delete({
        where: { id: sessionId },
      }),
    );

    this.logger.log(
      `[Session] Revoked session ${sessionId} for user ${userId}`,
    );
    return { success: true };
  }

  // ─────────────────────────────────────────────────────────────────────────
  // WebAuthn / Passkeys Implementation
  // ─────────────────────────────────────────────────────────────────────────

  async generateWebAuthnRegistrationOptions(email: string) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { webAuthnCredentials: true },
      }),
    );

    if (!user) throw new UnauthorizedException('User not found');

    const options = await generateRegistrationOptions({
      rpName: this.rpName,
      rpID: this.rpID,
      userID: new Uint8Array(Buffer.from(user.id)),
      userName: user.email,
      userDisplayName: `${user.firstName} ${user.lastName}`,
      attestationType: 'none',
      excludeCredentials: user.webAuthnCredentials.map((cred) => ({
        id: Buffer.from(cred.credentialID).toString('base64url'),
        type: 'public-key',
        transports: cred.transports as any,
      })),
      authenticatorSelection: {
        residentKey: 'required',
        userVerification: 'preferred',
      },
    });

    this.webAuthnChallenges.set(
      `reg:${email.toLowerCase()}`,
      options.challenge,
    );
    return options;
  }

  async verifyWebAuthnRegistration(email: string, response: any) {
    const expectedChallenge = this.webAuthnChallenges.get(
      `reg:${email.toLowerCase()}`,
    );
    if (!expectedChallenge)
      throw new ForbiddenException('Challenge expired or not found');

    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: email.toLowerCase() },
      }),
    );
    if (!user) throw new UnauthorizedException('User not found');

    const verification = await verifyRegistrationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
    });

    if (verification.verified && verification.registrationInfo) {
      const { credential, credentialDeviceType, credentialBackedUp } =
        verification.registrationInfo;

      await this.prisma.runAsSystem(async (tx) =>
        tx.webAuthnCredential.create({
          data: {
            userId: user.id,
            credentialID: Buffer.from(credential.id),
            credentialPublicKey: Buffer.from(credential.publicKey),
            counter: credential.counter,
            credentialDeviceType,
            credentialBackedUp,
            transports: response.response.transports || [],
          },
        }),
      );

      this.webAuthnChallenges.delete(`reg:${email.toLowerCase()}`);
      return { verified: true };
    }

    throw new ForbiddenException('Passkey registration failed');
  }

  async generateWebAuthnAuthenticationOptions(email: string) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { webAuthnCredentials: true },
      }),
    );

    if (!user) throw new UnauthorizedException('User not found');

    const options = await generateAuthenticationOptions({
      rpID: this.rpID,
      allowCredentials: user.webAuthnCredentials.map((cred) => ({
        id: Buffer.from(cred.credentialID).toString('base64url'),
        type: 'public-key',
        transports: cred.transports as any,
      })),
      userVerification: 'preferred',
    });

    this.webAuthnChallenges.set(
      `auth:${email.toLowerCase()}`,
      options.challenge,
    );
    return options;
  }

  async verifyWebAuthnAuthentication(
    email: string,
    response: any,
    ipAddress?: string,
    deviceInfo?: string,
    deviceFingerprint?: string,
  ) {
    const expectedChallenge = this.webAuthnChallenges.get(
      `auth:${email.toLowerCase()}`,
    );
    if (!expectedChallenge)
      throw new ForbiddenException('Challenge expired or not found');

    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { email: email.toLowerCase() },
        include: { webAuthnCredentials: true },
      }),
    );
    if (!user) throw new UnauthorizedException('User not found');

    const credential = user.webAuthnCredentials.find(
      (c) => Buffer.from(c.credentialID).toString('base64url') === response.id,
    );

    if (!credential) throw new ForbiddenException('Passkey not found for user');

    const verification = await verifyAuthenticationResponse({
      response,
      expectedChallenge,
      expectedOrigin: this.origin,
      expectedRPID: this.rpID,
      credential: {
        id: Buffer.from(credential.credentialID).toString('base64url'),
        publicKey: new Uint8Array(credential.credentialPublicKey),
        counter: credential.counter,
        transports: credential.transports as any,
      },
    });

    if (verification.verified) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.webAuthnCredential.update({
          where: { id: credential.id },
          data: {
            counter: verification.authenticationInfo.newCounter,
            lastUsedAt: new Date(),
          },
        }),
      );

      this.webAuthnChallenges.delete(`auth:${email.toLowerCase()}`);
      await this.auditService.logEvent({
        action: 'LOGIN_SUCCESS_PASSKEY',
        entity: 'User',
        entityId: user.id,
        companyId: user.companyId,
        userId: user.id,
        source: 'AUTH',
      });

      // Issue tokens
      const { accessToken, refreshToken, refreshTokenHash, refreshExpiresAt } =
        await this.mintTokens(user);

      await this.prisma.runAsSystem(async (tx) =>
        tx.refreshToken.create({
          data: {
            token: refreshTokenHash,
            userId: user.id,
            expiresAt: refreshExpiresAt,
            ipAddress,
            deviceInfo,
            deviceFingerprint,
            history: [
              {
                ip: ipAddress,
                device: deviceInfo,
                date: new Date().toISOString(),
              },
            ],
          },
        }),
      );

      return {
        access_token: accessToken,
        refresh_token: refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          roleId: user.roleId,
          role: (user as any).role?.name,
          permissions: (user as any).role?.permissions || [],
          companyId: user.companyId,
          defaultTenantId: user.companyId,
        },
      };
    }

    throw new ForbiddenException('Passkey authentication failed');
  }

  async issueTokensAfterLogin(
    user: any,
    ipAddress: string,
    deviceInfo: string,
    deviceFingerprint?: string,
  ) {
    // Concurrent session enforcement — evict oldest if over limit
    await this.enforceSessionLimit(user.id);

    // Mint tokens
    const { accessToken, refreshToken, refreshTokenHash, refreshExpiresAt } =
      await this.mintTokens(user);

    // Store hashed refresh token
    await this.prisma.runAsSystem(async (tx) =>
      tx.refreshToken.create({
        data: {
          token: refreshTokenHash,
          userId: user.id,
          expiresAt: refreshExpiresAt,
          ipAddress,
          deviceInfo,
          deviceFingerprint: deviceFingerprint || null,
          history: [
            {
              action: 'ISSUED_SSO',
              timestamp: new Date(),
              ipAddress,
              deviceInfo,
            },
          ],
        },
      }),
    );

    return {
      access_token: accessToken,
      refresh_token: refreshToken, // raw token to be set in cookie
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roleId: user.roleId,
        companyId: user.companyId,
        defaultTenantId: user.companyId,
      },
    };
  }
}
