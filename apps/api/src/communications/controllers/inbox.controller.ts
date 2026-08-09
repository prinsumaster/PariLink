import { Controller, Get, Post, Param, Body, UseGuards, NotFoundException } from '@nestjs/common';
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
        where: { participantIds: { has: user.id } },
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
    const thread = await this.prisma.runAsTenant(user.companyId, async (tx) =>
      tx.inboxThread.findUnique({
        where: { id: threadId, participantIds: { has: user.id } },
      }),
    );
    if (!thread) {
      throw new NotFoundException('Thread not found or access denied');
    }

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
    const thread = await this.prisma.runAsTenant(user.companyId, async (tx) =>
      tx.inboxThread.findUnique({
        where: { id: threadId, participantIds: { has: user.id } },
      }),
    );
    if (!thread) {
      throw new NotFoundException('Thread not found or access denied');
    }

    const message = await this.prisma.runAsSystem(async (tx) =>
      tx.inboxMessage.create({
        data: {
          threadId,
          senderId: user.id,
          content: dto.content,
          readBy: [user.id],
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
    thread.participantIds.forEach((participantId) => {
      if (participantId !== user.id) {
        this.sseService.emitToUser(participantId, {
          type: 'NEW_MESSAGE',
          threadId,
          message,
        });
      }
    });

    return { data: message };
  }
}
