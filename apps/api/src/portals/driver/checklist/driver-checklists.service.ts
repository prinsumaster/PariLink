import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { PrismaService } from '../../../prisma/prisma.service';

@Injectable()
export class DriverChecklistsService {
  private readonly logger = new Logger(DriverChecklistsService.name);

  constructor(private prisma: PrismaService) {}

  async submitChecklist(
    companyId: string,
    driverId: string,
    tripId: string,
    checklistData: any,
  ) {
    if (!driverId) throw new UnauthorizedException('Driver context missing');

    const trip = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.findUnique({
        where: { id: tripId, driverId },
      }),
    );

    if (!trip) {
      throw new UnauthorizedException('Trip not found or access denied');
    }

    // Merge new checklist data with existing checklist json array
    const existingChecklists = (trip.checklists as any[]) || [];
    existingChecklists.push({
      ...checklistData,
      submittedAt: new Date().toISOString(),
    });

    return await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.trip.update({
        where: { id: tripId },
        data: {
          checklists: existingChecklists,
        },
      }),
    );
  }
}
