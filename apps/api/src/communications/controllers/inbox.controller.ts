import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { GetUser } from '../../auth/decorators/get-user.decorator';
import type { AuthenticatedUser } from '../../auth/decorators/get-user.decorator';
import { PrismaService } from '../../prisma/prisma.service';
import { SseService } from '../realtime/sse.service';

@ApiTags('inbox')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('inbox')
export class InboxController {
  constructor(
    private prisma: PrismaService,
    private sseService: SseService,
  ) {}

  @Get('threads')
  @ApiOperation({ summary: 'Get user inbox threads' })
  async getThreads(@GetUser() user: AuthenticatedUser) {
    const threads = await this.prisma.runAsSystem(async (tx) =>
      tx.inboxThread.findMany({
        where: { participantIds: { has: user.userId } },
        include: {
          messages: {
            orderBy: { createdAt: 'desc' },
            take: 1, // Last message
          },
        },
        orderBy: { updatedAt: 'desc' },
      }),
    );

    return { data: threads };
  }

  @Get('threads/:threadId/messages')
  @ApiOperation({ summary: 'Get messages for a thread' })
  async getMessages(
    @Param('threadId') threadId: string,
    @GetUser() user: AuthenticatedUser,
  ) {
    const messages = await this.prisma.runAsSystem(async (tx) =>
      tx.inboxMessage.findMany({
        where: { threadId },
        orderBy: { createdAt: 'asc' },
      }),
    );
    return { data: messages };
  }

  @Post('threads/:threadId/messages')
  @ApiOperation({ summary: 'Send a message in a thread' })
  async sendMessage(
    @Param('threadId') threadId: string,
    @Body() dto: { content: string },
    @GetUser() user: AuthenticatedUser,
  ) {
    const message = await this.prisma.runAsSystem(async (tx) =>
      tx.inboxMessage.create({
        data: {
          threadId,
          senderId: user.userId,
          content: dto.content,
          readBy: [user.userId],
        },
      }),
    );

    await this.prisma.runAsSystem(async (tx) =>
      tx.inboxThread.update({
        where: { id: threadId },
        data: { updatedAt: new Date() },
      }),
    );

    // Get thread participants to notify
    const thread = await this.prisma.runAsSystem(async (tx) =>
      tx.inboxThread.findUnique({
        where: { id: threadId },
      }),
    );
    if (thread) {
      thread.participantIds.forEach((participantId) => {
        if (participantId !== user.userId) {
          this.sseService.emitToUser(participantId, {
            type: 'NEW_MESSAGE',
            threadId,
            message,
          });
        }
      });
    }

    return { data: message };
  }
}
