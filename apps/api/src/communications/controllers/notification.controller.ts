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
    const whereClause: any = { userId: user.id };
    if (status === 'unread') whereClause.isRead = false;
    if (status === 'archived') whereClause.isArchived = true;

    const notifications = await this.prisma.runAsSystem(async (tx) =>
      tx.notification.findMany({
        where: whereClause,
        orderBy: { createdAt: 'desc' },
        take: 50,
      }),
    );

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const grouped = {
      today: notifications.filter((n) => new Date(n.createdAt) >= today),
      yesterday: notifications.filter(
        (n) =>
          new Date(n.createdAt) >= yesterday && new Date(n.createdAt) < today,
      ),
      earlier: notifications.filter((n) => new Date(n.createdAt) < yesterday),
    };

    return { data: notifications, grouped };
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

    this.sseService.emitToUser(user.id, { type: 'NOTIFICATION_READ', id });
    return updated;
  }

  @Post(':id/unread')
  @ApiOperation({ summary: 'Mark a notification as unread' })
  async markAsUnread(
    @Param('id') id: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.notification.update({
        where: { id },
        data: { isRead: false, readAt: null },
      }),
    );
  }

  @Post(':id/archive')
  @ApiOperation({ summary: 'Archive a notification' })
  async archive(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.notification.update({
        where: { id },
        data: { isArchived: true },
      }),
    );
  }

  @Post(':id/pin')
  @ApiOperation({ summary: 'Pin a notification' })
  async pin(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.notification.update({
        where: { id },
        data: { isPinned: true },
      }),
    );
  }

  @Post(':id/unpin')
  @ApiOperation({ summary: 'Unpin a notification' })
  async unpin(@Param('id') id: string, @GetUser() user: AuthenticatedUser) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.notification.update({
        where: { id },
        data: { isPinned: false },
      }),
    );
  }
}
