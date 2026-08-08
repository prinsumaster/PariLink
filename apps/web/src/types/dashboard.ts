export interface KPIData {
  activeShipments: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  deliveriesToday: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  fleetUtilization: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  delayedShipments: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  revenue: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  profitMargin: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  fuelEfficiency: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  maintenanceAlerts: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  vehiclesOnline: { value: number; total: number };
  driversOnline: { value: number; total: number };
  averageEtaMinutes: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
  revenueToday: { value: number; change: number; trend: 'up' | 'down' | 'neutral' };
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
