import {
  Injectable,
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class EWayBillGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();

    // We only care if the action is dispatching the trip (changing status to IN_TRANSIT)
    if (
      request.method !== 'PATCH' ||
      !request.body.status ||
      request.body.status !== 'IN_TRANSIT'
    ) {
      return true;
    }

    const loadId = request.params.id;
    const companyId = request.user.companyId;

    const invoice = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.invoice.findFirst({
        where: { loadId, companyId },
      }),
    );

    if (!invoice) {
      throw new HttpException(
        'Trip cannot start without an attached Invoice.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    const eWayBillNumber = (invoice as any).eWayBillNumber;
    const eWayBillExpiry = (invoice as any).eWayBillExpiry;

    if (!eWayBillNumber || !eWayBillExpiry) {
      throw new HttpException(
        'Trip cannot start: E-Way Bill Number is missing.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    if (new Date(eWayBillExpiry) < new Date()) {
      throw new HttpException(
        'Trip cannot start: E-Way Bill has expired.',
        HttpStatus.PRECONDITION_FAILED,
      );
    }

    return true; // E-Way bill is valid and active.
  }
}
