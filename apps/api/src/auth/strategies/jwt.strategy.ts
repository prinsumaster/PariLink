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

const INSECURE_DEFAULTS = new Set([
  'super-secret-fallback',
  'parilink-secure-jwt-secret-in-prod',
  'GENERATE_64_BYTE_HEX_SECRET_HERE',
]);

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || INSECURE_DEFAULTS.has(secret)) {
    throw new Error(
      '[JwtStrategy] JWT_SECRET is missing or uses an insecure placeholder. ' +
        "Generate a production secret: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
  }
  return secret;
}

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
      ]),
      ignoreExpiration: false,
      secretOrKey: resolveJwtSecret(),
      algorithms: ['HS512'],
    });
  }

  async validate(payload: { sub: string; cid: string; rid: string }) {
    console.error('JwtStrategy validate called for sub:', payload.sub);
    const user = await this.prisma.runAsSystem(async (tx) =>
      tx.user.findUnique({
        where: { id: payload.sub },
        select: {
          id: true,
          email: true,
          status: true,
          deletedAt: true,
          roleId: true,
          companyId: true,
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
    };
  }
}
