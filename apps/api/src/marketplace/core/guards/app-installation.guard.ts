import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../../prisma/prisma.service';

export const RequiredScopes = (...scopes: string[]) =>
  Reflect.metadata('required_scopes', scopes);

@Injectable()
export class AppInstallationGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredScopes = this.reflector.get<string[]>(
      'required_scopes',
      context.getHandler(),
    );
    if (!requiredScopes || requiredScopes.length === 0) {
      return true; // No specific scopes required
    }

    const request = context.switchToHttp().getRequest();
    const companyId = request.user?.companyId;

    // In a real API gateway flow, external apps pass their AppId via a header or token
    const appId = request.headers['x-app-id'];

    if (!appId || !companyId) {
      throw new ForbiddenException('Missing App ID or Company Context');
    }

    const installation = await this.prisma.runAsSystem(async (tx) =>
      tx.appInstallation.findUnique({
        where: { companyId_appId: { companyId, appId } },
      }),
    );

    if (!installation || installation.status !== 'ACTIVE') {
      throw new ForbiddenException('Application is not active or installed');
    }

    const grantedScopes: string[] =
      (installation.settings as any)?.grantedPermissions || [];

    // Check if the app has all required scopes
    const hasScopes = requiredScopes.every((scope) =>
      grantedScopes.includes(scope),
    );

    if (!hasScopes) {
      throw new ForbiddenException(
        `App requires scopes: ${requiredScopes.join(', ')}`,
      );
    }

    return true;
  }
}
