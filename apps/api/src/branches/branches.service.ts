import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { UpdateBranchDto } from './dto/update-branch.dto';
import { BranchQueryDto } from './dto/branch-query.dto';

@Injectable()
export class BranchesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createBranchDto: CreateBranchDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      // Force companyId to be the authenticated tenant's ID
      return tx.branch.create({
        data: {
          ...createBranchDto,
          companyId,
        },
      });
    });
  }

  async findAll(companyId: string, query: BranchQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.BranchWhereInput = { companyId };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (status) {
        where.status = status;
      }

      const [data, total] = await Promise.all([
        tx.branch.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        tx.branch.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const branch = await tx.branch.findFirst({
        where: { id, companyId },
      });

      if (!branch) {
        throw new NotFoundException(`Branch with ID ${id} not found`);
      }
      return branch;
    });
  }

  async update(
    companyId: string,
    id: string,
    updateBranchDto: UpdateBranchDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const branch = await tx.branch.findFirst({
        where: { id, companyId },
      });
      if (!branch) throw new NotFoundException();

      return tx.branch.update({
        where: { id, companyId },
        data: updateBranchDto,
      });
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const branch = await tx.branch.findFirst({
        where: { id, companyId },
      });
      if (!branch) throw new NotFoundException();

      return tx.branch.update({
        where: { id, companyId },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });
    });
  }
}
