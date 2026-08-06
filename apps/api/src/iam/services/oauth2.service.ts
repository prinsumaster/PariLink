import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import * as crypto from 'crypto';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class OAuth2Service {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  private hashSecret(secret: string): string {
    return crypto.createHash('sha256').update(secret).digest('hex');
  }

  private generateClientCredentials(): {
    clientId: string;
    clientSecret: string;
  } {
    return {
      clientId: `client_${crypto.randomBytes(16).toString('hex')}`,
      clientSecret: `secret_${crypto.randomBytes(32).toString('hex')}`,
    };
  }

  async registerClient(
    companyId: string,
    name: string,
    description?: string,
    scopes: string[] = [],
  ) {
    const { clientId, clientSecret } = this.generateClientCredentials();
    const clientSecretHash = this.hashSecret(clientSecret);

    const client = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.oAuthClient.create({
        data: {
          companyId,
          clientId,
          clientSecret: clientSecretHash,
          name,
          description,
          scopes: JSON.stringify(scopes),
          grantTypes: JSON.stringify(['client_credentials']),
        },
      }),
    );

    await this.audit.logEvent({
      companyId,
      entity: 'OAuthClient',
      entityId: client.id,
      action: 'CREATE',
      details: { name, scopes },
      source: 'IAM',
    });

    // Return client secret only once
    return {
      id: client.id,
      clientId,
      clientSecret, // Plain text secret to be shown only once
      name: client.name,
      scopes,
    };
  }

  async issueClientCredentialsToken(
    clientId: string,
    clientSecret: string,
    requestedScopes: string[] = [],
  ) {
    const secretHash = this.hashSecret(clientSecret);

    const client = await this.prisma.runAsSystem(async (tx) =>
      tx.oAuthClient.findFirst({
        where: { clientId, clientSecret: secretHash, isActive: true },
        include: { company: true },
      }),
    );

    if (!client) {
      throw new UnauthorizedException('Invalid client credentials');
    }

    const allowedScopes = JSON.parse(client.scopes as string) as string[];
    const grantedScopes =
      requestedScopes.length > 0
        ? requestedScopes.filter((scope) => allowedScopes.includes(scope))
        : allowedScopes;

    const expiresIn = 3600; // 1 hour
    const payload = {
      sub: clientId,
      type: 'client_credentials',
      companyId: client.companyId,
      scopes: grantedScopes,
    };

    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      throw new Error('JWT_SECRET is not configured');
    }

    const token = jwt.sign(payload, jwtSecret, { expiresIn });
    const tokenHash = this.hashSecret(token);

    const expiresAt = new Date();
    expiresAt.setSeconds(expiresAt.getSeconds() + expiresIn);

    await this.prisma.runAsSystem(async (tx) =>
      tx.oAuthToken.create({
        data: {
          clientId: client.id,
          tokenHash,
          scopes: JSON.stringify(grantedScopes),
          expiresAt,
        },
      }),
    );

    await this.audit.logEvent({
      companyId: client.companyId,
      entity: 'OAuthToken',
      entityId: client.id,
      action: 'CREATE',
      details: { scopes: grantedScopes },
      source: 'IAM',
    });

    return {
      access_token: token,
      token_type: 'Bearer',
      expires_in: expiresIn,
      scope: grantedScopes.join(' '),
    };
  }

  async validateToken(token: string) {
    const tokenHash = this.hashSecret(token);
    const oauthToken = await this.prisma.runAsSystem(async (tx) =>
      tx.oAuthToken.findUnique({
        where: { tokenHash },
        include: { client: { include: { company: true } } },
      }),
    );

    if (
      !oauthToken ||
      oauthToken.revokedAt ||
      oauthToken.expiresAt < new Date()
    ) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    if (!oauthToken.client.isActive) {
      throw new UnauthorizedException('OAuth Client is disabled');
    }

    return oauthToken;
  }

  async revokeToken(token: string) {
    const tokenHash = this.hashSecret(token);

    const oauthToken = await this.prisma.runAsSystem(async (tx) =>
      tx.oAuthToken.findUnique({
        where: { tokenHash },
        include: { client: true },
      }),
    );

    if (!oauthToken) {
      throw new NotFoundException('Token not found');
    }

    await this.prisma.runAsSystem(async (tx) =>
      tx.oAuthToken.update({
        where: { id: oauthToken.id },
        data: { revokedAt: new Date() },
      }),
    );

    await this.audit.logEvent({
      companyId: oauthToken.client.companyId,
      entity: 'OAuthToken',
      entityId: oauthToken.id,
      action: 'REVOKE',
      source: 'IAM',
    });

    return { success: true };
  }
}
