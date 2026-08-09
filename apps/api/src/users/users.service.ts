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
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class UsersService {
  constructor(
    private prisma: PrismaService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

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

      await this.auditService.logEvent({
        action: 'USER_CREATED',
        entity: 'User',
        entityId: user.id,
        companyId,
        source: 'API',
        details: { email: user.email },
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'USER',
        streamId: user.id,
        eventType: 'UserCreated',
        payload: { email: user.email, roleId: user.roleId },
      });

      return result;
    });
  }

  async findAll(companyId: string, query: UserQueryDto) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const { page = 1, limit = 10, search, status } = query;
      const { skip, take } = getPaginationParams(page, limit);

      const where: Prisma.UserWhereInput = { companyId };

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
        where: { id, companyId },
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
        where: { id, companyId },
      });
      if (!existingUser) throw new NotFoundException();

      const user = await tx.user.update({
        where: { id, companyId },
        data: updateUserDto,
      });

      const { password, ...result } = user;

      await this.auditService.logEvent({
        action: 'USER_UPDATED',
        entity: 'User',
        entityId: user.id,
        companyId,
        source: 'API',
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'USER',
        streamId: user.id,
        eventType: 'UserUpdated',
        payload: updateUserDto,
      });

      return result;
    });
  }

  async remove(companyId: string, id: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const existingUser = await tx.user.findFirst({
        where: { id, companyId },
      });
      if (!existingUser) throw new NotFoundException();

      const user = await tx.user.update({
        where: { id, companyId },
        data: { deletedAt: new Date(), status: 'INACTIVE' },
      });

      const { password, ...result } = user;

      await this.auditService.logEvent({
        action: 'USER_DELETED',
        entity: 'User',
        entityId: user.id,
        companyId,
        source: 'API',
      });

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'USER',
        streamId: user.id,
        eventType: 'UserDeleted',
        payload: {},
      });

      return result;
    });
  }
}
