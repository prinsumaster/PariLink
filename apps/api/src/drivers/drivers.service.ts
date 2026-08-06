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
import { CreateDriverDto } from './dto/create-driver.dto';
import { UpdateDriverDto } from './dto/update-driver.dto';
import { DriverQueryDto } from './dto/driver-query.dto';
import { WorkflowService } from '../workflow/workflow.service';
import { EventEmitter2 } from '@nestjs/event-emitter';

@Injectable()
export class DriversService {
  constructor(
    private readonly auditService: AuditService,

    private prisma: PrismaService,
    private workflow: WorkflowService,
    private eventEmitter: EventEmitter2,
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

      return newDriver;
    });

    this.eventEmitter.emit('driver.created', newDriver);

    return newDriver;
  }

  async findAll(companyId: string, query: DriverQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.DriverWhereInput = {};

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
        }),
        tx.driver.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await tx.driver.findFirst({
        where: { id },
      });

      if (!driver) {
        throw new NotFoundException(`Driver with ID ${id} not found`);
      }
      return driver;
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
          where: { id },
        });
        if (!existingDriver) throw new NotFoundException();

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
          where: { id },
        });
        if (!existingDriver) throw new NotFoundException();

        const deletedDriver = await tx.driver.update({
          where: { id },
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

        return deletedDriver;
      },
    );

    this.eventEmitter.emit('driver.deleted', deletedDriver);

    return deletedDriver;
  }
}
