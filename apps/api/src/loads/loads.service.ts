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

@Injectable()
export class LoadsService {
  private readonly logger = new Logger(LoadsService.name);
  constructor(
    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
  ) {}

  async create(companyId: string, createLoadDto: CreateLoadDto) {
    const newLoad = await this.prisma.runAsTenant(companyId, async (tx) => {
      const { customerId, ...restDto } = createLoadDto;
      const data: any = { ...restDto };

      if (data.pickupDate) data.pickupDate = new Date(data.pickupDate);
      if (data.deliveryDate) data.deliveryDate = new Date(data.deliveryDate);

      // Auto-generate referenceNumber if not provided
      if (!data.referenceNumber) {
        data.referenceNumber = `LD-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
      }

      const newLoad = await tx.load.create({
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
        entityData: newLoad,
      });

      if (ruleResult.triggeredActions.some((a) => a.actionType === 'REJECT')) {
        throw new Error('Load creation rejected by business rules.');
      }

      return newLoad;
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

  async update(companyId: string, id: string, updateLoadDto: UpdateLoadDto) {
    const updatedLoad = await this.prisma.runAsTenant(companyId, async (tx) => {
      const existingLoad = await tx.load.findFirst({
        where: { id, companyId },
      });
      if (!existingLoad) throw new NotFoundException();

      const { driverId, vehicleId, ...restData } = updateLoadDto;
      const data: any = { ...restData };
      if (data.pickupDate) data.pickupDate = new Date(data.pickupDate);
      if (data.deliveryDate) data.deliveryDate = new Date(data.deliveryDate);

      // Create a trip if driver and vehicle are assigned and we don't already have one
      if (
        driverId &&
        vehicleId &&
        data.status === 'ASSIGNED' &&
        !existingLoad.tripId
      ) {
        const trip = await tx.trip.create({
          data: {
            companyId,
            tripNumber: `TRP-${crypto.randomBytes(4).toString('hex').toUpperCase()}`,
            driverId,
            vehicleId,
            status: 'DISPATCHED',
          },
        });
        data.tripId = trip.id;
      }

      this.logger.debug(
        `Updating load ${id} with status=${updateLoadDto.status ?? 'unchanged'}`,
      );

      const updatedLoad = await this.prisma.updateWithOcc<any>(
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
          const refPart = updatedLoad.referenceNumber
            ? updatedLoad.referenceNumber.split('-').pop()
            : crypto.randomBytes(4).toString('hex').toUpperCase();
          await tx.invoice.create({
            data: {
              companyId,
              customerId: updatedLoad.customerId,
              loadId: updatedLoad.id,
              invoiceNumber: `INV-${refPart}`,
              status: 'DRAFT',
              amount: updatedLoad.rate || 1500,
              dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            },
          });
        }
      }

      return updatedLoad;
    });

    this.eventEmitter.emit('load.updated', updatedLoad);

    return updatedLoad;
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingLoad = await tx.load.findFirst({
        where: { id, companyId },
      });
      if (!existingLoad) throw new NotFoundException();

      return tx.load.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'CANCELLED' },
      });
    });
  }
}
