import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import * as fs from 'fs';
import { PrismaService } from '../../prisma/prisma.service';
import { EventService } from '../events/event.service';

export interface PlatformFileUpload {
  companyId: string;
  userId: string;
  file: Express.Multer.File;
  category?: string;
  metadata?: Record<string, any>;
  referenceId?: string;
}

@Injectable()
export class FilePlatformService {
  private readonly logger = new Logger(FilePlatformService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly eventService: EventService,
  ) {}

  async processUpload(upload: PlatformFileUpload) {
    this.logger.debug(
      `[FilePlatform] Processing upload for company ${upload.companyId}`,
    );

    // Compute checksum for deduplication and integrity
    const fileBuffer = await fs.promises.readFile(upload.file.path);
    const checksum = crypto
      .createHash('sha256')
      .update(fileBuffer)
      .digest('hex');

    // Here we can hook in ClamAV virus scanning, Image optimization (sharp), etc.

    const document = await this.prisma.runAsSystem(async (tx) =>
      tx.document.create({
        data: {
          companyId: upload.companyId,
          uploadedById: upload.userId,
          fileUrl: upload.file.path, // Abstraction ready for S3
          fileName: upload.file.originalname,
          mimeType: upload.file.mimetype,
          sizeBytes: upload.file.size,
          type: upload.category || 'GENERAL',
          loadId: upload.referenceId, // If it maps to a load
          metadata: {
            ...upload.metadata,
            checksum,
          },
        },
      }),
    );

    this.eventService.publish('DocumentUploaded', {
      tenantId: upload.companyId,
      userId: upload.userId,
      correlationId: crypto.randomUUID(),
      payload: { documentId: document.id, checksum },
      timestamp: new Date(),
    });

    return document;
  }
}
