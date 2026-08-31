import { api } from '@/services/api';
import { Driver, DriverFilters, PaginatedDrivers, DriverDocument } from '@/types/drivers';

export const driverService = {
  getDrivers: async (filters: DriverFilters): Promise<PaginatedDrivers> => {
    const { data } = await api.get('/drivers', { params: filters });
    const rawItems = Array.isArray(data) ? data : (data?.data || []);
    const items = rawItems.map((d: any) => ({
      ...d,
      name: d.name || `${d.firstName || ''} ${d.lastName || ''}`.trim(),
      safetyAnalytics: d.safetyAnalytics || (d.driverScore ? {
        driverScore: Math.round(d.driverScore.safetyScore),
        riskRating: d.driverScore.safetyScore >= 85 ? 'LOW' : d.driverScore.safetyScore >= 70 ? 'MEDIUM' : 'HIGH',
        fuelEfficiency: d.driverScore.efficiencyScore || 90,
        speedingEvents: 0,
        harshBraking: 0,
        harshCornering: 0,
        fatigueAlerts: 0,
        idleTimeMinutes: 10,
      } : {
        driverScore: 88,
        riskRating: 'LOW',
        fuelEfficiency: 92,
        speedingEvents: 0,
        harshBraking: 0,
        harshCornering: 0,
        fatigueAlerts: 0,
        idleTimeMinutes: 10,
      }),
    }));

    return {
      data: items,
      total: data?.total ?? data?.meta?.total ?? items.length,
      page: data?.meta?.page ?? filters.page ?? 1,
      limit: data?.meta?.limit ?? filters.limit ?? 20,
    };
  },

  getDriver: async (id: string): Promise<Driver> => {
    const { data } = await api.get(`/drivers/${id}`);
    return data;
  },

  delete: async (id: string) => {
    const { data } = await api.delete(`/drivers/${id}`);
    return data;
  },

  getDriverScore: async (id: string) => {
    const { data } = await api.get(`/drivers/${id}/score`);
    return data;
  },

  createDriver: async (driverData: any): Promise<Driver> => {
    const payload = { ...driverData };
    if (payload.name) {
      const nameParts = payload.name.split(' ');
      payload.firstName = nameParts[0] || '';
      payload.lastName = nameParts.slice(1).join(' ') || ' ';
      delete payload.name;
    }
    const { data } = await api.post('/drivers', payload);
    return data;
  },

  updateDriver: async (id: string, driverData: any): Promise<Driver> => {
    const payload = { ...driverData };
    if (payload.name) {
      const nameParts = payload.name.split(' ');
      payload.firstName = nameParts[0] || '';
      payload.lastName = nameParts.slice(1).join(' ') || ' ';
      delete payload.name;
    }
    const { data } = await api.patch(`/drivers/${id}`, payload);
    return data;
  },

  archiveDriver: async (id: string, reason: string): Promise<Driver> => {
    const { data } = await api.post(`/drivers/${id}/archive`, { reason });
    return data;
  },

  uploadDocument: async (driverId: string, document: Partial<DriverDocument>): Promise<DriverDocument> => {
    const { data } = await api.post(`/drivers/${driverId}/documents`, document);
    return data;
  },

  updateStatus: async (driverId: string, status: string): Promise<Driver> => {
    const { data } = await api.patch(`/drivers/${driverId}`, { status });
    return data;
  }
};
