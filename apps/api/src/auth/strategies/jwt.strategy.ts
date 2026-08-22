import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

// ---------------------------------------------------------------------------
// JwtStrategy — Zero-Trust Enhancement
//
// In the naive implementation, the JWT payload alone was trusted.
// In Zero Trust, EVERY request re-validates the user is still active in the DB.
// The result is cached in the request context — not re-fetched on each guard.
//
// Cost: ~1 DB read per request to the users table (primary key lookup = ~0.5ms).
// Mitigation: Use a Redis cache for user status with a 60-second TTL.
//
// P0-1 FIX: Removed insecure || 'super-secret-fallback' pattern.
// resolveJwtSecret() throws at construction time if secret is absent/insecure.
// ---------------------------------------------------------------------------

import { getJwtPublicKey } from '../auth.module';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  private readonly logger = new Logger(JwtStrategy.name);

  constructor(private readonly prisma: PrismaService) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: { cookies?: Record<string, string> }) => {
          let token = null;
          if (request && request.cookies) {
            token = request.cookies['access_token'];
          }
          return token;
        },
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        ExtractJwt.fromUrlQueryParameter('token'),
      ]),
      ignoreExpiration: false,
      secretOrKey: getJwtPublicKey(),
      algorithms: ['RS256'],
    });
  }

  async validate(payload: { sub: string; cid: string; rid: string }) {
    console.error('JwtStrategy validate called for sub:', payload.sub);
    const user = await this.prisma.runAsSystem('System operation or legacy bypass', async (tx) =>
      tx.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          status: true,
          deletedAt: true,
          roleId: true,
          companyId: true,
          customerId: true,
          vendorId: true,
          driver: { select: { id: true } },
        },
      }),
    );

    if (!user || user.status !== 'ACTIVE' || user.deletedAt) {
      console.error('JwtStrategy validation failed!', { user });
      this.logger.warn(
        `[ZeroTrust] Rejected token for deactivated/deleted user ${payload.sub}`,
      );
      throw new UnauthorizedException('User account is inactive or deleted');
    }
    console.error('JwtStrategy validation succeeded for user:', user.id);

    // Return enriched user context — available as req.user in all downstream guards
    return {
      id: user.id,
      userId: user.id, // alias for legacy guards that use req.user.userId
      email: user.email,
      roleId: user.roleId,
      companyId: user.companyId,
      customerId: user.customerId,
      vendorId: user.vendorId,
      driverId: user.driver?.id,
    };
  }
}
