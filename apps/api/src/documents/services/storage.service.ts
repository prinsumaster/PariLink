import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs/promises';
import * as path from 'path';
import { extname } from 'path';
import { validateFileBuffer } from '../../platform/files/file.interceptor';

export interface StorageAdapter {
  upload(
    file: Buffer,
    filename: string,
    mimeType: string,
    tenantId: string,
  ): Promise<string>;
  delete(fileUrl: string, tenantId: string): Promise<void>;
  getSignedUrl(
    fileUrl: string,
    tenantId: string,
    expiresInSeconds?: number,
  ): Promise<string>;
}

/**
 * Enterprise Storage Abstraction Layer
 * Supports multi-tenant isolated buckets dynamically resolving to S3/MinIO/Local
 */
@Injectable()
export class StorageService implements StorageAdapter {
  private readonly logger = new Logger(StorageService.name);
  private readonly baseUploadDir = path.join(process.cwd(), 'uploads');

  constructor() {
    this.initializeStorageDir();
  }

  private async initializeStorageDir() {
    try {
      await fs.mkdir(this.baseUploadDir, { recursive: true });
    } catch (error) {
      this.logger.error('Failed to initialize local storage directory', error);
    }
  }

  async upload(
    file: Buffer,
    filename: string,
    mimeType: string,
    tenantId: string,
  ): Promise<string> {
    // In a production enterprise system, this dynamically resolves the tenant's preferred storage backend.
    // For now, we fallback to local isolated tenant directories.
    const tenantDir = path.join(this.baseUploadDir, tenantId);

    // 1. Verify magic bytes and zip bomb logic
    const safeExt = extname(filename).toLowerCase();
    const validation = validateFileBuffer(file, safeExt);
    if (!validation.valid) {
      this.logger.error(`Magic byte validation failed: ${validation.reason}`);
      throw new Error(`File upload rejected: ${validation.reason}`);
    }

    try {
      await fs.mkdir(tenantDir, { recursive: true });
      const uniqueFilename = `${Date.now()}-${filename.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
      const filePath = path.join(tenantDir, uniqueFilename);

      await fs.writeFile(filePath, file);

      // Return a virtual path that the DocumentController will serve
      return `/api/v1/storage/${tenantId}/${uniqueFilename}`;
    } catch (error) {
      this.logger.error(`Storage upload failed for tenant ${tenantId}`, error);
      throw new Error('Storage abstraction failed to persist file');
    }
  }

  async delete(fileUrl: string, tenantId: string): Promise<void> {
    try {
      // Extract filename from the virtual path
      const filename = fileUrl.split('/').pop();
      if (!filename) return;

      const filePath = path.join(this.baseUploadDir, tenantId, filename);
      await fs.unlink(filePath);
      this.logger.debug(`Deleted file ${filePath}`);
    } catch (error) {
      // Ignore ENOENT if file is already gone
      if ((error as any).code !== 'ENOENT') {
        this.logger.error(`Storage delete failed for ${fileUrl}`, error);
      }
    }
  }

  async getSignedUrl(
    fileUrl: string,
    tenantId: string,
    expiresInSeconds = 3600,
  ): Promise<string> {
    // Enterprise feature: Generate temporary access signatures for private documents
    // When connected to AWS S3, this returns a presigned URL.
    // Locally, we just return the endpoint (assuming auth middleware guards it)
    return fileUrl;
  }
}
