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

export type RootCauseType = 'DRIVER' | 'MECHANICAL' | 'ROUTE' | 'INVESTIGATE' | 'INSUFFICIENT_DATA' | 'NORMAL';

export interface FuelRootCauseEntry {
  fuelEntryId: string;
  tripId: string;
  driverId: string;
  driverName: string;
  vehicleId: string;
  licensePlate: string;
  routeKey: string | null;
  litres: number;
  expectedLitres: number | null;
  variancePct: number | null;
  rootCause: RootCauseType;
  confidence: 'HIGH' | 'LOW';
  comparisonGroupSize: number;
  explanation: string;
}

export const intelligenceService = {
  getFuelAnomalies: async (): Promise<FuelAnomaly[]> => {
    const { data } = await api.get('/intelligence/fuel/anomalies');
    return Array.isArray(data) ? data : [];
  },

  getFuelSummary: async (): Promise<FuelSummary> => {
    const { data } = await api.get('/intelligence/fuel/summary');
    return data;
  },

  getFuelRootCause: async (): Promise<FuelRootCauseEntry[]> => {
    const { data } = await api.get('/intelligence/fuel/root-cause');
    return Array.isArray(data) ? data : [];
  },
};
