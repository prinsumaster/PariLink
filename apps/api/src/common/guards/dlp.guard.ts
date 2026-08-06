import { AuditService } from '../../platform/audit/audit.service';
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class DlpGuard implements CanActivate {
  constructor(
    private readonly auditService: AuditService,
    private readonly prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.companyId) return true; // Handled by auth guard

    // Check for mass export behaviour
    const fiveMinutesAgo = new Date();
    fiveMinutesAgo.setMinutes(fiveMinutesAgo.getMinutes() - 5);

    const recentExports = await this.prisma.runAsSystem(async (tx) =>
      tx.auditLog.count({
        where: {
          companyId: user.companyId,
          userId: user.id,
          action: 'EXPORT',
          createdAt: {
            gte: fiveMinutesAgo,
          },
        },
      }),
    );

    if (recentExports > 3) {
      // Log DLP alert
      await this.prisma.runAsSystem(async (tx) =>
        this.auditService.logEvent(
          {
            companyId: user.companyId,
            userId: user.id,
            action: 'DLP_ALERT',
            entity: 'DataExport',
            entityId: 'Multiple',
            details: { reason: 'Mass export detected (>3 in 5m)' },
          },
          null,
          tx,
        ),
      );

      throw new HttpException(
        'Data Loss Prevention (DLP) triggered: Mass export detected. Account temporarily restricted.',
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    return true;
  }
}
