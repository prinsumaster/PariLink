export interface KPI {
  title: string;
  value: string | number;
  change: number; // percentage change, e.g. 5.2 or -1.4
  trend: 'up' | 'down' | 'neutral';
  format?: 'currency' | 'number' | 'percentage';
}

export interface RevenueDataPoint {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export interface FleetUtilizationPoint {
  date: string;
  active: number;
  maintenance: number;
  idle: number;
}

export interface RegionalPerformance {
  region: string;
  deliveries: number;
  onTimePercentage: number;
  revenue: number;
}

export interface DashboardMetrics {
  kpis: KPI[];
  revenueData: RevenueDataPoint[];
  fleetData: FleetUtilizationPoint[];
  regionalData: RegionalPerformance[];
  lastUpdated: string;
}

export interface ReportFilters {
  timeframe: '7d' | '30d' | '90d' | 'ytd' | '1y';
  region?: string;
  department?: string;
}
