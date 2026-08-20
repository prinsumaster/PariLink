import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

// ---------------------------------------------------------------------------
// TenantGuard — Zero Trust Tenant Isolation
//
// When a route includes a :companyId path parameter, this guard automatically
// compares it against the authenticated user's JWT companyId.
//
// Design:
//   - Applied globally (after JwtAuthGuard) or per-controller via @UseGuards
//   - Fail-closed: if the route has :companyId, the JWT companyId MUST match
//   - Public routes (@Public decorator) are skipped
//   - Routes without :companyId are skipped (guard is a no-op)
//   - Super-admin override: users with platform:admin permission bypass this
//     check (managed via the separate PermissionsGuard / IAM engine)
//
// Usage:
//   @UseGuards(JwtAuthGuard, TenantGuard, PermissionsGuard)
//   @Controller('companies/:companyId/idps')
//   export class AdminSsoController { ... }
// ---------------------------------------------------------------------------

@Injectable()
export class TenantGuard implements CanActivate {
  private readonly logger = new Logger(TenantGuard.name);

  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Skip for @Public routes
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();
    const params = request.params ?? {};

    // If no :companyId param on this route, guard is a no-op
    if (!('companyId' in params)) return true;

    const routeCompanyId = params.companyId as string;
    const user = request.user;

    if (!user) {
      // JwtAuthGuard should have caught this first, but fail-safe
      throw new ForbiddenException('Authentication required');
    }

    const jwtCompanyId = user.companyId as string | undefined;

    if (!jwtCompanyId || jwtCompanyId !== routeCompanyId) {
      this.logger.warn(
        `[TENANT_GUARD] Cross-tenant access blocked: user=${user.id} ` +
          `jwtTenant=${jwtCompanyId} routeTenant=${routeCompanyId} ` +
          `path=${request.url} method=${request.method}`,
      );
      throw new ForbiddenException(
        'Access to this tenant is not permitted.',
      );
    }

    return true;
  }
}
