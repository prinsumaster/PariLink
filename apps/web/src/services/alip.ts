import { api } from '@/services/api';
import { ALIPDashboardData, ALIPAnomaly } from '@/types/alip';

export const alipService = {
  getDashboard: async (): Promise<ALIPDashboardData> => {
    const { data } = await api.get('/alip/dashboard');
    return data;
  },
  
  resolveAnomaly: async (id: string, resolutionNotes: string): Promise<ALIPAnomaly> => {
    const { data } = await api.post(`/alip/anomalies/${id}/resolve`, { resolutionNotes });
    return data;
  },

  applyRecommendation: async (insightId: string): Promise<boolean> => {
    const { data } = await api.post(`/alip/insights/${insightId}/apply`);
    return data.success;
  }
};
