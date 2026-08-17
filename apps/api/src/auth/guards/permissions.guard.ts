import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Logger,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PERMISSIONS_KEY } from '../decorators/permissions.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';
import { IamPolicyEngineService } from '../../platform/iam/iam-policy-engine.service';
import { AuditService } from '../../platform/audit/audit.service';

// ---------------------------------------------------------------------------
// PermissionsGuard — Zero Trust Authorization
//
// Refactored to use the IamPolicyEngineService which enforces:
//   Layer 1 — RBAC (role → permission strings)
//   Layer 2 — ABAC (ownership, branch context)
//   Layer 3 — RLS  (companyId tenant isolation — always enforced first)
//
// All authorization failures are immediately audit-logged as security events
// so they surface in the SIEM / Security Dashboard.
// ---------------------------------------------------------------------------

@Injectable()
export class PermissionsGuard implements CanActivate {
  private readonly logger = new Logger(PermissionsGuard.name);

  constructor(
    private readonly reflector: Reflector,
    private readonly iam: IamPolicyEngineService,
    private readonly audit: AuditService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    const requiredPermissions = this.reflector.getAllAndOverride<string[]>(
      PERMISSIONS_KEY,
      [context.getHandler(), context.getClass()],
    );

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // No @RequirePermissions decorator — deny by default (fail-closed)
    // To explicitly allow public access, a @Public decorator should be used.
    if (!requiredPermissions || requiredPermissions.length === 0) {
      this.logger.warn(`[IAM] Fail-closed: Endpoint ${request.method} ${request.url} has no @RequirePermissions`);
      throw new ForbiddenException('Authorization configuration missing. Access denied by default.');
    }

    if (!user) {
      // This should be caught by JwtAuthGuard first, but fail-safe here
      throw new ForbiddenException('Authentication required');
    }

    // Evaluate every required permission through the policy engine
    const decisions = await Promise.all(
      requiredPermissions.map(async (permission) => {
        const [resource, action] = permission.split(':');
        return {
          permission,
          decision: await this.iam.authorize({
            userId: user.id,
            companyId: user.companyId,
            roleId: user.roleId,
            resource,
            action: action ?? 'read',
          }),
        };
      }),
    );

    const allGranted = decisions.every(({ decision }) => decision.granted);

    if (!allGranted) {
      const denied = decisions.find(({ decision }) => !decision.granted)!;
      
      this.logger.warn(
        `[IAM] Authorization denied: user=${user.id} tenant=${user.companyId} ` +
          `permission=${denied.permission} reason=${denied.decision.reason} path=${request.url}`,
      );

      // Fire-and-forget security audit event — never blocks the response
      this.audit
        .logEvent({
          action: 'AUTHORIZATION_DENIED',
          entity: denied.permission.split(':')[0],
          entityId: request.params?.id ?? 'N/A',
          companyId: user.companyId,
          userId: user.id,
          source: 'PERMISSION_GUARD',
          details: {
            requiredPermission: denied.permission,
            reason: denied.decision.reason,
            path: request.url,
            method: request.method,
            ip: request.ip,
          },
        })
        .catch(() => {}); // Must not throw

      throw new ForbiddenException(
        'You do not have permission to perform this action.',
      );
    }

    return true;
  }
}
