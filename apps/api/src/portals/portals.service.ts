import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSupportTicketDto,
  CreateLeaveRequestDto,
} from './dto/portals.dto';

@Injectable()
export class PortalsService {
  constructor(private prisma: PrismaService) {}

  async createSupportTicket(
    companyId: string,
    userId: string,
    dto: CreateSupportTicketDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.supportTicket.create({
        data: {
          companyId,
          userId,
          subject: dto.subject,
          description: dto.description,
          priority: dto.priority,
        },
      });
    });
  }

  async getSupportTickets(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.supportTicket.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });
    });
  }

  async createLeaveRequest(
    companyId: string,
    userId: string,
    dto: CreateLeaveRequestDto,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await tx.driver.findFirst({ where: { userId } });
      if (!driver)
        throw new NotFoundException(
          'Authenticated user is not a registered driver',
        );

      return tx.leaveRequest.create({
        data: {
          companyId,
          driverId: driver.id,
          startDate: new Date(dto.startDate),
          endDate: new Date(dto.endDate),
          reason: dto.reason,
        },
      });
    });
  }

  async getLeaveRequests(companyId: string, userId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const driver = await tx.driver.findFirst({ where: { userId } });
      if (!driver)
        throw new NotFoundException(
          'Authenticated user is not a registered driver',
        );

      return tx.leaveRequest.findMany({
        where: { driverId: driver.id },
        orderBy: { createdAt: 'desc' },
      });
    });
  }
}
