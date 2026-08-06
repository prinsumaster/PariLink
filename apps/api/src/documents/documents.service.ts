import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DocumentsService {
  constructor(private prisma: PrismaService) {}

  async uploadDocument(
    companyId: string,
    userId: string,
    file: Express.Multer.File,
    body: {
      loadId?: string;
      entityId?: string;
      entityType?: string;
      type: string;
      folderId?: string;
      tags?: string;
    },
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      const fileUrl = `/uploads/${file.filename}`;
      let parsedTags = [];
      try {
        if (body.tags) parsedTags = JSON.parse(body.tags);
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : String(error);
        console.error(`Failed to handle document processing: ${errorMessage}`);
      }
      return tx.document.create({
        data: {
          companyId,
          loadId: body.loadId || null,
          entityId: body.entityId || null,
          entityType: body.entityType || null,
          type: body.type,
          fileUrl,
          fileName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          uploadedById: userId,
          folderId: body.folderId || null,
          tags: parsedTags,
        },
      });
    });
  }

  async getLoadDocuments(companyId: string, loadId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.document.findMany({
        where: { loadId },
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });
    });
  }

  async getEntityDocuments(
    companyId: string,
    entityType: string,
    entityId: string,
  ) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.document.findMany({
        where: { entityType, entityId },
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: {
            select: { id: true, firstName: true, lastName: true },
          },
        },
      });
    });
  }

  async getAllDocuments(companyId: string, folderId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.document.findMany({
        where: {
          companyId,
          folderId: folderId || null,
        },
        orderBy: { createdAt: 'desc' },
        include: {
          uploadedBy: { select: { id: true, firstName: true, lastName: true } },
        },
      });
    });
  }

  // Folders API
  async getFolders(companyId: string, parentId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.documentFolder.findMany({
        where: {
          companyId,
          parentId: parentId || null,
        },
        orderBy: { name: 'asc' },
      });
    });
  }

  async createFolder(companyId: string, name: string, parentId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.documentFolder.create({
        data: {
          companyId,
          name,
          parentId: parentId || null,
        },
      });
    });
  }
}
