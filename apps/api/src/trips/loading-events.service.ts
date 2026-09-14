import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AuditService } from '../platform/audit/audit.service';
import type { AuthenticatedUser } from '../auth/decorators/get-user.decorator';
import { differenceInHours } from 'date-fns';

export interface CreateLoadingEventDto {
  type: 'LOAD' | 'UNLOAD';
  point: string;
  timeIn?: string;
  timeOut?: string;
  weightIn?: number;
  weightOut?: number;
  hamaliCost?: number;
}

@Injectable()
export class LoadingEventsService {
  constructor(
    private prisma: PrismaService,
    private auditService: AuditService,
  ) {}

  async getEvents(companyId: string, tripId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const events = await tx.loadingEvent.findMany({
        where: { tripId, companyId },
        orderBy: { createdAt: 'asc' },
      });
      return events;
    });
  }

  async addEvent(companyId: string, tripId: string, data: CreateLoadingEventDto, _user: AuthenticatedUser) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findFirst({
        where: { id: tripId, companyId },
      });

      if (!trip) {
        throw new NotFoundException('Trip not found');
      }

      let detentionHrs = 0;
      let detentionCharge = 0;
      const FREE_HOURS = 6;
      const RATE_PER_HOUR = 500;

      if (data.timeIn && data.timeOut) {
        const tIn = new Date(data.timeIn);
        const tOut = new Date(data.timeOut);
        const diffHrs = differenceInHours(tOut, tIn);
        if (diffHrs > FREE_HOURS) {
          detentionHrs = diffHrs - FREE_HOURS;
          detentionCharge = detentionHrs * RATE_PER_HOUR;
        }
      }

      const event = await tx.loadingEvent.create({
        data: {
          companyId,
          tripId,
          type: data.type,
          point: data.point,
          timeIn: data.timeIn ? new Date(data.timeIn) : null,
          timeOut: data.timeOut ? new Date(data.timeOut) : null,
          weightIn: data.weightIn,
          weightOut: data.weightOut,
          hamaliCost: data.hamaliCost || 0,
          detentionHrs,
          detentionCharge,
        },
      });

      // Update Trip Expense totals and create TripExpense records
      let additionalExpenses = 0;

      if (data.hamaliCost && data.hamaliCost > 0) {
        await tx.tripExpense.create({
          data: {
            companyId,
            tripId,
            category: 'MISC',
            amount: data.hamaliCost,
            note: `Hamali for ${data.type} at ${data.point}`,
          }
        });
        additionalExpenses += data.hamaliCost;
      }

      if (detentionCharge > 0) {
        await tx.tripExpense.create({
          data: {
            companyId,
            tripId,
            category: 'MISC',
            amount: detentionCharge,
            note: `Detention charge (${detentionHrs} hrs) for ${data.type} at ${data.point}`,
          }
        });
        additionalExpenses += detentionCharge;
      }

      if (additionalExpenses > 0) {
        await tx.trip.update({
          where: { id: trip.id },
          data: {
            otherExpenses: {
              increment: additionalExpenses
            }
          }
        });
      }

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'LoadingEvent',
          entityType: 'LoadingEvent',
          entityId: event.id,
          action: 'CREATE',
          details: { type: data.type, point: data.point },
          source: 'API',
        },
        null,
        tx,
      );

      return event;
    });
  }
}
