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
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserQueryDto } from './dto/user-query.dto';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(companyId: string, createUserDto: CreateUserDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: createUserDto.email },
      });

      if (existingUser) {
        throw new ConflictException('Email already exists');
      }

      const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

      const user = await tx.user.create({
        data: {
          ...createUserDto,
          password: hashedPassword,
          companyId,
        },
      });

      const { password, ...result } = user;
      return result;
    });
  }

  async findAll(companyId: string, query: UserQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.UserWhereInput = {};

      if (search) {
        where.OR = [
          { firstName: { contains: search, mode: 'insensitive' } },
          { lastName: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ];
      }

      if (query.roleId) {
        where.roleId = query.roleId;
      }

      if (status) {
        where.status = status;
      }

      const [users, total] = await Promise.all([
        tx.user.findMany({
          where,
          skip,
          take,
          orderBy: { createdAt: 'desc' },
          include: { role: true },
        }),
        tx.user.count({ where }),
      ]);

      const data = users.map((user) => {
        const { password, ...result } = user;
        return result;
      });

      return createPaginationResponse(data, total, page, limit);
    });
  }

  async findOne(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const user = await tx.user.findFirst({
        where: { id },
        include: { role: true },
      });

      if (!user) {
        throw new NotFoundException(`User with ID ${id} not found`);
      }

      const { password, ...result } = user;
      return result;
    });
  }

  async update(companyId: string, id: string, updateUserDto: UpdateUserDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { id },
      });
      if (!existingUser) throw new NotFoundException();

      const user = await tx.user.update({
        where: { id },
        data: updateUserDto,
      });

      const { password, ...result } = user;
      return result;
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { id },
      });
      if (!existingUser) throw new NotFoundException();

      const user = await tx.user.update({
        where: { id },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });

      const { password, ...result } = user;
      return result;
    });
  }
}
