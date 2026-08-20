import { Module } from '@nestjs/common';
import { SsoService } from './sso.service';
import { SsoController } from './sso.controller';
import { AdminSsoController } from './admin-sso.controller';
import { OidcService } from './oidc.service';
import { SamlService } from './saml.service';
import { AuthModule } from '../auth.module';
import { TenantGuard } from '../guards/tenant.guard';

// ---------------------------------------------------------------------------
// SsoModule
//
// Uses the JwtModule from AuthModule (RS256 key-pair) — no separate JwtModule
// registration here, which avoids the previous HS512/JWT_SECRET symmetric path.
// TenantGuard is provided here so AdminSsoController can inject it via
// UseGuards without requiring a global registration.
// ---------------------------------------------------------------------------

@Module({
  imports: [
    AuthModule, // Re-exports JwtModule (RS256), JwtStrategy, etc.
  ],
  controllers: [SsoController, AdminSsoController],
  providers: [SsoService, OidcService, SamlService, TenantGuard],
  exports: [SsoService],
})
export class SsoModule {}
