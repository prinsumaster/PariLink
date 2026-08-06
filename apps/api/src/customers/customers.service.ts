import { Prisma } from '@prisma/client';
import {
  getPaginationParams,
  createPaginationResponse,
} from '../platform/api/utils/pagination.util';
import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { CustomerQueryDto } from './dto/customer-query.dto';

@Injectable()
export class CustomersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createCustomerDto: CreateCustomerDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.customer.create({
        data: {
          ...createCustomerDto,
          companyId,
        },
      });
    });
  }

  async findAll(companyId: string, query: CustomerQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.CustomerWhereInput = {};

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
        tx.customer.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        tx.customer.count({ where }),
      ]);

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const customer = await tx.customer.findFirst({
        where: { id },
      });

      if (!customer) {
        throw new NotFoundException(`Customer with ID ${id} not found`);
      }
      return customer;
    });
  }

  async update(
    companyId: string,
    id: string,
    updateCustomerDto: UpdateCustomerDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingCustomer = await tx.customer.findFirst({
        where: { id },
      });
      if (!existingCustomer) throw new NotFoundException();

      const updateResult = await tx.customer.updateMany({
        where: { id, updatedAt: existingCustomer.updatedAt },
        data: updateCustomerDto,
      });

      if (updateResult.count === 0) {
        throw new ConflictException(
          'Customer was modified by another user. Please refresh and try again.',
        );
      }

      const updatedCustomer = await tx.customer.findFirst({
        where: { id },
      });

      if (!updatedCustomer) throw new NotFoundException();
      return updatedCustomer;
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingCustomer = await tx.customer.findFirst({
        where: { id },
      });
      if (!existingCustomer) throw new NotFoundException();

      return tx.customer.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });
    });
  }
}
