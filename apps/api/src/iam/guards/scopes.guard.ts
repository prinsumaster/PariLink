import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { SCOPES_KEY } from './scopes.decorator';
import { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { AuditService } from '../../platform/audit/audit.service';

@Injectable()
export class ScopesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly audit: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredScopes = this.reflector.getAllAndOverride<string[]>(
      SCOPES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredScopes || requiredScopes.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    // Admins bypass scope checks
    if (user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    // Standard JWT users typically don't have scopes, they use RBAC.
    // If scopes are enforced, a standard JWT without scopes fails.
    const userScopes = user.scopes || [];

    const hasAllRequiredScopes = requiredScopes.every((scope) =>
      userScopes.includes(scope),
    );

    if (!hasAllRequiredScopes) {
      await this.audit.logEvent({
        companyId: user.companyId,
        userId: user.userId,
        entity: 'Scope',
        entityId: context.getHandler().name,
        action: 'DENY',
        details: { requiredScopes, userScopes },
        source: 'IAM',
      });
      throw new ForbiddenException(
        `Insufficient scopes. Required: ${requiredScopes.join(', ')}`,
      );
    }

    return true;
  }
}
