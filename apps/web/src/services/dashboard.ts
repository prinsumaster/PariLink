import { api } from '@/services/api';
import { KPIData, LiveVehicle, Alert, AIRecommendation, ShipmentSummary, DashboardFilters } from '@/types/dashboard';

export const dashboardService = {
  getKPIs: async (filters?: DashboardFilters): Promise<KPIData> => {
    const { data } = await api.get('/dashboard/kpis', { params: filters });
    return data;
  },

  getLiveVehicles: async (filters?: DashboardFilters): Promise<LiveVehicle[]> => {
    const { data } = await api.get('/dashboard/vehicles', { params: filters });
    return data;
  },

  getAlerts: async (filters?: DashboardFilters): Promise<Alert[]> => {
    const { data } = await api.get('/dashboard/alerts', { params: filters });
    return data;
  },
  
  acknowledgeAlert: async (alertId: string): Promise<void> => {
    await api.post(`/dashboard/alerts/${alertId}/acknowledge`);
  },

  getAIRecommendations: async (filters?: DashboardFilters): Promise<AIRecommendation[]> => {
    const { data } = await api.get('/dashboard/ai/recommendations', { params: filters });
    return data;
  },

  getShipments: async (filters?: DashboardFilters): Promise<ShipmentSummary[]> => {
    const { data } = await api.get('/dashboard/shipments', { params: filters });
    return data;
  }
};
