import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { AuditService } from '../../platform/audit/audit.service';
import { CheckoutDocumentDto, CheckinDocumentDto } from '../dto/document.dto';

@Injectable()
export class DocumentVersionService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  async checkout(
    companyId: string,
    documentId: string,
    userId: string,
    dto: CheckoutDocumentDto,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (doc.isLocked && doc.lockedById !== userId) {
      throw new ForbiddenException(
        `Document is currently locked for editing by user ${doc.lockedById}`,
      );
    }

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.update({
        where: { id: documentId },
        data: {
          isLocked: true,
          lockedById: userId,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:checkout',
      entity: 'Document',
      entityId: documentId,
      userId,
      companyId,
      details: { lockReason: dto.lockReason },
    });

    return updated;
  }

  async checkin(
    companyId: string,
    documentId: string,
    userId: string,
    file: Express.Multer.File,
    dto: CheckinDocumentDto,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (doc.isLocked && doc.lockedById !== userId) {
      throw new ForbiddenException(
        `Document is locked by user ${doc.lockedById}. You cannot check in a new version.`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Archive previous version
      await tx.documentVersion.create({
        data: {
          documentId,
          version: doc.version,
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          sizeBytes: doc.sizeBytes,
          mimeType: doc.mimeType,
          uploadedById: doc.uploadedById || userId,
          changeSummary: dto.changeSummary,
        },
      });

      const newVersion = doc.version + 1;
      const fileUrl = `/uploads/${file.filename}`;

      const updatedDoc = await tx.document.update({
        where: { id: documentId },
        data: {
          version: newVersion,
          fileUrl,
          fileName: file.originalname,
          mimeType: file.mimetype,
          sizeBytes: file.size,
          uploadedById: userId,
          isLocked: false,
          lockedById: null,
        },
      });

      await this.audit.logEvent({
        action: 'document:checkin',
        entity: 'Document',
        entityId: documentId,
        userId,
        companyId,
        details: {
          newVersion,
          changeSummary: dto.changeSummary,
          fileName: file.originalname,
        },
      });

      return updatedDoc;
    });
  }

  async unlock(
    companyId: string,
    documentId: string,
    userId: string,
    isAdmin: boolean = false,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (!doc.isLocked) {
      return doc;
    }

    if (doc.lockedById !== userId && !isAdmin) {
      throw new ForbiddenException(
        'Only the locking user or an administrator can force unlock this document',
      );
    }

    const updated = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.update({
        where: { id: documentId },
        data: {
          isLocked: false,
          lockedById: null,
        },
      }),
    );

    await this.audit.logEvent({
      action: 'document:unlock',
      entity: 'Document',
      entityId: documentId,
      userId,
      companyId,
      details: { forcedByAdmin: isAdmin && doc.lockedById !== userId },
    });

    return updated;
  }

  async getVersionHistory(companyId: string, documentId: string) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    const archivedVersions = await this.prisma.runAsTenant(
      companyId,
      async (tx) =>
        tx.documentVersion.findMany({
          where: { documentId },
          orderBy: { version: 'desc' },
        }),
    );

    const currentVersion = {
      id: doc.id,
      documentId: doc.id,
      version: doc.version,
      fileUrl: doc.fileUrl,
      fileName: doc.fileName,
      sizeBytes: doc.sizeBytes,
      mimeType: doc.mimeType,
      uploadedById: doc.uploadedById,
      changeSummary: 'Current active version',
      createdAt: doc.updatedAt,
      isCurrent: true,
    };

    return [
      currentVersion,
      ...archivedVersions.map((v) => ({ ...v, isCurrent: false })),
    ];
  }

  async revertToVersion(
    companyId: string,
    documentId: string,
    targetVersion: number,
    userId: string,
  ) {
    const doc = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.document.findUnique({ where: { id: documentId } }),
    );
    if (!doc || doc.companyId !== companyId || doc.deletedAt) {
      throw new NotFoundException('Document not found');
    }

    if (doc.isLocked && doc.lockedById !== userId) {
      throw new ForbiddenException('Cannot revert a locked document');
    }

    if (targetVersion >= doc.version) {
      throw new BadRequestException(
        'Can only revert to an older version number',
      );
    }

    const archived = await this.prisma.runAsTenant(companyId, async (tx) =>
      tx.documentVersion.findFirst({
        where: { documentId, version: targetVersion },
      }),
    );
    if (!archived) {
      throw new NotFoundException(
        `Version ${targetVersion} not found in archive`,
      );
    }

    return this.prisma.$transaction(async (tx) => {
      // Archive current before reverting
      await tx.documentVersion.create({
        data: {
          documentId,
          version: doc.version,
          fileUrl: doc.fileUrl,
          fileName: doc.fileName,
          sizeBytes: doc.sizeBytes,
          mimeType: doc.mimeType,
          uploadedById: doc.uploadedById || userId,
          changeSummary: `Reverted to version ${targetVersion}`,
        },
      });

      const newVersion = doc.version + 1;
      const updatedDoc = await tx.document.update({
        where: { id: documentId },
        data: {
          version: newVersion,
          fileUrl: archived.fileUrl,
          fileName: archived.fileName,
          sizeBytes: archived.sizeBytes,
          mimeType: archived.mimeType,
          uploadedById: userId,
          isLocked: false,
          lockedById: null,
        },
      });

      await this.audit.logEvent({
        action: 'document:revert_version',
        entity: 'Document',
        entityId: documentId,
        userId,
        companyId,
        details: {
          revertedFrom: doc.version,
          revertedTo: targetVersion,
          newVersion,
        },
      });

      return updatedDoc;
    });
  }
}
