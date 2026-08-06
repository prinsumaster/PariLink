import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { SecurityContextService } from '../platform/security/security.service';
import { AuditService } from '../platform/audit/audit.service';
import { authenticator } from 'otplib';
import * as QRCode from 'qrcode';
import * as crypto from 'crypto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class MfaService {
  private readonly logger = new Logger(MfaService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly security: SecurityContextService,
    private readonly auditService: AuditService,
  ) {
    authenticator.options = { window: 1 }; // Allow 1 step (30s) drift
  }

  async generateTotpSecret(userId: string, email: string) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({ where: { id: userId } }),
    );
    if (!user) throw new UnauthorizedException('User not found');
    if (user.mfaEnabled)
      throw new BadRequestException('MFA is already enabled');

    const secret = authenticator.generateSecret();
    const otpauthUrl = authenticator.keyuri(email, 'PariLink', secret);

    const qrCodeDataUrl = await QRCode.toDataURL(otpauthUrl);

    // Encrypt the secret before storing
    const encryptedSecret = this.security.encryptSecret(secret);

    await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: userId },
        data: { totpSecret: encryptedSecret },
      }),
    );

    return { secret, qrCodeDataUrl };
  }

  async verifyTotpSetup(userId: string, token: string) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({ where: { id: userId } }),
    );
    if (!user || !user.totpSecret) {
      throw new BadRequestException('TOTP setup not initialized');
    }

    const decryptedSecret = this.security.decryptSecret(user.totpSecret);
    const isValid = authenticator.verify({ token, secret: decryptedSecret });

    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP token');
    }

    // Generate Backup Codes
    const backupCodes = this.generateBackupCodes();
    const backupCodePromises = backupCodes.map(async (code) => {
      const codeHash = await bcrypt.hash(code, 10);
      return this.prisma.runAsSystem(async (tx) =>
        tx.backupCode.create({
          data: { userId, codeHash },
        }),
      );
    });

    await Promise.all(backupCodePromises);

    // Enable MFA
    await this.prisma.runAsSystem(async (tx) =>
      tx.user.update({
        where: { id: userId },
        data: { mfaEnabled: true },
      }),
    );

    this.logger.log(`[MFA] User ${userId} successfully enabled MFA`);

    await this.auditService.logEvent({
      action: 'MFA_ENABLED',
      entity: 'User',
      entityId: userId,
      companyId: user.companyId,
      userId,
      source: 'AUTH',
    });

    return {
      success: true,
      backupCodes, // Only show once
    };
  }

  async verifyTotp(userId: string, token: string) {
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({ where: { id: userId } }),
    );
    if (!user || !user.totpSecret) {
      throw new BadRequestException('MFA not enabled');
    }

    const decryptedSecret = this.security.decryptSecret(user.totpSecret);
    const isValid = authenticator.verify({ token, secret: decryptedSecret });

    if (!isValid) {
      throw new UnauthorizedException('Invalid TOTP token');
    }

    return true;
  }

  async verifyBackupCode(userId: string, code: string) {
    const backupCodes = await this.prisma.runAsSystem(async (tx) =>
      tx.backupCode.findMany({
        where: { userId, used: false },
      }),
    );

    for (const backup of backupCodes) {
      const isValid = await bcrypt.compare(code, backup.codeHash);
      if (isValid) {
        await this.prisma.runAsSystem(async (tx) =>
          tx.backupCode.update({
            where: { id: backup.id },
            data: { used: true, usedAt: new Date() },
          }),
        );
        this.logger.log(`[MFA] User ${userId} consumed a backup code`);
        return true;
      }
    }

    throw new UnauthorizedException('Invalid backup code');
  }

  private generateBackupCodes(
    count: number = 10,
    length: number = 10,
  ): string[] {
    const codes: string[] = [];
    for (let i = 0; i < count; i++) {
      codes.push(crypto.randomBytes(length / 2).toString('hex'));
    }
    return codes;
  }
}
