import { Module } from '@nestjs/common';
import { SsoService } from './sso.service';
import { SsoController } from './sso.controller';
import { AdminSsoController } from './admin-sso.controller';
import { OidcService } from './oidc.service';
import { SamlService } from './saml.service';
import { AuthModule } from '../auth.module';
import { JwtModule } from '@nestjs/jwt';

// ---------------------------------------------------------------------------
// P0-1 FIX: Removed insecure `|| 'super-secret-fallback'` fallback.
// This factory throws at module initialization if JWT_SECRET is absent or
// uses any known insecure placeholder. The application cannot start without
// a valid, cryptographically strong secret.
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
      '[SSO] JWT_SECRET is missing or uses an insecure placeholder. ' +
        "Generate a production secret: node -e \"console.log(require('crypto').randomBytes(64).toString('hex'))\"",
    );
  }
  return secret;
}

@Module({
  imports: [
    AuthModule,
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
  controllers: [SsoController, AdminSsoController],
  providers: [SsoService, OidcService, SamlService],
  exports: [SsoService],
})
export class SsoModule {}
