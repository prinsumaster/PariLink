export type TripStatus = 'DRAFT' | 'PLANNED' | 'ASSIGNED' | 'IN_TRANSIT' | 'AT_PICKUP' | 'AT_DELIVERY' | 'COMPLETED' | 'CANCELLED' | 'DELAYED' | 'EXCEPTION';

export interface Location {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
}

export interface Trip {
  id: string;
  tripNumber?: string;
  trackingNumber: string;
  status: TripStatus;
  origin?: Location;
  destination?: Location;
  loads?: { originCity?: string; destinationCity?: string; }[];
  driverId?: string;
  vehicleId?: string;
  shipmentId?: string;
  startDate?: string;
  endDate?: string;
  eta?: string;
  startOdometer?: number;
  endOdometer?: number;
  estimatedDistance?: number;
  actualDistance?: number;
  fuelExpenses?: number;
  otherExpenses?: number;
  notes?: string;
  slaStatus?: 'MET' | 'BREACHED' | 'AT_RISK';
  createdAt: string;
  updatedAt: string;
}

export interface TripFilters {
  status?: TripStatus[];
  dateRange?: { start: string; end: string };
  search?: string;
  driverId?: string;
  vehicleId?: string;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortDesc?: boolean;
}

export interface PaginatedTrips {
  data: Trip[];
  total: number;
  page: number;
  limit: number;
}
