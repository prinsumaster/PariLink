import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import * as crypto from 'crypto';

@Injectable()
export class PatService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private hashToken(token: string): string {
    return crypto.createHash('sha256').update(token).digest('hex');
  }

  private generateTokenString(): string {
    return `pat_${crypto.randomBytes(32).toString('hex')}`;
  }

  async createPat(
    userId: string,
    companyId: string,
    name: string,
    scopes: string[] = [],
    expiresInDays?: number,
  ) {
    const rawToken = this.generateTokenString();
    const tokenHash = this.hashToken(rawToken);

    let expiresAt: Date | null = null;
    if (expiresInDays) {
      expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + expiresInDays);
    }

    const pat = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.personalAccessToken.create({
        data: {
          userId,
          companyId,
          name,
          tokenHash,
          scopes: JSON.stringify(scopes),
          expiresAt,
        },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'PersonalAccessToken',
      entityId: pat.id,
      action: 'CREATE',
      details: { name, scopes },
      source: 'IAM',
    });

    // Return raw token only once
    return {
      id: pat.id,
      name: pat.name,
      rawToken, // Plain text token to be shown only once
      expiresAt: pat.expiresAt,
    };
  }

  async validatePat(rawToken: string) {
    const tokenHash = this.hashToken(rawToken);

    const pat = await this.prisma.runAsSystem(async (tx) =>
      tx.personalAccessToken.findFirst({
        where: { tokenHash, revokedAt: null },
        include: { user: true, company: true },
      }),
    );

    if (!pat) {
      throw new UnauthorizedException('Invalid Personal Access Token');
    }

    if (pat.expiresAt && pat.expiresAt < new Date()) {
      throw new UnauthorizedException('Personal Access Token has expired');
    }

    // Update lastUsed asynchronously
    this.prisma
      .runAsSystem(async (tx) =>
        tx.personalAccessToken.update({
          where: { id: pat.id },
          data: { lastUsedAt: new Date() },
        }),
      )
      .catch(() => {}); // Fire and forget

    return pat;
  }

  async revokePat(id: string, userId: string, companyId: string) {
    const pat = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.personalAccessToken.findUnique({
        where: { id, companyId },
      }),
    );

    if (!pat || pat.userId !== userId || pat.companyId !== companyId) {
      throw new NotFoundException('Personal Access Token not found');
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.personalAccessToken.update({
        where: { id, companyId },
        data: { revokedAt: new Date() },
      }),
    );

    await this.audit.logEvent({
      companyId,
      userId,
      entity: 'PersonalAccessToken',
      entityId: id,
      action: 'REVOKE',
      source: 'IAM',
    });

    return { success: true };
  }
}
