import { api } from './api';

export interface FuelAnomaly {
  entityType: 'TRIP' | 'TRUCK' | 'DRIVER';
  entityId: string;
  entityName: string;
  variancePct: number;
  cause: string;
  description: string;
  severity: 'HIGH' | 'MEDIUM' | 'LOW';
}

export interface FuelSummary {
  worstTrucks: FuelAnomaly[];
  worstDrivers: FuelAnomaly[];
  criticalTrips: FuelAnomaly[];
  totalAnomalies: number;
}

export const intelligenceService = {
  getFuelAnomalies: async (): Promise<FuelAnomaly[]> => {
    const { data } = await api.get('/intelligence/fuel/anomalies');
    return data;
  },
  
  getFuelSummary: async (): Promise<FuelSummary> => {
    const { data } = await api.get('/intelligence/fuel/summary');
    return data;
  }
};
