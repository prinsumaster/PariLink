import { api } from '@/services/api';
import { DashboardMetrics, ReportFilters } from '@/types/reports';

export const reportsService = {
  getDashboardMetrics: async (filters: ReportFilters): Promise<DashboardMetrics> => {
    const { data } = await api.get('/reports/dashboard', { params: filters });
    return data;
  },
  
  exportReport: async (reportType: string, filters: ReportFilters, format: 'csv' | 'pdf'): Promise<Blob> => {
    const { data } = await api.get(`/reports/export/${reportType}`, { 
      params: { ...filters, format },
      responseType: 'blob' 
    });
    return data;
  }
};
