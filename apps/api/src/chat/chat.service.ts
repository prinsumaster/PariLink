import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ChatService {
  constructor(private prisma: PrismaService) {}

  async getChannels(companyId: string, userId: string) {
    // Get all non-archived channels the user is a member of, or all public channels
    const channels = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatChannel.findMany({
        where: {
          companyId,
          archivedAt: null,
          OR: [{ isPrivate: false }, { members: { some: { userId } } }],
        },
        include: {
          members: { select: { userId: true, lastReadAt: true } },
          _count: { select: { messages: true } },
        },
        orderBy: { createdAt: 'asc' },
      }),
    );

    // Add unread count per channel for this user
    return channels.map((ch) => {
      const myMembership = ch.members.find((m) => m.userId === userId);
      return {
        ...ch,
        isMember: !!myMembership,
        lastReadAt: myMembership?.lastReadAt,
      };
    });
  }

  async createChannel(
    companyId: string,
    userId: string,
    data: {
      name: string;
      description?: string;
      type?: string;
      isPrivate?: boolean;
      memberIds?: string[];
    },
  ) {
    const channel = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatChannel.create({
        data: {
          companyId,
          name: data.name,
          description: data.description,
          type: data.type || 'CHANNEL',
          isPrivate: data.isPrivate || false,
          createdById: userId,
          members: {
            create: [
              { userId, role: 'ADMIN' },
              ...(data.memberIds || [])
                .filter((id) => id !== userId)
                .map((id) => ({ userId: id, role: 'MEMBER' })),
            ],
          },
        },
        include: { members: true },
      }),
    );
    return channel;
  }

  async getMessages(
    companyId: string,
    userId: string,
    channelId: string,
    cursor?: string,
    limit = 50,
  ) {
    // Verify membership or public channel
    const channel = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatChannel.findFirst({
        where: { id: channelId, companyId },
      }),
    );
    if (!channel) throw new NotFoundException('Channel not found');

    if (channel.isPrivate) {
      const isMember = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.chatChannelMember.findUnique({
          where: { channelId_userId: { channelId, userId } },
        }),
      );
      if (!isMember)
        throw new ForbiddenException('Not a member of this channel');
    }

    const messages = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatMessage.findMany({
        where: {
          channelId,
          ...(cursor ? { createdAt: { lt: new Date(cursor) } } : {}),
        },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
          reactions: {
            include: {
              user: { select: { id: true, firstName: true, lastName: true } },
            },
          },
        },
        orderBy: { createdAt: 'desc' },
        take: limit,
      }),
    );

    // Update last read
    await this.prisma.runAsSystem(async (tx) =>
      tx.chatChannelMember.upsert({
        where: { channelId_userId: { channelId, userId } },
        update: { lastReadAt: new Date() },
        create: { channelId, userId, lastReadAt: new Date() },
      }),
    );

    return messages.reverse();
  }

  async sendMessage(
    companyId: string,
    userId: string,
    channelId: string,
    content: string,
    attachments: any[] = [],
    mentions: string[] = [],
  ) {
    const channel = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatChannel.findFirst({
        where: { id: channelId, companyId },
      }),
    );
    if (!channel) throw new NotFoundException('Channel not found');

    const message = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatMessage.create({
        data: { channelId, senderId: userId, content, attachments, mentions },
        include: {
          sender: {
            select: { id: true, firstName: true, lastName: true, avatar: true },
          },
          reactions: true,
        },
      }),
    );

    // Create notifications for mentioned users
    if (mentions.length > 0) {
      await this.prisma.runAsSystem(async (tx) =>
        tx.notification.createMany({
          data: mentions.map((mentionedUserId) => ({
            companyId,
            userId: mentionedUserId,
            type: 'CHAT',
            title: `You were mentioned`,
            body: `${content.substring(0, 100)}...`,
            entityType: 'ChatMessage',
            entityId: message.id,
            actionUrl: `/chat?channel=${channelId}`,
          })),
          skipDuplicates: true,
        }),
      );
    }

    return message;
  }

  async editMessage(
    companyId: string,
    userId: string,
    messageId: string,
    content: string,
  ) {
    const message = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatMessage.findUnique({
        where: { id: messageId },
      }),
    );
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId)
      throw new ForbiddenException("Cannot edit another user's message");

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatMessage.update({
        where: { id: messageId },
        data: { content, editedAt: new Date() },
        include: {
          sender: { select: { id: true, firstName: true, lastName: true } },
          reactions: true,
        },
      }),
    );
  }

  async deleteMessage(companyId: string, userId: string, messageId: string) {
    const message = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatMessage.findUnique({
        where: { id: messageId },
      }),
    );
    if (!message) throw new NotFoundException('Message not found');
    if (message.senderId !== userId)
      throw new ForbiddenException("Cannot delete another user's message");

    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatMessage.update({
        where: { id: messageId },
        data: { deletedAt: new Date(), content: 'This message was deleted.' },
      }),
    );
  }

  async addReaction(userId: string, messageId: string, emoji: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.messageReaction.upsert({
        where: { messageId_userId_emoji: { messageId, userId, emoji } },
        update: {},
        create: { messageId, userId, emoji },
      }),
    );
  }

  async removeReaction(userId: string, messageId: string, emoji: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.messageReaction.deleteMany({
        where: { messageId, userId, emoji },
      }),
    );
  }

  async joinChannel(userId: string, channelId: string) {
    return this.prisma.runAsSystem(async (tx) =>
      tx.chatChannelMember.upsert({
        where: { channelId_userId: { channelId, userId } },
        update: {},
        create: { channelId, userId },
      }),
    );
  }

  async getOrCreateDm(companyId: string, userId: string, otherUserId: string) {
    // Check if DM channel already exists between these two users
    const existing = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.chatChannel.findFirst({
        where: {
          companyId,
          type: 'DIRECT',
          members: { every: { userId: { in: [userId, otherUserId] } } },
        },
      }),
    );
    if (existing) return existing;

    return this.createChannel(companyId, userId, {
      name: `DM`,
      type: 'DIRECT',
      isPrivate: true,
      memberIds: [otherUserId],
    });
  }
}
