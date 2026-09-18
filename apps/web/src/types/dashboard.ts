export interface TransporterMetrics {
  totalBookings: number;
  revenueToday: number;
  outstanding: number;
  activeVehicles: number;
  topClients: TopClient[];
  recentBookings: RecentBooking[];
}

export interface TopClient {
  id: string;
  name: string;
  amount: number;
}

export interface RecentBooking {
  id: string;
  lrNumber: string | null;
  originCity: string;
  destinationCity: string;
  rate: number;
  status: string;
  createdAt: string;
}

export interface LiveVehicle {
  id: string;
  name: string;
  lat: number;
  lng: number;
  status: 'IN_TRANSIT' | 'IDLE' | 'MAINTENANCE';
  heading: number;
  speed: number;
  driverId?: string;
  shipmentId?: string;
}

export interface Alert {
  id: string;
  type: 'CRITICAL' | 'WARNING' | 'INFO';
  message: string;
  timestamp: string;
  source: string;
  isAcknowledged: boolean;
}

export interface AIRecommendation {
  id: string;
  category: 'DELAY_RISK' | 'FUEL_OPTIMIZATION' | 'SAFETY' | 'MAINTENANCE' | 'CAPACITY' | 'REVENUE_LEAKAGE';
  title: string;
  description: string;
  impactScore: number; // 0-100
  actionUrl?: string;
}

export interface ShipmentSummary {
  id: string;
  trackingNumber: string;
  status: 'PENDING' | 'IN_TRANSIT' | 'DELIVERED' | 'DELAYED' | 'EXCEPTION';
  origin: string;
  destination: string;
  eta: string;
  slaStatus: 'MET' | 'BREACHED' | 'AT_RISK';
}

export interface DashboardFilters {
  regionId?: string;
  branchId?: string;
  fleetId?: string;
  customerId?: string;
  dateRange: { start: string; end: string };
}
