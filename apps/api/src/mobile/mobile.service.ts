import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateTripStatusDto } from './dto/update-trip-status.dto';
import { UpdateLoadStatusDto } from './dto/update-load-status.dto';
import { LocationPingDto } from './dto/location-ping.dto';

@Injectable()
export class MobileService {
  private readonly logger = new Logger(MobileService.name);

  constructor(private prisma: PrismaService) {}

  private async getDriverByUserId(tx: any, userId: string) {
    const driver = await tx.driver.findUnique({
      where: { userId },
    });
    if (!driver) {
      throw new UnauthorizedException(
        'Authenticated user is not registered as a driver',
      );
    }
    return driver;
  }

  async getActiveTrip(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await this.getDriverByUserId(tx, userId);

      const activeTrip = await tx.trip.findFirst({
        where: {
          driverId: driver.id,
          status: { in: ['DISPATCHED', 'IN_PROGRESS'] },
        },
        include: {
          vehicle: true,
          loads: {
            include: { customer: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      if (!activeTrip) {
        throw new NotFoundException('No active trips assigned to this driver');
      }

      return activeTrip;
    });
  }

  async updateTripStatus(
    companyId: string,
    userId: string,
    tripId: string,
    dto: UpdateTripStatusDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await this.getDriverByUserId(tx, userId);

      const trip = await tx.trip.findFirst({
        where: { id: tripId, driverId: driver.id },
      });

      if (!trip) {
        throw new NotFoundException(
          'Trip not found or not assigned to this driver',
        );
      }

      const updatedTrip = await tx.trip.update({
        where: { id: tripId },
        data: { status: dto.status },
        include: { vehicle: true, loads: true },
      });

      if (dto.status === 'COMPLETED') {
        await tx.load.updateMany({
          where: { tripId, companyId, status: 'IN_TRANSIT' },
          data: { status: 'DELIVERED' },
        });
      }

      if (dto.status === 'IN_PROGRESS') {
        await tx.load.updateMany({
          where: { tripId, companyId, status: 'ASSIGNED' },
          data: { status: 'IN_TRANSIT' },
        });
      }

      return updatedTrip;
    });
  }

  async updateLoadStatus(
    companyId: string,
    userId: string,
    loadId: string,
    dto: UpdateLoadStatusDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await this.getDriverByUserId(tx, userId);

      const load = await tx.load.findFirst({
        where: {
          id: loadId,
          trip: { driverId: driver.id },
        },
        include: { trip: true },
      });

      if (!load) {
        throw new NotFoundException(
          'Load not found or not assigned to this driver',
        );
      }

      return tx.load.update({
        where: { id: loadId },
        data: { status: dto.status },
      });
    });
  }

  async recordLocation(
    companyId: string,
    userId: string,
    dto: LocationPingDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await this.getDriverByUserId(tx, userId);

      const trip = await tx.trip.findFirst({
        where: { id: dto.tripId, driverId: driver.id },
      });

      if (!trip) {
        throw new BadRequestException('Invalid tripId for location ping');
      }

      return tx.locationHistory.create({
        data: {
          companyId,
          tripId: dto.tripId,
          driverId: driver.id,
          latitude: dto.latitude,
          longitude: dto.longitude,
          speed: dto.speed,
          heading: dto.heading,
          accuracy: dto.accuracy,
        },
      });
    });
  }

  async processOfflineQueue(
    companyId: string,
    userId: string,
    queueData: any[],
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Basic conflict resolution / queue processor
      // Loops through queued actions (e.g., location pings, status updates) and processes them sequentially
      this.logger.log(
        `Processing offline queue of ${queueData.length} items for driver ${userId}`,
      );
      let processed = 0;
      let failed = 0;

      for (const item of queueData) {
        try {
          if (item.action === 'UPDATE_LOAD_STATUS') {
            await this.updateLoadStatus(companyId, userId, item.loadId, {
              status: item.status,
            });
          } else if (item.action === 'UPDATE_TRIP_STATUS') {
            await this.updateTripStatus(companyId, userId, item.tripId, {
              status: item.status,
            });
          }
          // Further actions like expenses, fuel could be added here
          processed++;
        } catch (e) {
          const errorMessage = e instanceof Error ? e.message : String(e);
          this.logger.error(
            `Offline sync conflict/error for action ${item.action}: ${errorMessage}`,
          );
          failed++;
        }
      }

      return { success: true, processed, failed };
    });
  }

  async uploadDocument(
    companyId: string,
    userId: string,
    type: string,
    file: Express.Multer.File,
    referenceId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fileUrl = `/uploads/${file.filename}`;

      // We will link it to a generic Document table for Mobile Uploads
      return tx.document.create({
        data: {
          companyId,
          loadId: type === 'POD' || type === 'SIGNATURE' ? referenceId : null,
          type: type.toUpperCase(), // POD, FUEL, EXPENSE, SIGNATURE
          fileUrl,
          fileName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          uploadedById: userId,
        },
      });
    });
  }
}
