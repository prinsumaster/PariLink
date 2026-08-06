import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class RequireApprovalGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiresApproval = this.reflector.getAllAndOverride<boolean>(
      'requiresApproval',
      [context.getHandler(), context.getClass()],
    );

    if (!requiresApproval) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id || !user.companyId) {
      throw new ForbiddenException(
        'Strict Authorization Required. No user context found.',
      );
    }

    const payload = request.body || {};
    const resourceId = request.params.id || 'bulk';
    const action = request.method;
    const resourceType = request.url.split('/')[2] || 'unknown';

    // 1. Create the Maker/Checker Approval Request
    await this.prisma.runAsSystem(async (tx) =>
      tx.approvalRequest.create({
        data: {
          companyId: user.companyId,
          requestedBy: user.id,
          entityType: resourceType,
          entityId: resourceId,
          executionId: 'mock-execution-id', // Mocked execution ID for approval request
          status: 'PENDING',
        },
      }),
    );

    // 2. Halt the HTTP request and return 202 Accepted.
    throw new HttpException(
      {
        status: HttpStatus.ACCEPTED,
        message:
          'Mutation requires approval. Approval request submitted to Finance Manager.',
        approvalRequired: true,
      },
      HttpStatus.ACCEPTED,
    );
  }
}
