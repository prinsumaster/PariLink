import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';

@Injectable()
export class TripDesksService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getDesks(companyId: string, tripId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findUnique({ where: { id: tripId, companyId } });
      if (!trip) throw new NotFoundException('Trip not found');
      
      const desks = await tx.tripDesk.findMany({
        where: { tripId, companyId },
        orderBy: { createdAt: 'asc' },
      });
      return desks;
    });
  }

  async completeDesk(companyId: string, tripId: string, desk: string, user: AuthenticatedUser, notes?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const tripDesk = await tx.tripDesk.findFirst({
        where: { tripId, companyId, desk: desk.toUpperCase() },
      });

      if (!tripDesk) {
        throw new NotFoundException(`Desk ${desk} not found for this trip`);
      }

      if (tripDesk.status === 'DONE') {
        throw new BadRequestException(`Desk ${desk} is already completed`);
      }

      const updated = await tx.tripDesk.update({
        where: { id: tripDesk.id },
        data: {
          status: 'DONE',
          completedBy: user.email || user.id,
          completedAt: new Date(),
          notes,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'TripDesk',
          entityType: 'TripDesk',
          entityId: updated.id,
          action: 'UPDATE',
          details: { status: 'DONE', desk },
          source: 'API',
        },
        null,
        tx,
      );

      return updated;
    });
  }

  async getMyPendingDesks(user: AuthenticatedUser) {
    const roles = user.roles || [];
    const targetDesks: string[] = [];

    if (roles.includes('SUPER_ADMIN') || roles.includes('ORG_ADMIN')) {
      targetDesks.push('DISPATCH', 'DIESEL', 'FASTAG', 'WORKSHOP', 'DOCS');
    } else {
      if (roles.includes('DISPATCHER')) targetDesks.push('DISPATCH', 'DOCS');
      if (roles.includes('OPERATIONS')) targetDesks.push('DIESEL', 'FASTAG');
      if (roles.includes('WORKSHOP_MANAGER')) targetDesks.push('WORKSHOP');
    }

    if (targetDesks.length === 0) {
      return [];
    }

    return this.prisma.runAsTenant(user.companyId, async (tx) => {
      const pendingDesks = await tx.tripDesk.findMany({
        where: {
          companyId: user.companyId,
          status: 'PENDING',
          desk: { in: targetDesks },
          trip: {
            status: { notIn: ['COMPLETED', 'CANCELLED'] },
          },
        },
        include: {
          trip: {
            include: {
              driver: true,
              vehicle: true,
            }
          }
        },
        orderBy: { trip: { startDate: 'asc' } },
      });

      return pendingDesks;
    });
  }
}
