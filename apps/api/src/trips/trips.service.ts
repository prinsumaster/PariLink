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
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTripDto } from './dto/create-trip.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { UpdateTripDto } from './dto/update-trip.dto';
import { TripQueryDto } from './dto/trip-query.dto';
import { EventEmitter2 } from '@nestjs/event-emitter';
import * as crypto from 'crypto';

@Injectable()
export class TripsService {
  constructor(
    private readonly auditService: AuditService,

    private prisma: PrismaService,
    private eventEmitter: EventEmitter2,
    private workflow: WorkflowService,
  ) {}

  async create(companyId: string, createTripDto: CreateTripDto) {
    const trip = await this.prisma.runAsTenant(companyId, async (tx) => {
      const data: any = { ...createTripDto, companyId };
      if (data.startDate) data.startDate = new Date(data.startDate);
      if (data.endDate) data.endDate = new Date(data.endDate);
      if (data.eta) data.eta = new Date(data.eta);

      if (!data.tripNumber) {
        data.tripNumber = `TRP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      } else {
        const existingTripNum = await tx.trip.findFirst({
          where: { tripNumber: data.tripNumber },
        });
        if (existingTripNum) {
          throw new ConflictException(
            `Trip number ${data.tripNumber} already exists.`,
          );
        }
      }

      const trip = await tx.trip.create({
        data,
        include: { driver: true, vehicle: true, trailer: true, loads: true },
      });

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'TRIP',
        trigger: 'TRIP_CREATED',
        entityData: trip,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new Error('Trip creation rejected by business rules.');
      }

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Trip',
          entityType: 'Trip',
          entityId: trip.id,
          action: 'CREATE',
          details: { tripNumber: trip.tripNumber, status: trip.status },
          source: 'API',
        },
        null,
        tx,
      );

      return trip;
    });

    this.eventEmitter.emit('trip.created', {
      companyId,
      tripId: trip.id,
      tripNumber: trip.tripNumber,
      status: trip.status,
    });

    return trip;
  }

  async findAll(companyId: string, query: TripQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const {
        page = 1,
        limit = 10,
        search,
        status,
        driverId,
        vehicleId,
      } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.TripWhereInput = { companyId };

      if (search) {
        where.OR = [
          { tripNumber: { contains: search, mode: 'insensitive' } },
          { driver: { firstName: { contains: search, mode: 'insensitive' } } },
          { driver: { lastName: { contains: search, mode: 'insensitive' } } },
          {
            vehicle: {
              licensePlate: { contains: search, mode: 'insensitive' },
            },
          },
        ];
      }

      if (status) where.status = status;
      if (driverId) where.driverId = driverId;
      if (vehicleId) where.vehicleId = vehicleId;

      const [data, total] = await Promise.all([
        tx.trip.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            driver: true,
            vehicle: true,
            trailer: true,
            loads: { include: { customer: true } },
          },
        }),
        tx.trip.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trip = await tx.trip.findFirst({
        where: { id, companyId },
        include: {
          driver: true,
          vehicle: true,
          trailer: true,
          loads: { include: { customer: true } },
        },
      });

      if (!trip) {
        throw new NotFoundException(`Trip with ID ${id} not found`);
      }
      return trip;
    });
  }

  async update(companyId: string, id: string, updateTripDto: UpdateTripDto) {
    const result = await this.prisma.runAsTenant(companyId, async (tx) => {
      const existingTrip = await tx.trip.findFirst({
        where: { id, companyId },
      });
      if (!existingTrip) throw new NotFoundException();

      const data: any = { ...updateTripDto };
      if (data.startDate) data.startDate = new Date(data.startDate);
      if (data.endDate) data.endDate = new Date(data.endDate);
      if (data.eta) data.eta = new Date(data.eta);

      if (data.tripNumber && data.tripNumber !== existingTrip.tripNumber) {
        const duplicate = await tx.trip.findFirst({
          where: { tripNumber: data.tripNumber },
        });
        if (duplicate) {
          throw new ConflictException(
            `Trip number ${data.tripNumber} already exists.`,
          );
        }
      }

      const updatedTrip = await this.prisma.updateWithOcc<any>(
        tx,
        'trip',
        id,
        existingTrip.updatedAt,
        data,
        { driver: true, vehicle: true, trailer: true, loads: true },
      );

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Trip',
          entityType: 'Trip',
          entityId: updatedTrip.id,
          action: 'UPDATE',
          beforeValue: { status: existingTrip.status },
          afterValue: { status: updatedTrip.status },
          source: 'API',
        },
        null,
        tx,
      );

      return { updatedTrip, existingStatus: existingTrip.status };
    });

    if (
      result.existingStatus !== 'IN_TRANSIT' &&
      result.updatedTrip.status === 'IN_TRANSIT'
    ) {
      this.eventEmitter.emit('trip.started', result.updatedTrip);
    } else if (
      result.existingStatus !== 'COMPLETED' &&
      result.updatedTrip.status === 'COMPLETED'
    ) {
      this.eventEmitter.emit('trip.completed', result.updatedTrip);
    } else {
      this.eventEmitter.emit('trip.updated', result.updatedTrip);
    }

    return result.updatedTrip;
  }

  async assignLoads(companyId: string, id: string, loadIds: string[]) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingTrip = await tx.trip.findFirst({
        where: { id },
      });
      if (!existingTrip) throw new NotFoundException();

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'TRIP',
        trigger: 'ASSIGN_LOADS',
        entityData: { trip: existingTrip, loadIds },
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new Error('Load assignment rejected by business rules.');
      }

      // Verify that all loads are unassigned before assigning them
      const availableLoads = await tx.load.findMany({
        where: {
          id: { in: loadIds },
          companyId,
          tripId: null,
          status: 'PENDING',
        },
      });

      if (availableLoads.length !== loadIds.length) {
        throw new ConflictException(
          'One or more loads are already assigned to another trip or do not exist.',
        );
      }

      // Assign tripId to each load
      await tx.load.updateMany({
        where: { id: { in: loadIds }, companyId },
        data: { tripId: id, status: 'ASSIGNED' },
      });

      const updatedTrip = await tx.trip.findFirst({
        where: { id },
        include: { loads: true },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Trip',
          entityType: 'Trip',
          entityId: id,
          action: 'ASSIGN_LOADS',
          details: { loadIds },
          source: 'API',
        },
        null,
        tx,
      );

      return updatedTrip;
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingTrip = await tx.trip.findFirst({
        where: { id },
      });
      if (!existingTrip) throw new NotFoundException();

      // Unassign loads when trip is cancelled/removed
      await tx.load.updateMany({
        where: { tripId: id, companyId },
        data: { tripId: null, status: 'PENDING' },
      });

      const deletedTrip = await tx.trip.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'CANCELLED' },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Trip',
          entityType: 'Trip',
          entityId: deletedTrip.id,
          action: 'DELETE',
          details: { tripNumber: deletedTrip.tripNumber },
          source: 'API',
        },
        null,
        tx,
      );

      return deletedTrip;
    });
  }
}
