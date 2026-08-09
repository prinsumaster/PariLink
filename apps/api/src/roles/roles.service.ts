import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { UpdateRoleDto } from './dto/update-role.dto';
import { RoleQueryDto } from './dto/role-query.dto';

@Injectable()
export class RolesService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createRoleDto: CreateRoleDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.role.create({
        data: {
          companyId,
          name: createRoleDto.name,
          description: createRoleDto.description,
          permissions: createRoleDto.permissions || [],
        },
      });
    });
  }

  async findAll(companyId: string, query: RoleQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.RoleWhereInput = { companyId };

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const [data, total] = await Promise.all([
        tx.role.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { users: true },
            },
          },
        }),
        tx.role.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const role = await tx.role.findFirst({
        where: { id, companyId },
        include: {
          _count: {
            select: { users: true },
          },
        },
      });

      if (!role) {
        throw new NotFoundException(`Role with ID ${id} not found`);
      }
      return role;
    });
  }

  async update(companyId: string, id: string, updateRoleDto: UpdateRoleDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingRole = await tx.role.findFirst({
        where: { id, companyId },
      });
      if (!existingRole) throw new NotFoundException();

      const updateData: any = { ...updateRoleDto };

      return tx.role.update({
        where: { id, companyId },
        data: updateData,
      });
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingRole = await tx.role.findFirst({
        where: { id, companyId },
      });
      if (!existingRole) throw new NotFoundException();

      return tx.role.update({
        where: { id, companyId },
        data: { deletedAt: new Date() },
      });
    });
  }
}
