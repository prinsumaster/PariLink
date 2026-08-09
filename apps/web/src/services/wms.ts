import { api } from '@/services/api';
import { Warehouse, WMSFilters, PaginatedWarehouses } from '@/types/wms';

export const wmsService = {
  getWarehouses: async (filters: WMSFilters): Promise<PaginatedWarehouses> => {
    const { data } = await api.get('/warehouse', { params: filters });
    return data;
  },

  getWarehouse: async (id: string): Promise<Warehouse> => {
    const { data } = await api.get(`/warehouse/${id}`);
    return data;
  },

  createWarehouse: async (warehouseData: Partial<Warehouse>): Promise<Warehouse> => {
    const { data } = await api.post('/warehouse', warehouseData);
    return data;
  },

  updateWarehouse: async (id: string, warehouseData: Partial<Warehouse>): Promise<Warehouse> => {
    const { data } = await api.patch(`/warehouse/${id}`, warehouseData);
    return data;
  },

  updateWarehouseStatus: async (id: string, status: string): Promise<Warehouse> => {
    const { data } = await api.patch(`/warehouse/${id}`, { status });
    return data;
  },

  archiveWarehouse: async (id: string, reason: string): Promise<Warehouse> => {
    const { data } = await api.post(`/warehouse/${id}/archive`, { reason });
    return data;
  }
};
