import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import {
  ConflictException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateLoadDto } from './dto/create-load.dto';
import { UpdateLoadDto } from './dto/update-load.dto';
import { LoadQueryDto } from './dto/load-query.dto';
import * as crypto from 'crypto';
import { WorkflowService } from '../workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class LoadsService {
  private readonly logger = new Logger(LoadsService.name);
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async create(
    companyId: string,
    createLoadDto: CreateLoadDto,
    userId?: string,
  ) {
    const newLoad = await this.prisma.runAsTenant(companyId, async (tx) => {
      const { customerId, ...restDto } = createLoadDto;

      const customer = await tx.customer.findFirst({
        where: { id: customerId, companyId },
      });
      if (!customer)
        throw new NotFoundException('Customer not found or unauthorized');

      const data: any = { ...restDto };

      if (data.pickupDate) data.pickupDate = new Date(data.pickupDate);
      if (data.deliveryDate) data.deliveryDate = new Date(data.deliveryDate);

      // Validate unique referenceNumber per tenant if provided
      if (data.referenceNumber) {
        const duplicateRef = await tx.load.findFirst({
          where: { referenceNumber: data.referenceNumber, companyId },
        });
        if (duplicateRef)
          throw new ConflictException(
            `Reference number ${data.referenceNumber} already exists`,
          );
      }

      // Auto-generate referenceNumber if not provided
      if (!data.referenceNumber) {
        data.referenceNumber = `LD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      }

      const createdLoad = await tx.load.create({
        data: {
          ...data,
          company: { connect: { id: companyId } },
          customer: { connect: { id: customerId } },
        },
        include: { customer: true },
      });

      // Rule Engine Integration
      const ruleResult = await this.workflow.evaluateRules(companyId, {
        entityType: 'LOAD',
        trigger: 'LOAD_CREATED',
        entityData: createdLoad,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new Error('Load creation rejected by business rules.');
      }

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Load',
          entityType: 'Load',
          entityId: createdLoad.id,
          action: 'CREATE',
          details: { referenceNumber: createdLoad.referenceNumber },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'LOAD',
        streamId: createdLoad.id,
        eventType: 'LoadCreated',
        payload: { referenceNumber: createdLoad.referenceNumber },
        userId,
      });

      return createdLoad;
    });

    this.eventEmitter.emit('load.created', newLoad);

    return newLoad;
  }

  async findAll(companyId: string, query: LoadQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status, customerId } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.LoadWhereInput = { companyId };

      if (search) {
        where.OR = [
          { referenceNumber: { contains: search, mode: 'insensitive' } },
          { originCity: { contains: search, mode: 'insensitive' } },
          { destinationCity: { contains: search, mode: 'insensitive' } },
          { customer: { name: { contains: search, mode: 'insensitive' } } },
        ];
      }

      if (status) {
        where.status = status;
      }

      if (customerId) {
        where.customerId = customerId;
      }

      this.logger.debug(
        `findMany args: page=${page} limit=${limit} status=${status ?? 'all'} customerId=${customerId ?? 'all'}`,
      );
      const [data, total] = await Promise.all([
        tx.load.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { customer: true },
        }),
        tx.load.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const load = await tx.load.findFirst({
        where: { id, companyId },
        include: { customer: true, documents: true, invoices: true },
      });

      if (!load) {
        throw new NotFoundException(`Load with ID ${id} not found`);
      }
      return load;
    });
  }

  async update(
    companyId: string,
    id: string,
    updateLoadDto: UpdateLoadDto,
    userId?: string,
  ) {
    const updatedLoad = await this.prisma.runAsTenant(companyId, async (tx) => {
      const existingLoad = await tx.load.findFirst({
        where: { id, companyId },
      });
      if (!existingLoad) throw new NotFoundException();

      const { driverId, vehicleId, customerId, ...restData } = updateLoadDto;

      if (customerId && customerId !== existingLoad.customerId) {
        const customer = await tx.customer.findFirst({
          where: { id: customerId, companyId },
        });
        if (!customer)
          throw new NotFoundException('Customer not found or unauthorized');
      }

      const data: any = { ...restData };
      if (customerId) data.customerId = customerId;
      if (data.pickupDate) data.pickupDate = new Date(data.pickupDate);
      if (data.deliveryDate) data.deliveryDate = new Date(data.deliveryDate);

      // Prevent backwards state transitions
      if (
        (existingLoad.status === 'COMPLETED' ||
          existingLoad.status === 'DELIVERED' ||
          existingLoad.status === 'CANCELLED') &&
        data.status &&
        data.status !== existingLoad.status
      ) {
        throw new ConflictException(
          `Cannot change status of a ${existingLoad.status} load directly.`,
        );
      }

      // Create a trip if driver and vehicle are assigned and we don't already have one
      if (
        driverId &&
        vehicleId &&
        data.status === 'ASSIGNED' &&
        !existingLoad.tripId
      ) {
        const driver = await tx.driver.findFirst({
          where: { id: driverId, companyId },
        });
        if (!driver || driver.status !== 'AVAILABLE')
          throw new ConflictException('Driver is not available');

        const vehicle = await tx.vehicle.findFirst({
          where: { id: vehicleId, companyId },
        });
        if (!vehicle || vehicle.status !== 'IN_SERVICE')
          throw new ConflictException('Vehicle is not available');

        const trip = await tx.trip.create({
          data: {
            companyId,
            tripNumber: `TRP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            driverId,
            vehicleId,
            status: 'DISPATCHED',
          },
        });

        await this.prisma.updateWithOcc(
          tx,
          'driver',
          driverId,
          driver.updatedAt,
          { status: 'DISPATCHED' },
        );
        await this.prisma.updateWithOcc(
          tx,
          'vehicle',
          vehicleId,
          vehicle.updatedAt,
          { status: 'DISPATCHED' },
        );

        data.tripId = trip.id;
      }

      this.logger.debug(
        `Updating load ${id} with status=${updateLoadDto.status ?? 'unchanged'}`,
      );

      const savedLoad = await this.prisma.updateWithOcc<any>(
        tx,
        'load',
        id,
        existingLoad.updatedAt,
        data,
        { customer: true },
      );

      this.logger.debug(`Load ${id} updated successfully`);

      // Auto-generate invoice when status becomes DELIVERED
      if (updateLoadDto.status === 'DELIVERED') {
        const existingInvoice = await tx.invoice.findFirst({
          where: { loadId: id },
        });
        if (!existingInvoice) {
          const refPart = savedLoad.referenceNumber
            ? savedLoad.referenceNumber.split('-').pop()
            : crypto.randomBytes(4).toString('hex').toUpperCase();
          await tx.invoice.create({
            data: {
              companyId,
              customerId: savedLoad.customerId,
              loadId: savedLoad.id,
              invoiceNumber: `INV-${refPart}`,
              status: 'DRAFT',
              amount: savedLoad.rate || 1500,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Load',
          entityType: 'Load',
          entityId: savedLoad.id,
          action: 'UPDATE',
          details: { status: savedLoad.status },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'LOAD',
        streamId: savedLoad.id,
        eventType: 'LoadUpdated',
        payload: { status: savedLoad.status },
        userId,
      });

      return savedLoad;
    });

    this.eventEmitter.emit('load.updated', updatedLoad);

    return updatedLoad;
  }

  async remove(companyId: string, id: string, userId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingLoad = await tx.load.findFirst({
        where: { id, companyId },
      });
      if (!existingLoad) throw new NotFoundException();

      const deletedLoad = await tx.load.update({
        where: { id, companyId },
        data: { deletedAt: new Date(), status: 'CANCELLED' },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Load',
          entityType: 'Load',
          entityId: deletedLoad.id,
          action: 'DELETE',
          details: { status: deletedLoad.status },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'LOAD',
        streamId: deletedLoad.id,
        eventType: 'LoadDeleted',
        payload: { status: deletedLoad.status },
        userId,
      });

      return deletedLoad;
    });
  }
}
