import { api } from '@/services/api';
import { Vehicle, FleetFilters, PaginatedFleet, VehicleDocument, MaintenanceRecord } from '@/types/fleet';

export const fleetService = {
  getVehicles: async (filters: FleetFilters): Promise<PaginatedFleet> => {
    const { data } = await api.get('/vehicles', { params: filters });
    if (data && data.data) {
      data.data = data.data.map((v: any) => ({
        ...v,
        registrationNumber: v.licensePlate || v.registrationNumber,
        capacity: v.capacityWeight || v.capacity,
      }));
    }
    return data;
  },

  getVehicle: async (id: string): Promise<Vehicle> => {
    const { data } = await api.get(`/vehicles/${id}`);
    return {
      ...data,
      registrationNumber: data.licensePlate || data.registrationNumber,
      capacity: data.capacityWeight || data.capacity,
    };
  },

  createVehicle: async (vehicleData: any): Promise<Vehicle> => {
    const payload = {
      ...vehicleData,
      licensePlate: vehicleData.registrationNumber || vehicleData.licensePlate,
      capacityWeight: vehicleData.capacity || vehicleData.capacityWeight,
    };
    delete payload.registrationNumber;
    delete payload.capacity;
    delete payload.axles;
    delete payload.odometer;
    const { data } = await api.post('/vehicles', payload);
    return {
      ...data,
      registrationNumber: data.licensePlate || data.registrationNumber,
      capacity: data.capacityWeight || data.capacity,
    };
  },

  updateVehicle: async (id: string, vehicleData: any): Promise<Vehicle> => {
    const payload = {
      ...vehicleData,
      ...(vehicleData.registrationNumber && { licensePlate: vehicleData.registrationNumber }),
      ...(vehicleData.capacity !== undefined && { capacityWeight: vehicleData.capacity }),
    };
    delete payload.registrationNumber;
    delete payload.capacity;
    delete payload.axles;
    delete payload.odometer;
    const { data } = await api.patch(`/vehicles/${id}`, payload);
    return {
      ...data,
      registrationNumber: data.licensePlate || data.registrationNumber,
      capacity: data.capacityWeight || data.capacity,
    };
  },

  archiveVehicle: async (id: string, reason: string): Promise<Vehicle> => {
    const { data } = await api.post(`/vehicles/${id}/archive`, { reason });
    return data;
  },

  // Document Management
  uploadDocument: async (vehicleId: string, document: Partial<VehicleDocument>): Promise<VehicleDocument> => {
    const { data } = await api.post(`/vehicles/${vehicleId}/documents`, document);
    return data;
  },

  // Maintenance
  addMaintenanceRecord: async (vehicleId: string, record: Partial<MaintenanceRecord>): Promise<MaintenanceRecord> => {
    const { data } = await api.post(`/vehicles/${vehicleId}/maintenance`, record);
    return data;
  }
};
