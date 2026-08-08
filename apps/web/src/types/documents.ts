export type DocumentCategory = 'VEHICLE' | 'DRIVER' | 'SHIPMENT' | 'CUSTOMER' | 'LEGAL' | 'OTHER';
export type DocumentStatus = 'ACTIVE' | 'ARCHIVED' | 'EXPIRED' | 'PENDING_REVIEW';

export interface Document {
  id: string;
  filename: string;
  originalName: string;
  category: DocumentCategory;
  mimeType: string;
  sizeBytes: number;
  url: string; // S3 or CDN link
  uploadedBy: string; // User name
  status: DocumentStatus;
  version: number;
  tags: string[];
  entityId?: string; // e.g. Driver ID or Order ID
  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DocumentFilters {
  search?: string;
  category?: DocumentCategory[];
  status?: DocumentStatus[];
  tags?: string[];
  page?: number;
  limit?: number;
  sortBy?: 'createdAt' | 'filename' | 'sizeBytes';
  sortDesc?: boolean;
}

export interface PaginatedDocuments {
  data: Document[];
  total: number;
  page: number;
  limit: number;
}
