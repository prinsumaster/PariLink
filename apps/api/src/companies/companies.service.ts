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

@Injectable()
export class CompaniesService {
  constructor(private prisma: PrismaService) {}

  async create(createCompanyDto: CreateCompanyDto) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.company.create({
        data: createCompanyDto,
      }),
    );
  }

  async findAll(query: CompanyQueryDto) {
    const { page = 1, limit = 10, search, status } = query;
    const { skip, take } = getPaginationParams(page, limit);

    const where: Prisma.CompanyWhereInput = {};

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

  async update(id: string, updateCompanyDto: UpdateCompanyDto) {
    await this.findOne(id); // verify existence
    return this.prisma.runAsSystem(async (tx) =>
      tx.company.update({
        where: { id },
        data: updateCompanyDto,
      }),
    );
  }

  async remove(id: string) {
    await this.findOne(id); // verify existence
    return this.prisma.runAsSystem(async (tx) =>
      tx.company.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      }),
    );
  }
}
