import { Prisma } from '@prisma/client';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVendorDto } from './dto/create-vendor.dto';
import { UpdateVendorDto } from './dto/update-vendor.dto';
import { VendorQueryDto } from './dto/vendor-query.dto';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';

@Injectable()
export class VendorsService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createVendorDto: CreateVendorDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.vendor.create({
        data: {
          ...createVendorDto,
          companyId,
        },
      });
    });
  }

  async findAll(companyId: string, query: VendorQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status, type } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.VendorWhereInput = {};

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

      if (type) {
        where.type = type;
      }

      const [data, total] = await Promise.all([
        tx.vendor.findMany({
          where,
          skip,
          take,
          orderBy: { [query.sortBy || 'createdAt']: query.sortOrder || 'desc' },
        }),
        tx.vendor.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const vendor = await tx.vendor.findFirst({
        where: { id },
      });

      if (!vendor) {
        throw new NotFoundException(`Vendor with ID ${id} not found`);
      }
      return vendor;
    });
  }

  async update(
    companyId: string,
    id: string,
    updateVendorDto: UpdateVendorDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingVendor = await tx.vendor.findFirst({
        where: { id },
      });
      if (!existingVendor) throw new NotFoundException();

      return tx.vendor.update({
        where: { id },
        data: updateVendorDto,
      });
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingVendor = await tx.vendor.findFirst({
        where: { id },
      });
      if (!existingVendor) throw new NotFoundException();

      return tx.vendor.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });
    });
  }
}
