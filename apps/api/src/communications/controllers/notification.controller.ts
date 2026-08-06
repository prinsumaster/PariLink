import {
  Controller,
  Get,
  Post,
  Param,
  Body,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { SseService } from '../realtime/sse.service';

@ApiTags('notifications')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('notifications')
export class NotificationController {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Get current user notifications' })
  async getNotifications(
    @GetUser() user: AuthenticatedUser,
    @Query('status') status: string,
  ) {
    const whereClause: any = { userId: user.userId };
    if (status === 'unread') whereClause.isRead = false;
    if (status === 'archived') whereClause.isArchived = true;

    const notifications = await this.prisma.runAsSystem(async (tx) =>
      tx.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    );

    return { data: notifications };
  }

  @Post(':id/read')
  @ApiOperation({ summary: 'Mark a notification as read' })
  async markAsRead(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    const updated = await this.prisma.runAsSystem(async (tx) =>
      tx.notification.update({
        where: { id },
        data: { isRead: true, readAt: new Date() },
      }),
    );

    this.sseService.emitToUser(user.userId, { type: 'NOTIFICATION_READ', id });
    return updated;
  }
}
