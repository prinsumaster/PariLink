import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { CreateFolderDto, UpdateFolderDto } from '../dto/document.dto';

@Injectable()
export class DocumentFolderService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async createFolder(companyId: string, userId: string, dto: CreateFolderDto) {
    if (dto.parentId) {
      const parent = await this.prisma.runAsTenant(companyId, async (tx) =>
        tx.documentFolder.findUnique({ where: { id: dto.parentId } }),
      );
      if (!parent || parent.companyId !== companyId) {
        throw new NotFoundException('Parent folder not found');
      }
    }

    const folder = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.create({
        data: {
          companyId,
          name: dto.name,
          parentId: dto.parentId || null,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:folder:create',
      entity: 'DocumentFolder',
      entityId: folder.id,
      userId,
      companyId,
      details: { name: folder.name, parentId: folder.parentId },
    });

    return folder;
  }

  async getFolders(companyId: string, parentId?: string) {
    return this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.findMany({
        where: {
          companyId,
          parentId: parentId || null,
        },
        include: {
          _count: {
            select: {
              subFolders: true,
              documents: {},
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
    );
  }

  async getFolderTree(companyId: string) {
    const allFolders = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.findMany({
        where: { companyId },
        orderBy: { name: 'asc' },
      }),
    );

    const folderMap = new Map<string, any>();
    allFolders.forEach((f) => folderMap.set(f.id, { ...f, subFolders: [] }));

    const rootFolders: any[] = [];
    folderMap.forEach((folder) => {
      if (folder.parentId && folderMap.has(folder.parentId)) {
        folderMap.get(folder.parentId).subFolders.push(folder);
      } else {
        rootFolders.push(folder);
      }
    });

    return rootFolders;
  }

  async updateFolder(
    companyId: string,
    id: string,
    userId: string,
    dto: UpdateFolderDto,
  ) {
    const folder = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.findFirst({ where: { id, companyId } }),
    );
    if (!folder || folder.companyId !== companyId) {
      throw new NotFoundException('Folder not found');
    }

    if (dto.parentId === id) {
      throw new BadRequestException('A folder cannot be its own parent');
    }

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.updateMany({
        where: { id, companyId },
        data: {
          name: dto.name,
          parentId: dto.parentId !== undefined ? dto.parentId : folder.parentId,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:folder:update',
      entity: 'DocumentFolder',
      entityId: id,
      userId,
      companyId,
      details: { updates: dto },
    });

    return updated;
  }

  async deleteFolder(companyId: string, id: string, userId: string) {
    const folder = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.findUnique({
        where: { id },
        include: {
          subFolders: true,
          documents: {},
        },
      }),
    );
    if (!folder || folder.companyId !== companyId) {
      throw new NotFoundException('Folder not found');
    }

    if (folder.subFolders.length > 0 || folder.documents.length > 0) {
      throw new BadRequestException(
        'Cannot delete non-empty folder. Move or remove items first.',
      );
    }

    await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentFolder.deleteMany({
        where: { id, companyId },
      }),
    );

    await this.audit.logEvent({
      action: 'document:folder:delete',
      entity: 'DocumentFolder',
      entityId: id,
      userId,
      companyId,
      details: { name: folder.name },
    });

    return { success: true, id };
  }

  async moveDocument(
    companyId: string,
    documentId: string,
    folderId: string | null,
    userId: string,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId) {
      throw new NotFoundException('Document not found');
    }

    if (folderId) {
      const targetFolder = await this.prisma.runAsTenant(
        companyId,
        async (tx) => tx.documentFolder.findUnique({ where: { id: folderId } }),
      );
      if (!targetFolder || targetFolder.companyId !== companyId) {
        throw new NotFoundException('Target folder not found');
      }
    }

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.update({
        where: { id: documentId },
        data: { folderId },
      }),
    );

    await this.audit.logEvent({
      action: 'document:move',
      entity: 'Document',
      entityId: documentId,
      userId,
      companyId,
      details: { previousFolderId: doc.folderId, newFolderId: folderId },
    });

    return updated;
  }
}
