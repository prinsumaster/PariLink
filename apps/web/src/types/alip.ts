export type AnomalySeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type AnomalyCategory = 'ROUTING' | 'MAINTENANCE' | 'DRIVER_BEHAVIOR' | 'WEATHER' | 'SUPPLY_CHAIN';

export interface ALIPAnomaly {
  id: string;
  timestamp: string;
  severity: AnomalySeverity;
  category: AnomalyCategory;
  description: string;
  impactScore: number; // 0-100
  affectedEntities: {
    type: 'TRIP' | 'VEHICLE' | 'DRIVER' | 'WAREHOUSE';
    id: string;
    name: string;
  }[];
  aiRecommendation: string;
  isResolved: boolean;
}

export interface PredictiveInsight {
  id: string;
  title: string;
  description: string;
  confidenceScore: number; // 0-100
  timeframe: string; // e.g. "Next 48 Hours"
  potentialCostImpact: number; // estimated USD savings if acted upon
  actionRequired: boolean;
}

export interface SystemHealth {
  status: 'OPTIMAL' | 'DEGRADED' | 'CRITICAL';
  modelLatency: number; // ms
  activeDataStreams: number;
  anomaliesDetected24h: number;
}

export interface ALIPDashboardData {
  health: SystemHealth;
  activeAnomalies: ALIPAnomaly[];
  insights: PredictiveInsight[];
}
