import { api } from './api';

// ─────────────────────────────────────────────────────────────────────────────
// Operations API Service Layer
// Connects to all 10 backend observability modules via REST.
// ─────────────────────────────────────────────────────────────────────────────

export const operationsApi = {
  // MODULE 1: Health
  getGlobalHealth: () => api.get('/operations/health/global'),
  getApiHealth: () => api.get('/operations/health/api'),
  getDatabaseHealth: () => api.get('/operations/health/database'),
  getQueueHealth: () => api.get('/operations/health/queues'),

  // MODULE 2: Metrics
  getDashboardMetrics: () => api.get('/operations/metrics/dashboard'),
  getSystemMetrics: () => api.get('/operations/metrics/system'),
  getTenantMetrics: () => api.get('/operations/metrics/tenant'),
  queryMetrics: (filter: Record<string, unknown>) => api.post('/operations/metrics/query', filter),

  // MODULE 3: Tracing
  searchTraces: (filter: Record<string, unknown>) => api.post('/operations/tracing/search', filter),
  getTrace: (traceId: string) => api.get(`/operations/tracing/trace/${traceId}`),
  getSlowestSpans: (limit = 20) => api.get(`/operations/tracing/slowest?limit=${limit}`),

  // MODULE 4: Logging
  searchLogs: (filter: Record<string, unknown>) => api.post('/operations/logs/search', filter),
  getErrorGroups: () => api.get('/operations/logs/error-groups'),
  exportLogs: (filter: Record<string, unknown>) => api.post('/operations/logs/export', filter),

  // MODULE 5: Alerts
  triggerAlert: (data: Record<string, unknown>) => api.post('/operations/alerts/trigger', data),
  acknowledgeAlert: (id: string) => api.post(`/operations/alerts/${id}/ack`),
  resolveAlert: (id: string) => api.post(`/operations/alerts/${id}/resolve`),

  // MODULE 6: Incidents
  createIncident: (data: Record<string, unknown>) => api.post('/operations/incidents', data),
  getIncidentMetrics: () => api.get('/operations/incidents/metrics'),
  getIncident: (id: string) => api.get(`/operations/incidents/${id}`),
  updateIncidentStatus: (id: string, data: Record<string, unknown>) => api.post(`/operations/incidents/${id}/status`, data),
  addTimelineEvent: (id: string, data: Record<string, unknown>) => api.post(`/operations/incidents/${id}/timeline`, data),
  savePostmortem: (id: string, data: Record<string, unknown>) => api.post(`/operations/incidents/${id}/postmortem`, data),

  // MODULE 7: Backup
  startBackup: (data: Record<string, unknown>) => api.post('/operations/backup/start', data),
  verifyBackup: (id: string) => api.get(`/operations/backup/${id}/verify`),
  restoreBackup: (id: string, data?: Record<string, unknown>) => api.post(`/operations/backup/${id}/restore`, data || {}),

  // MODULE 8: Disaster Recovery
  createDrPlan: (data: Record<string, unknown>) => api.post('/operations/dr/plans', data),
  startDrDrill: (data: Record<string, unknown>) => api.post('/operations/dr/drills', data),
  getDrReadiness: () => api.get('/operations/dr/readiness'),

  // MODULE 9: Performance
  getSlowQueries: (limit = 20) => api.get(`/operations/performance/slow-queries?limit=${limit}`),
  getResourceUtilization: () => api.get('/operations/performance/resource-utilization'),
  getCachePerformance: () => api.get('/operations/performance/cache'),
  getWorkflowPerformance: () => api.get('/operations/performance/workflows'),

  // MODULE 10: Dashboard
  getDashboardSnapshot: () => api.get('/operations/dashboard/snapshot'),
};
