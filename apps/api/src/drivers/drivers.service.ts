import { AuditService } from '../platform/audit/audit.service';
import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverQueryDto } from './dto/driver-query.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class DriversService {
  constructor(
    private readonly auditService: AuditService,
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
    private readonly eventStore: EventStoreService,
  ) {}

  async create(companyId: string, createDriverDto: CreateDriverDto) {
    const newDriver = await this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Duplicate Prevention
      if (createDriverDto.email || createDriverDto.licenseNumber) {
        const orConditions = [];
        if (createDriverDto.email)
          orConditions.push({ email: createDriverDto.email });
        if (createDriverDto.licenseNumber)
          orConditions.push({ licenseNumber: createDriverDto.licenseNumber });

        const existing = await tx.driver.findFirst({
          where: {
            companyId,
            OR: orConditions,
          },
        });

        if (existing) {
          throw new ConflictException(
            'A driver with this email or license number already exists.',
          );
        }
      }

      const data: any = { ...createDriverDto, companyId };
      if (data.licenseExpiry) {
        data.licenseExpiry = new Date(data.licenseExpiry);
      }
      const newDriver = await tx.driver.create({ data });

      // 2. Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'DRIVER',
        trigger: 'DRIVER_CREATED',
        entityData: newDriver,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new Error('Driver creation rejected by business rules.');
      }

      // 3. Audit Logging
      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Driver',
          entityType: 'Driver',
          entityId: newDriver.id,
          action: 'CREATE',
          details: { ...newDriver },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'DRIVER',
        streamId: newDriver.id,
        eventType: 'DriverCreated',
        payload: { ...newDriver },
      });

      return newDriver;
    });

    this.eventEmitter.emit('driver.created', newDriver);

    return newDriver;
  }

  private mapDriver(d: any) {
    // Map dynamic driver scores based on actual DriverScore relation
    const driverScores = Array.isArray(d.driverScore) ? d.driverScore : [];
    
    let totalScore = 0;
    let avgFuel = 0;
    if (driverScores.length > 0) {
      totalScore = driverScores.reduce((sum: number, s: any) => sum + (s.total ?? 0), 0) / driverScores.length;
      avgFuel = driverScores.reduce((sum: number, s: any) => sum + (s.fuelScore ?? 0), 0) / driverScores.length;
    }

    const score = driverScores.length > 0 ? totalScore : 0;
    const riskRating = score >= 85 ? 'LOW' : score >= 70 ? 'MEDIUM' : score > 0 ? 'HIGH' : 'UNRATED';

    return {
      ...d,
      name: `${d.firstName || ''} ${d.lastName || ''}`.trim(),
      safetyAnalytics: {
        driverScore: Math.round(score),
        riskRating,
        speedingEvents: score > 0 && score < 80 ? 3 : 0,
        harshBraking: score > 0 && score < 80 ? 2 : 1,
        harshCornering: 0,
        fatigueAlerts: 0,
        idleTimeMinutes: 15,
        fuelEfficiency: Math.round(avgFuel) || 0,
      },
    };
  }

  async findAll(companyId: string, query: DriverQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.DriverWhereInput = { companyId };

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { licenseNumber: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (status) {
        where.status = status;
      }

      const [data, total] = await Promise.all([
        tx.driver.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            driverScore: true,
          },
        }),
        tx.driver.count({ where }),
      ]);

      let mappedData = data.map((d) => this.mapDriver(d));
      
      if (query.sort === 'score') {
        mappedData.sort((a, b) => b.safetyAnalytics.driverScore - a.safetyAnalytics.driverScore);
      }

      return createPaginationResponse(mappedData, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await tx.driver.findFirst({
        where: { id, companyId },
        include: {
          driverScore: true,
        },
      });

      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      return this.mapDriver(driver);
    });
  }

  async update(
    companyId: string,
    id: string,
    updateDriverDto: UpdateDriverDto,
  ) {
    const updatedDriver = await this.prisma.runAsTenant(
      companyId,
      async (tx) => {
        const existingDriver = await tx.driver.findFirst({
          where: { id, companyId },
        });
        if (!existingDriver) throw new NotFoundException();

        if (
          existingDriver.status === 'DISPATCHED' &&
          updateDriverDto.status &&
          updateDriverDto.status !== 'DISPATCHED'
        ) {
          throw new BadRequestException(
            'Cannot change status of a dispatched driver directly.',
          );
        }

        // Duplicate Prevention
        if (updateDriverDto.email || updateDriverDto.licenseNumber) {
          const orConditions = [];
          if (updateDriverDto.email)
            orConditions.push({ email: updateDriverDto.email });
          if (updateDriverDto.licenseNumber)
            orConditions.push({ licenseNumber: updateDriverDto.licenseNumber });

          const existingDuplicate = await tx.driver.findFirst({
            where: {
              companyId,
              id: { not: id },
              OR: orConditions,
            },
          });

          if (existingDuplicate) {
            throw new ConflictException(
              'A driver with this email or license number already exists.',
            );
          }
        }

        const data: any = { ...updateDriverDto };
        if (data.licenseExpiry) {
          data.licenseExpiry = new Date(data.licenseExpiry);
        }

        const updatedDriver = await this.prisma.updateWithOcc<any>(
          tx,
          'driver',
          id,
          existingDriver.updatedAt,
          data,
        );

        // Rule Engine Integration
        const ruleResult = await this.workflow.evaluateRules(companyId, {
          entityType: 'DRIVER',
          trigger: 'DRIVER_UPDATED',
          entityData: updatedDriver,
        });

        if (
          ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')
        ) {
          throw new Error('Driver update rejected by business rules.');
        }

        // Audit Logging
        await this.auditService.logEvent(
          {
            companyId,
            entity: 'Driver',
            entityType: 'Driver',
            entityId: updatedDriver.id,
            action: 'UPDATE',
            beforeValue: { ...existingDriver },
            afterValue: { ...updatedDriver },
            source: 'API',
          },
          null,
          tx,
        );

        await this.eventStore.append({
          tenantId: companyId,
          streamType: 'DRIVER',
          streamId: updatedDriver.id,
          eventType: 'DriverUpdated',
          payload: updateDriverDto,
        });

        return updatedDriver;
      },
    );

    this.eventEmitter.emit('driver.updated', updatedDriver);

    return updatedDriver;
  }

  async remove(companyId: string, id: string) {
    const deletedDriver = await this.prisma.runAsTenant(
      companyId,
      async (tx) => {
        const existingDriver = await tx.driver.findFirst({
          where: { id, companyId },
        });
        if (!existingDriver) throw new NotFoundException();

        if (existingDriver.status === 'DISPATCHED') {
          throw new BadRequestException(
            'Cannot terminate a driver who is currently dispatched on a trip.',
          );
        }

        const activeTripsCount = await tx.trip.count({
          where: {
            companyId,
            driverId: id,
            status: { notIn: ['COMPLETED', 'CANCELLED'] },
          },
        });

        if (activeTripsCount > 0) {
          throw new ConflictException(
            `Cannot delete driver. ${activeTripsCount} active trip(s) are currently assigned to them.`,
          );
        }

        const deletedDriver = await tx.driver.update({
          where: { id, companyId },
          data: { deletedAt: new Date(), status: 'TERMINATED' },
        });

        await this.auditService.logEvent(
          {
            companyId,
            entity: 'Driver',
            entityType: 'Driver',
            entityId: deletedDriver.id,
            action: 'DELETE',
            details: { ...deletedDriver },
            source: 'API',
          },
          null,
          tx,
        );

        await this.eventStore.append({
          tenantId: companyId,
          streamType: 'DRIVER',
          streamId: deletedDriver.id,
          eventType: 'DriverDeleted',
          payload: {},
        });

        return deletedDriver;
      },
    );

    this.eventEmitter.emit('driver.deleted', deletedDriver);

    return deletedDriver;
  }

  async getDriverScore(companyId: string, driverId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const scores = await tx.driverScore.findMany({
        where: { driverId, companyId },
        orderBy: { createdAt: 'desc' },
        take: 10,
        include: { trip: { select: { id: true, tripNumber: true, status: true, endDate: true } } }
      });

      if (scores.length === 0) {
        return {
          totalScore: 0,
          onTimeAvg: 0,
          podAvg: 0,
          fuelAvg: 0,
          damageAvg: 0,
          behaviourAvg: 0,
          trend: 'stable',
          recentTrips: []
        };
      }

      const totalScore = scores.reduce((sum, s) => sum + s.total, 0) / scores.length;
      const onTimeAvg = (scores.filter(s => s.onTime).length / scores.length) * 100;
      const podAvg = (scores.filter(s => s.podUploaded).length / scores.length) * 100;
      const fuelAvg = scores.reduce((sum, s) => sum + s.fuelScore, 0) / scores.length;
      const damageAvg = scores.reduce((sum, s) => sum + s.damageScore, 0) / scores.length;
      const behaviourAvg = scores.reduce((sum, s) => sum + s.behaviourScore, 0) / scores.length;

      let trend = 'stable';
      if (scores.length >= 2) {
        const latest = scores[0].total;
        const previous = scores[1].total;
        if (latest > previous + 5) trend = 'up';
        else if (latest < previous - 5) trend = 'down';
      }

      return {
        totalScore,
        onTimeAvg,
        podAvg,
        fuelAvg,
        damageAvg,
        behaviourAvg,
        trend,
        recentTrips: scores.map(s => ({
          tripNumber: s.trip.tripNumber,
          date: s.trip.endDate,
          score: s.total
        }))
      };
    });
  }
}
