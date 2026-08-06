import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ABAC_KEY } from './abac.decorator';
import { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { AuditService } from '../../platform/audit/audit.service';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AbacGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly audit: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredAttributes = this.reflector.getAllAndOverride<
      Record<string, any>
    >(ABAC_KEY, [context.getHandler(), context.getClass()]);

    if (!requiredAttributes || Object.keys(requiredAttributes).length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user as AuthenticatedUser;

    if (!user) {
      throw new ForbiddenException('User is not authenticated');
    }

    if (user.roles?.includes('SUPER_ADMIN')) {
      return true;
    }

    // In a full implementation, you would fetch User properties, Company properties,
    // or even load attributes like load.value, load.region from the DB dynamically based on request params.
    // Here we do a simplified check against user's extended properties or company settings.

    // For demonstration, fetch user's company and check its region/department
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findUnique({
        where: { id: user.companyId },
        include: { tenantConfiguration: true },
      }),
    );

    const userMetadata = {}; // Usually fetched from user profile/attributes
    const companyMetadata =
      (company?.tenantConfiguration?.settings as Record<string, any>) || {};

    let isAuthorized = true;
    const missingAttributes: Record<string, any> = {};

    for (const [key, expectedValue] of Object.entries(requiredAttributes)) {
      const actualValue =
        (userMetadata as Record<string, any>)[key] || companyMetadata[key];
      if (actualValue !== expectedValue) {
        isAuthorized = false;
        missingAttributes[key] = {
          expected: expectedValue,
          actual: actualValue,
        };
      }
    }

    if (!isAuthorized) {
      await this.audit.logEvent({
        companyId: user.companyId,
        userId: user.userId,
        entity: 'Attribute',
        entityId: context.getHandler().name,
        action: 'DENY',
        details: { requiredAttributes, missingAttributes },
        source: 'IAM',
      });
      throw new ForbiddenException(`ABAC Policy Denied: Mismatched attributes`);
    }

    return true;
  }
}
