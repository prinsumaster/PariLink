import { api } from '@/services/api';
import { Document, DocumentFilters, PaginatedDocuments } from '@/types/documents';

export const documentService = {
  getDocuments: async (filters: DocumentFilters): Promise<PaginatedDocuments> => {
    const { data } = await api.get('/documents', { params: filters });
    return data;
  },

  getDocument: async (id: string): Promise<Document> => {
    const { data } = await api.get(`/documents/${id}`);
    return data;
  },

  // Stub for Multipart form data upload
  uploadDocument: async (file: File, category: string, entityId?: string, tags?: string[]): Promise<Document> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('category', category);
    if (entityId) formData.append('entityId', entityId);
    if (tags && tags.length > 0) formData.append('tags', JSON.stringify(tags));

    const { data } = await api.post('/documents/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return data;
  },

  deleteDocument: async (id: string): Promise<void> => {
    await api.delete(`/documents/${id}`);
  },

  updateMetadata: async (id: string, metadata: Partial<Document>): Promise<Document> => {
    const { data } = await api.patch(`/documents/${id}`, metadata);
    return data;
  }
};
