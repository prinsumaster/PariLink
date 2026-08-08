import { api } from '@/services/api';
import { Trip, TripFilters, PaginatedTrips } from '@/types/trips';

export const tripService = {
  getTrips: async (filters: TripFilters): Promise<PaginatedTrips> => {
    const { data } = await api.get('/trips', { params: filters });
    return data;
  },

  getTrip: async (id: string): Promise<Trip> => {
    const { data } = await api.get(`/trips/${id}`);
    return data;
  },

  createTrip: async (tripData: Partial<Trip>): Promise<Trip> => {
    const { data } = await api.post('/trips', tripData);
    return data;
  },

  updateTrip: async (id: string, tripData: Partial<Trip>): Promise<Trip> => {
    const { data } = await api.put(`/trips/${id}`, tripData);
    return data;
  },

  updateStatus: async (id: string, status: string, notes?: string): Promise<Trip> => {
    const { data } = await api.post(`/trips/${id}/status`, { status, notes });
    return data;
  },

  cancelTrip: async (id: string, reason: string): Promise<Trip> => {
    const { data } = await api.post(`/trips/${id}/cancel`, { reason });
    return data;
  },
  
  assignDriver: async (id: string, driverId: string): Promise<Trip> => {
    const { data } = await api.post(`/trips/${id}/assign-driver`, { driverId });
    return data;
  }
};
