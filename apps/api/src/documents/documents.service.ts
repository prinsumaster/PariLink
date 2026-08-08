import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from './services/storage.service';
import { AuditService } from '../platform/audit/audit.service';
import { EventStoreService } from '../platform/digital-twin/event-store.service';

@Injectable()
export class DocumentsService {
  private readonly logger = new Logger(DocumentsService.name);

  constructor(
    private prisma: PrismaService,
    private storage: StorageService,
    private readonly auditService: AuditService,
    private readonly eventStore: EventStoreService,
  ) {}

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
      const fileUrl = await this.storage.upload(
        file.buffer,
        file.originalname,
        file.mimetype,
        companyId,
      );
      let parsedTags = [];
      try {
        if (body.tags) parsedTags = JSON.parse(body.tags);
      } catch (err: any) {
        const errorMessage = err?.message || 'Unknown error';
        this.logger.error(
          `Failed to handle document processing: ${errorMessage}`,
        );
      }

      if (body.loadId) {
        const load = await tx.load.findFirst({
          where: { id: body.loadId, companyId },
        });
        if (!load)
          throw new BadRequestException('Load not found or unauthorized');
      }

      if (body.folderId) {
        const folder = await tx.documentFolder.findFirst({
          where: { id: body.folderId, companyId },
        });
        if (!folder)
          throw new BadRequestException('Folder not found or unauthorized');
      }
      const document = await tx.document.create({
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

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'Document',
          entityType: 'Document',
          entityId: document.id,
          action: 'CREATE',
          details: { fileName: file.originalname },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'DOCUMENT',
        streamId: document.id,
        eventType: 'DocumentUploaded',
        payload: { fileName: file.originalname },
        userId,
      });

      return document;
    });
  }

  async getLoadDocuments(companyId: string, loadId: string) {
    return this.prisma.runAsTenant(companyId, async (tx) => {
      return tx.document.findMany({
        where: { loadId, companyId },
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
        where: { entityType, entityId, companyId },
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
      const folder = await tx.documentFolder.create({
        data: {
          companyId,
          name,
          parentId: parentId || null,
        },
      });

      await this.auditService.logEvent(
        {
          companyId,
          entity: 'DocumentFolder',
          entityType: 'DocumentFolder',
          entityId: folder.id,
          action: 'CREATE',
          details: { name },
          source: 'API',
        },
        null,
        tx,
      );

      await this.eventStore.append({
        tenantId: companyId,
        streamType: 'DOCUMENT_FOLDER',
        streamId: folder.id,
        eventType: 'FolderCreated',
        payload: { name },
      });

      return folder;
    });
  }
}
