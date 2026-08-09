import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { CompanyQueryDto } from './dto/company-query.dto';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class CompaniesService {
  constructor(
    private prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

  async create(createCompanyDto: CreateCompanyDto, userId?: string) {
    return this.prisma.runAsSystem(async (tx) => {
      const company = await tx.company.create({
        data: createCompanyDto,
      });

      await this.auditService.logEvent({
        action: 'COMPANY_CREATED',
        entity: 'Company',
        entityId: company.id,
        companyId: company.id,
        source: 'API',
        details: { name: company.name },
      });

      await this.eventStore.append({
        tenantId: company.id,
        streamType: 'COMPANY',
        streamId: company.id,
        eventType: 'CompanyCreated',
        payload: { name: company.name },
        userId,
      });

      return company;
    });
  }

  async findAll(query: CompanyQueryDto, companyId?: string) {
    const { page = 1, limit = 10, search, status } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where: Prisma.CompanyWhereInput = {};

    if (companyId) {
      where.id = companyId;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    if (status) {
      where.status = status;
    }

    const [data, total] = await Promise.all([
      this.prisma.runAsSystem(async (tx) =>
        tx.company.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
      ),
      this.prisma.runAsSystem(async (tx) => tx.company.count({ where })),
    ]);

    return createPaginationResponse(data, total, page, limit);
  }

  async findOne(id: string) {
    const company = await this.prisma.runAsSystem(async (tx) =>
      tx.company.findFirst({
        where: { id },
      }),
    );

    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async update(
    id: string,
    updateCompanyDto: UpdateCompanyDto,
    userId?: string,
  ) {
    await this.findOne(id); // verify existence
    return this.prisma.runAsSystem(async (tx) => {
      const company = await tx.company.update({
        where: { id },
        data: updateCompanyDto,
      });

      await this.auditService.logEvent({
        action: 'COMPANY_UPDATED',
        entity: 'Company',
        entityId: company.id,
        companyId: company.id,
        source: 'API',
      });

      await this.eventStore.append({
        tenantId: company.id,
        streamType: 'COMPANY',
        streamId: company.id,
        eventType: 'CompanyUpdated',
        payload: updateCompanyDto,
        userId,
      });

      return company;
    });
  }

  async remove(id: string, userId?: string) {
    await this.findOne(id); // verify existence
    return this.prisma.runAsSystem(async (tx) => {
      const company = await tx.company.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });

      await this.auditService.logEvent({
        action: 'COMPANY_DELETED',
        entity: 'Company',
        entityId: company.id,
        companyId: company.id,
        source: 'API',
      });

      await this.eventStore.append({
        tenantId: company.id,
        streamType: 'COMPANY',
        streamId: company.id,
        eventType: 'CompanyDeleted',
        payload: {},
        userId,
      });

      return company;
    });
  }
}
