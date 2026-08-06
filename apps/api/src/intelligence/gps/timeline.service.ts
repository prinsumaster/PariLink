import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class TimelineService {
  private readonly logger = new Logger(TimelineService.name);

  constructor(private readonly prisma: PrismaService) {}

  async addEvent(
    tripId: string,
    companyId: string,
    eventName: string,
    metadata: any = {},
  ) {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId },
      }),
    );

    if (!trip || trip.companyId !== companyId) return;

    let timeline: any[] = [];
    if (trip.timeline && Array.isArray(trip.timeline)) {
      timeline = trip.timeline as any[];
    }

    timeline.push({
      event: eventName,
      timestamp: new Date().toISOString(),
      metadata,
    });

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.update({
        where: { id: tripId },
        data: { timeline },
      }),
    );

    this.logger.debug(`Timeline event ${eventName} added to trip ${tripId}`);
  }
}
