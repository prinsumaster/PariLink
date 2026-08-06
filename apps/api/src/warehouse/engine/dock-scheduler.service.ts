import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { EventStoreService } from '../../platform/digital-twin/event-store.service';

@Injectable()
export class DockSchedulerService {
  private readonly logger = new Logger(DockSchedulerService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventStore: EventStoreService,
  ) {}

  /**
   * Schedule a dock appointment for a Load
   */
  async scheduleAppointment(
    companyId: string,
    dockId: string,
    loadId: string,
    type: 'INBOUND' | 'OUTBOUND',
    start: Date,
    end: Date,
    userId: string,
  ) {
    // Check for conflicts
    const conflict = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dockAppointment.findFirst({
        where: {
          dockId,
          status: { notIn: ['COMPLETED', 'CANCELLED'] },
          OR: [{ scheduledStart: { lte: end }, scheduledEnd: { gte: start } }],
        },
      }),
    );

    if (conflict) {
      throw new BadRequestException('Dock scheduling conflict detected');
    }

    const appointment = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dockAppointment.create({
        data: {
          dockId,
          loadId,
          type,
          scheduledStart: start,
          scheduledEnd: end,
          status: 'SCHEDULED',
        },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'DOCK',
      streamId: dockId,
      eventType: 'DockAssigned',
      payload: { appointmentId: appointment.id, loadId, start, end },
      userId,
    });

    return appointment;
  }

  async markAppointmentArrived(
    companyId: string,
    appointmentId: string,
    userId: string,
  ) {
    const appt = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dockAppointment.update({
        where: { id: appointmentId },
        data: { status: 'AT_DOCK', actualStart: new Date() },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'DOCK',
      streamId: appt.dockId,
      eventType: 'TruckArrived',
      payload: { appointmentId, loadId: appt.loadId },
      userId,
    });

    return appt;
  }

  async completeAppointment(
    companyId: string,
    appointmentId: string,
    userId: string,
  ) {
    const appt = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.dockAppointment.update({
        where: { id: appointmentId },
        data: { status: 'COMPLETED', actualEnd: new Date() },
      }),
    );

    await this.eventStore.append({
      tenantId: companyId,
      streamType: 'DOCK',
      streamId: appt.dockId,
      eventType: 'TruckDeparted',
      payload: { appointmentId, loadId: appt.loadId },
      userId,
    });

    return appt;
  }
}
