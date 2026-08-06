import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateTrailerDto } from './dto/create-trailer.dto';
import { UpdateTrailerDto } from './dto/update-trailer.dto';
import { TrailerQueryDto } from './dto/trailer-query.dto';

@Injectable()
export class TrailersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createTrailerDto: CreateTrailerDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.vehicle.create({
        data: {
          ...createTrailerDto,
          companyId,
          type: 'TRAILER', // Force type to TRAILER
        },
      });
    });
  }

  async findAll(companyId: string, query: TrailerQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: any = {
        type: 'TRAILER',
      };

      if (search) {
        where.OR = [
          { licensePlate: { contains: search, mode: 'insensitive' } },
          { vin: { contains: search, mode: 'insensitive' } },
          { make: { contains: search, mode: 'insensitive' } },
          { model: { contains: search, mode: 'insensitive' } },
        ];
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
        }),
        tx.vehicle.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const trailer = await tx.vehicle.findFirst({
        where: { id, type: 'TRAILER' },
      });

      if (!trailer) {
        throw new NotFoundException(`Trailer with ID ${id} not found`);
      }
      return trailer;
    });
  }

  async update(
    companyId: string,
    id: string,
    updateTrailerDto: UpdateTrailerDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingTrailer = await tx.vehicle.findFirst({
        where: { id, type: 'TRAILER' },
      });

      if (!existingTrailer) throw new NotFoundException();

      return tx.vehicle.update({
        where: { id },
        data: updateTrailerDto,
      });
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingTrailer = await tx.vehicle.findFirst({
        where: { id, type: 'TRAILER' },
      });

      if (!existingTrailer) throw new NotFoundException();

      return tx.vehicle.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'OUT_OF_SERVICE' },
      });
    });
  }
}
