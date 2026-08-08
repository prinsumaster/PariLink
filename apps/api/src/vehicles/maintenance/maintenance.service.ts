import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class MaintenanceService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async createWorkshop(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const workshop = await tx.workshop.create({
        data: {
          companyId,
          name: data.name,
          location: data.location,
          type: data.type,
          vendorId: data.vendorId,
          contact: data.contact,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Maintenance',
          entityType: 'Workshop',
          entityId: workshop.id,
          action: 'CREATE',
          details: { name: workshop.name },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'MAINTENANCE_WORKSHOP',
        streamId: workshop.id,
        eventType: 'WorkshopCreated',
        payload: { name: workshop.name },
        userId,
      });

      return workshop;
    });
  }

  async getWorkshops(companyId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.workshop.findMany({ where: { companyId } }),
    );
  }

  async createMechanic(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const mechanic = await tx.mechanic.create({
        data: {
          companyId,
          workshopId: data.workshopId,
          name: data.name,
          phone: data.phone,
          skills: data.skills || [],
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Maintenance',
          entityType: 'Mechanic',
          entityId: mechanic.id,
          action: 'CREATE',
          details: { name: mechanic.name },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'MAINTENANCE_MECHANIC',
        streamId: mechanic.id,
        eventType: 'MechanicCreated',
        payload: { name: mechanic.name },
        userId,
      });

      return mechanic;
    });
  }

  async getMechanics(companyId: string, workshopId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (workshopId) where.workshopId = workshopId;
      return tx.mechanic.findMany({ where });
    });
  }

  async createJobCard(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const jobCard = await tx.jobCard.create({
        data: {
          companyId,
          vehicleId: data.vehicleId,
          workshopId: data.workshopId,
          mechanicId: data.mechanicId,
          issueReported: data.issueReported,
          status: 'OPEN',
        },
      });

      if (data.parts && data.parts.length > 0) {
        let totalCost = 0;
        const partsData = data.parts.map((p: any) => {
          const cost = p.quantity * p.unitCost;
          totalCost += cost;
          return {
            jobCardId: jobCard.id,
            partName: p.partName,
            quantity: p.quantity,
            unitCost: p.unitCost,
            totalCost: cost,
          };
        });

        await tx.jobCardPart.createMany({ data: partsData });
        await tx.jobCard.update({
          where: { id: jobCard.id },
          data: { totalCost },
        });
      }

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Maintenance',
          entityType: 'JobCard',
          entityId: jobCard.id,
          action: 'CREATE',
          details: { vehicleId: jobCard.vehicleId },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'MAINTENANCE_JOB_CARD',
        streamId: jobCard.id,
        eventType: 'JobCardCreated',
        payload: { vehicleId: jobCard.vehicleId },
        userId,
      });

      return jobCard;
    });
  }

  async getJobCards(companyId: string, vehicleId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (vehicleId) where.vehicleId = vehicleId;
      return tx.jobCard.findMany({
        where,
        include: { parts: true, mechanic: true, workshop: true },
      });
    });
  }

  async closeJobCard(
    companyId: string,
    jobCardId: string,
    data: any,
    userId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const updatedJobCard = await tx.jobCard.update({
        where: { id: jobCardId, companyId },
        data: {
          status: 'CLOSED',
          workDone: data.workDone,
          closedAt: new Date(),
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Maintenance',
          entityType: 'JobCard',
          entityId: jobCardId,
          action: 'CLOSE',
          details: { workDone: data.workDone },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'MAINTENANCE_JOB_CARD',
        streamId: jobCardId,
        eventType: 'JobCardClosed',
        payload: { workDone: data.workDone },
        userId,
      });

      return updatedJobCard;
    });
  }

  async createSchedule(companyId: string, data: any, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const schedule = await tx.maintenanceSchedule.create({
        data: {
          companyId,
          vehicleId: data.vehicleId,
          taskName: data.taskName,
          intervalDays: data.intervalDays,
          intervalKm: data.intervalKm,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Maintenance',
          entityType: 'MaintenanceSchedule',
          entityId: schedule.id,
          action: 'CREATE',
          details: { taskName: schedule.taskName },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'MAINTENANCE_SCHEDULE',
        streamId: schedule.id,
        eventType: 'ScheduleCreated',
        payload: { taskName: schedule.taskName },
        userId,
      });

      return schedule;
    });
  }

  async getSchedules(companyId: string, vehicleId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const where: any = { companyId };
      if (vehicleId) where.vehicleId = vehicleId;
      return tx.maintenanceSchedule.findMany({ where });
    });
  }
}
