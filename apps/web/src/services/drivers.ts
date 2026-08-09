import { api } from '@/services/api';
import { Driver, DriverFilters, PaginatedDrivers, DriverDocument } from '@/types/drivers';

export const driverService = {
  getDrivers: async (filters: DriverFilters): Promise<PaginatedDrivers> => {
    const { data } = await api.get('/drivers', { params: filters });
    return data;
  },

  getDriver: async (id: string): Promise<Driver> => {
    const { data } = await api.get(`/drivers/${id}`);
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
