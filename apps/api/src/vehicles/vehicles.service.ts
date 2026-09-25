import { AuditService } from '../platform/audit/audit.service';
import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import {
  Injectable,
  Inject,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import type { Cache } from 'cache-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { VehicleQueryDto } from './dto/vehicle-query.dto';

import { WorkflowService } from '../workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class VehiclesService {


  constructor(
    private readonly auditService: AuditService,
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
    private readonly eventStore: EventStoreService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(companyId: string, createVehicleDto: CreateVehicleDto) {
    const newVehicle = await this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Duplicate Prevention
      if (createVehicleDto.vin || createVehicleDto.licensePlate) {
        const orConditions = [];
        if (createVehicleDto.vin)
          orConditions.push({ vin: createVehicleDto.vin });
        if (createVehicleDto.licensePlate)
          orConditions.push({ licensePlate: createVehicleDto.licensePlate });

        const existing = await tx.vehicle.findFirst({
          where: {
            companyId,
            OR: orConditions,
          },
        });

        if (existing) {
          throw new ConflictException(
            'A vehicle with this VIN or license plate already exists.',
          );
        }
      }

      const newVehicle = await tx.vehicle.create({
        data: {
          ...createVehicleDto,
          companyId,
        },
      });

      // 2. Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'VEHICLE',
        trigger: 'VEHICLE_CREATED',
        entityData: newVehicle,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new BadRequestException('Vehicle creation rejected by business rules.');
      }

      // 3. Audit Logging
      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Vehicle',
          entityType: 'Vehicle',
          entityId: newVehicle.id,
          action: 'CREATE',
          details: { ...newVehicle },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'VEHICLE',
        streamId: newVehicle.id,
        eventType: 'VehicleCreated',
        payload: { ...newVehicle },
      });

      return newVehicle;
    });

    this.eventEmitter.emit('vehicle.created', newVehicle);

    return newVehicle;
  }

  private mapVehicle(v: any) {
    const latestLoc = v.VehicleLocation?.[0];
    const latestTelem = v.VehicleTelemetry?.[0];

    const maintenanceHistory = (v.WorkOrder || []).map((wo: any) => ({
      id: wo.id,
      title: wo.type === 'BREAKDOWN' ? 'Emergency Repair' : 'Preventive Maintenance',
      description: wo.description || `${wo.type} service`,
      scheduledDate: wo.scheduledDate?.toISOString?.() || wo.scheduledDate,
      completedDate: wo.completedDate?.toISOString?.() || wo.completedDate,
      status: wo.status === 'COMPLETED' ? 'COMPLETED' : 'SCHEDULED',
      cost: wo.totalCost || 0,
      odometerReading: latestTelem?.odometer || latestLoc?.odometer || 350000,
    }));

    const documents = (v.permits || []).map((p: any) => ({
      id: p.id,
      type: p.permitType || 'PERMIT_NATIONAL',
      documentNumber: p.permitNumber,
      issuedDate: p.issuedDate?.toISOString?.() || p.issuedDate,
      expiryDate: p.expiryDate?.toISOString?.() || p.expiryDate,
      isExpiringSoon: false,
      isExpired: false,
    }));

    return {
      ...v,
      registrationNumber: v.licensePlate || v.registrationNumber,
      capacity: v.capacityWeight || v.capacity,
      odometer: latestTelem?.odometer ?? latestLoc?.odometer ?? 350000,
      engineHours: latestTelem?.engineHours ?? latestLoc?.engineHours ?? 4500,
      fuelLevel: latestTelem?.fuelLevel ?? latestLoc?.fuel ?? 75,
      batteryStatus: (latestTelem?.batteryVolts && latestTelem.batteryVolts < 11.5) ? 'CRITICAL' : 'GOOD',
      gpsStatus: latestLoc ? 'ONLINE' : 'OFFLINE',
      location: latestLoc ? {
        lat: latestLoc.latitude,
        lng: latestLoc.longitude,
        heading: latestLoc.heading ?? 0,
        speed: latestLoc.speed ?? 0,
        lastUpdated: latestLoc.gpsTimestamp ? new Date(latestLoc.gpsTimestamp).toISOString() : new Date().toISOString(),
      } : undefined,
      maintenanceHistory,
      documents,
    };
  }

  async findAll(companyId: string, query: VehicleQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, type, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.VehicleWhereInput = { companyId };

      if (search) {
        where.OR = [
          { licensePlate: { contains: search, mode: 'insensitive' } },
          { vin: { contains: search, mode: 'insensitive' } },
          { make: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (type) {
        where.type = type;
      }

      if (status) {
        where.status = status;
      }

      const [data, total] = await Promise.all([
        tx.vehicle.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            VehicleLocation: { orderBy: { gpsTimestamp: 'desc' }, take: 1 },
            VehicleTelemetry: { orderBy: { timestamp: 'desc' }, take: 1 },
            permits: true,
            MaintenanceJob: true,
          },
        }),
        tx.vehicle.count({ where }),
      ]);

      const mappedData = data.map((v) => this.mapVehicle(v));

      return createPaginationResponse(mappedData, total, page, limit);
    });
  }

  async getMileageTrend(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fuelEntries = await tx.fuelEntry.findMany({
        where: { vehicleId: id, companyId },
        orderBy: { filledAt: 'desc' },
        take: 10,
        include: { trip: true }
      });

      const trend = fuelEntries.map(entry => {
        const distance = entry.trip?.actualDistance || entry.trip?.estimatedDistance || 1000;
        const actualMileage = entry.litres > 0 ? distance / entry.litres : 0;
        const expectedMileage = 4.0;
        return {
          date: entry.filledAt,
          actualKmpl: Number(actualMileage.toFixed(2)),
          expectedKmpl: expectedMileage,
          variancePct: entry.variancePct
        };
      });

      return trend.reverse();
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vehicle = await tx.vehicle.findFirst({
        where: { id, companyId },
        include: {
          VehicleLocation: { orderBy: { gpsTimestamp: 'desc' }, take: 1 },
          VehicleTelemetry: { orderBy: { timestamp: 'desc' }, take: 1 },
          permits: true,
          MaintenanceJob: true,
        },
      });

      if (!vehicle) {
        throw new NotFoundException(`Vehicle with ID ${id} not found`);
      }
      return this.mapVehicle(vehicle);
    });
  }

  async update(
    companyId: string,
    id: string,
    updateVehicleDto: UpdateVehicleDto,
  ) {
    const updatedVehicle = await this.prisma.runAsTenant(
      companyId,
      async (tx) => {
        const existingVehicle = await tx.vehicle.findFirst({
          where: { id, companyId },
        });
        if (!existingVehicle) throw new NotFoundException();

        // Duplicate Prevention
        if (updateVehicleDto.vin || updateVehicleDto.licensePlate) {
          const orConditions = [];
          if (updateVehicleDto.vin)
            orConditions.push({ vin: updateVehicleDto.vin });
          if (updateVehicleDto.licensePlate)
            orConditions.push({ licensePlate: updateVehicleDto.licensePlate });

          const existingDuplicate = await tx.vehicle.findFirst({
            where: {
              companyId,
              id: { not: id },
              OR: orConditions,
            },
          });

          if (existingDuplicate) {
            throw new ConflictException(
              'A vehicle with this VIN or license plate already exists.',
            );
          }
        }

        const updatedVehicle = await this.prisma.updateWithOcc<any>(
          tx,
          'vehicle',
          id,
          existingVehicle.updatedAt,
          updateVehicleDto,
        );

        // Rule Engine Integration
        const ruleResult = await this.workflow.evaluateRules(companyId, {
          entityType: 'VEHICLE',
          trigger: 'VEHICLE_UPDATED',
          entityData: updatedVehicle,
        });

        if (
          ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')
        ) {
          throw new BadRequestException('Vehicle update rejected by business rules.');
        }

        // Audit Logging
        await this.auditService.logEvent(
          {
            companyId,
            entity: 'Vehicle',
            entityType: 'Vehicle',
            entityId: updatedVehicle.id,
            action: 'UPDATE',
            beforeValue: { ...existingVehicle },
            afterValue: { ...updatedVehicle },
            source: 'API',
          },
          null,
          tx,
        );

        await this.eventStore.append({
          tenantId: companyId,
          streamType: 'VEHICLE',
          streamId: updatedVehicle.id,
          eventType: 'VehicleUpdated',
          payload: updateVehicleDto,
        });

        return updatedVehicle;
      },
    );

    this.eventEmitter.emit('vehicle.updated', updatedVehicle);

    return updatedVehicle;
  }

  async remove(companyId: string, id: string) {
    const deletedVehicle = await this.prisma.runAsTenant(
      companyId,
      async (tx) => {
        const existingVehicle = await tx.vehicle.findFirst({
          where: { id, companyId },
        });
        if (!existingVehicle) throw new NotFoundException();

        const deletedVehicle = await tx.vehicle.update({
          where: { id, companyId },
          data: { deletedAt: new Date(), status: 'OUT_OF_SERVICE' },
        });

        await this.auditService.logEvent(
          {
            companyId,
            entity: 'Vehicle',
            entityType: 'Vehicle',
            entityId: deletedVehicle.id,
            action: 'DELETE',
            details: { ...deletedVehicle },
            source: 'API',
          },
          null,
          tx,
        );

        await this.eventStore.append({
          tenantId: companyId,
          streamType: 'VEHICLE',
          streamId: deletedVehicle.id,
          eventType: 'VehicleDeleted',
          payload: {},
        });

        return deletedVehicle;
      },
    );

    this.eventEmitter.emit('vehicle.deleted', deletedVehicle);

    return deletedVehicle;
  }
  async getVehicleTCO(companyId: string, vehicleId: string, fromDate?: string, toDate?: string) {
    const cacheKey = `tco:${companyId}:${vehicleId}:${fromDate || 'all'}:${toDate || 'all'}`;
    const startTime = performance.now();
    
    const cached = await this.cacheManager.get(cacheKey);
    if (cached) {
      const endTime = performance.now();
      console.log(`[CACHE HIT] getVehicleTCO (${endTime - startTime}ms) for ${cacheKey}`);
      return cached;
    }

    return this.prisma.runAsTenant(companyId, async (tx) => {
      // 1. Validate vehicle exists
      const vehicle = await tx.vehicle.findFirst({ where: { id: vehicleId, companyId } });
      if (!vehicle) throw new NotFoundException('Vehicle not found');

      // Date range filters
      const dateFilter: any = {};

      if (fromDate) dateFilter.gte = new Date(fromDate);
      if (toDate) dateFilter.lte = new Date(toDate);

      const fuelWhere: any = { vehicleId, companyId, status: 'FILLED' };
      const jobCardWhere: any = { vehicleId, companyId, status: { not: 'CANCELLED' } };
      const insuranceWhere: any = { vehicleId, companyId };

      const fuelWhereRange = Object.keys(dateFilter).length > 0 ? { ...fuelWhere, filledAt: dateFilter } : fuelWhere;
      const jobCardWhereRange = Object.keys(dateFilter).length > 0 ? { ...jobCardWhere, openedAt: dateFilter } : jobCardWhere;
      const insuranceWhereRange = Object.keys(dateFilter).length > 0 ? { ...insuranceWhere, issueDate: dateFilter } : insuranceWhere;

      // Fuel costs
      const fuelTotalObj = await tx.fuelEntry.aggregate({
        _sum: { amount: true },
        where: fuelWhereRange,
      });
      const fuelTotalLifetimeObj = await tx.fuelEntry.aggregate({
        _sum: { amount: true },
        where: fuelWhere,
      });

      // Workshop (Maintenance) costs
      const workshopTotalObj = await tx.jobCard.aggregate({
        _sum: { totalCost: true },
        where: jobCardWhereRange,
      });
      const workshopTotalLifetimeObj = await tx.jobCard.aggregate({
        _sum: { totalCost: true },
        where: jobCardWhere,
      });

      // Insurance costs
      const insuranceTotalObj = await tx.insuranceLog.aggregate({
        _sum: { premiumAmount: true },
        where: insuranceWhereRange,
      });
      const insuranceTotalLifetimeObj = await tx.insuranceLog.aggregate({
        _sum: { premiumAmount: true },
        where: insuranceWhere,
      });

      const fuel = fuelTotalObj._sum.amount || 0;
      const workshop = workshopTotalObj._sum.totalCost || 0;
      const insurance = insuranceTotalObj._sum.premiumAmount || 0;

      const fuelLifetime = fuelTotalLifetimeObj._sum.amount || 0;
      const workshopLifetime = workshopTotalLifetimeObj._sum.totalCost || 0;
      const insuranceLifetime = insuranceTotalLifetimeObj._sum.premiumAmount || 0;

      const rangeTotal = fuel + workshop + insurance;
      const lifetimeTotal = fuelLifetime + workshopLifetime + insuranceLifetime;

      const result = {
        vehicleId,
        dateRange: {
          from: fromDate || null,
          to: toDate || null,
        },
        breakdown: {
          fuel,
          workshop,
          insurance,
        },
        total: rangeTotal,
        lifetimeTotal,
      };

      await this.cacheManager.set(cacheKey, result, 300000); // 5 mins cache
      const endTime = performance.now();
      console.log(`[CACHE MISS] getVehicleTCO computed in ${endTime - startTime}ms for ${cacheKey}`);

      return result;
    });
  }
}
