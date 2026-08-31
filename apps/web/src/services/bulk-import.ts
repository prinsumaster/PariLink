import { api } from './api';

export type ImportType = 'vehicles' | 'drivers' | 'customers' | 'vendors' | 'opening-balances';

export interface ImportRowResult {
  row: number;
  status: 'imported' | 'skipped';
  reason?: string;
  data?: Record<string, unknown>;
}

export interface ImportReport {
  importType: ImportType;
  totalRows: number;
  imported: number;
  skipped: number;
  results: ImportRowResult[];
}

export const bulkImportService = {
  downloadTemplate: (type: ImportType): string => {
    // Returns URL to download (open in new tab)
    return `${process.env.NEXT_PUBLIC_API_URL || '/api/v1'}/import/${type}/template`;
  },

  uploadFile: async (type: ImportType, file: File): Promise<ImportReport> => {
    const formData = new FormData();
    formData.append('file', file);

    const { data } = await api.post<ImportReport>(`/import/${type}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 60_000, // Large files may take longer
    });
    return data;
  },
};
