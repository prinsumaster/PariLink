import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { BruteForceProtectionService } from '../platform/security/brute-force/brute-force-protection.service';
import { MfaService } from './mfa.service';

const INSECURE_DEFAULTS = new Set([
  'super-secret-fallback',
  'parilink-secure-jwt-secret-in-prod',
  'GENERATE_64_BYTE_HEX_SECRET_HERE',
]);

function resolveJwtSecret(): string {
  const secret = process.env.JWT_SECRET;
  if (!secret || INSECURE_DEFAULTS.has(secret)) {
    throw new Error(
      '[AUTH] JWT_SECRET is missing or uses an insecure placeholder. ' +
        "Generate a production secret: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
  }
  return secret;
}

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      useFactory: () => ({
        secret: resolveJwtSecret(),
        signOptions: {
          expiresIn: '15m',
          algorithm: 'HS512',
        },
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    BruteForceProtectionService,
    MfaService,
  ],
  exports: [AuthService, MfaService],
})
export class AuthModule {}
