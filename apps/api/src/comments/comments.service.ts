import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private prisma: PrismaService) {}

  async getComments(companyId: string, entityType: string, entityId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.comment.findMany({
        where: {
          companyId,
          entityType,
          entityId,
        },
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
          replies: {
            include: {
              author: {
                select: { id: true, firstName: true, lastName: true },
              },
            },
          },
        },
        orderBy: { createdAt: 'asc' },
      });
    });
  }

  async addComment(
    companyId: string,
    authorId: string,
    entityType: string,
    entityId: string,
    content: string,
    parentId?: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.comment.create({
        data: {
          companyId,
          authorId,
          entityType,
          entityId,
          content,
          parentId: parentId || null,
        },
        include: {
          author: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });
    });
  }

  async deleteComment(companyId: string, authorId: string, commentId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const comment = await tx.comment.findUnique({ where: { id: commentId } });
      if (!comment || comment.companyId !== companyId) {
        throw new NotFoundException('Comment not found');
      }

      // Soft delete
      return tx.comment.update({
        where: { id: commentId },
        data: { deletedAt: new Date() },
      });
    });
  }
}
