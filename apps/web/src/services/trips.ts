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
    const { data } = await api.patch(`/trips/${id}`, tripData);
    return data;
  },

  updateStatus: async (id: string, status: string, notes?: string): Promise<Trip> => {
    const { data } = await api.patch(`/trips/${id}`, { status, notes });
    return data;
  },

  cancelTrip: async (id: string, reason: string): Promise<Trip> => {
    const { data } = await api.patch(`/trips/${id}`, { status: 'CANCELLED', notes: reason });
    return data;
  },
  
  assignDriver: async (id: string, driverId: string): Promise<Trip> => {
    const { data } = await api.patch(`/trips/${id}`, { driverId });
    return data;
  },

  getTripDesks: async (id: string): Promise<any[]> => {
    const { data } = await api.get(`/trips/${id}/desks`);
    return data;
  },

  completeDesk: async (id: string, desk: string, notes?: string): Promise<any> => {
    const { data } = await api.post(`/trips/${id}/desks/${desk}/complete`, { notes });
    return data;
  },

  getMyDesks: async (): Promise<any[]> => {
    const { data } = await api.get(`/desks/my`);
    return data;
  },

  closeTrip: async (id: string): Promise<Trip> => {
    const { data } = await api.post(`/trips/${id}/close`);
    return data;
  },

  submitDriverScore: async (id: string, scoreData: { onTime: boolean; podUploaded: boolean; fuelScore: number; damageScore: number; behaviourScore: number }) => {
    const { data } = await api.post(`/trips/${id}/driver-score`, scoreData);
    return data;
  },

  getLoadingEvents: async (id: string): Promise<any[]> => {
    const { data } = await api.get(`/trips/${id}/loading`);
    return data;
  },

  addLoadingEvent: async (id: string, eventData: any): Promise<any> => {
    const { data } = await api.post(`/trips/${id}/loading`, eventData);
    return data;
  },

  getFuel: async (tripId: string) => {
    const { data } = await api.get(`/trips/${tripId}/fuel`);
    return data;
  },

  addFuel: async (tripId: string, payload: any) => {
    const { data } = await api.post(`/trips/${tripId}/fuel`, payload);
    return data;
  }
};
