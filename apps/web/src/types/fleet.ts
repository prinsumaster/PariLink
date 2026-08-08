export type VehicleStatus = 'AVAILABLE' | 'IN_USE' | 'MAINTENANCE' | 'OUT_OF_SERVICE' | 'ARCHIVED';
export type VehicleType = 'TRUCK' | 'VAN' | 'TRAILER' | 'MOTORCYCLE';
export type MaintenanceStatus = 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'OVERDUE';

export interface VehicleLocation {
  lat: number;
  lng: number;
  heading: number;
  speed: number;
  lastUpdated: string;
}

export interface VehicleDocument {
  id: string;
  type: 'INSURANCE' | 'FITNESS' | 'POLLUTION' | 'RC_BOOK' | 'PERMIT_NATIONAL' | 'PERMIT_STATE';
  documentNumber: string;
  issuedDate: string;
  expiryDate: string;
  fileUrl?: string;
  isExpiringSoon: boolean;
  isExpired: boolean;
}

export interface MaintenanceRecord {
  id: string;
  title: string;
  description: string;
  scheduledDate: string;
  completedDate?: string;
  status: MaintenanceStatus;
  cost?: number;
  odometerReading: number;
}

export interface Vehicle {
  id: string;
  registrationNumber: string;
  type: VehicleType;
  make: string;
  model: string;
  year: number;
  capacity: number; // in kg
  axles: number;
  ownerId?: string;
  currentDriverId?: string;
  status: VehicleStatus;
  location?: VehicleLocation;
  fuelLevel: number; // percentage 0-100
  odometer: number;
  engineHours: number;
  batteryStatus: 'GOOD' | 'WARNING' | 'CRITICAL';
  gpsStatus: 'ONLINE' | 'OFFLINE' | 'POOR_SIGNAL';
  documents: VehicleDocument[];
  maintenanceHistory: MaintenanceRecord[];
  createdAt: string;
  updatedAt: string;
}

export interface FleetFilters {
  status?: VehicleStatus[];
  type?: VehicleType[];
  search?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedFleet {
  data: Vehicle[];
  total: number;
  page: number;
  limit: number;
}
