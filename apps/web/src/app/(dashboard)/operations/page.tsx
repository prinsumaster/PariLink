'use client';

import { useEffect, useState, useCallback } from 'react';
import { operationsApi } from '@/services/operations';

// ─── Status helpers ───────────────────────────────────────────────────────────
function StatusDot({ status }: { status: string }) {
  const colors: Record<string, string> = {
    HEALTHY: 'bg-emerald-400',
    DEGRADED: 'bg-amber-400',
    UNHEALTHY: 'bg-red-500',
    DOWN: 'bg-red-600',
    UP: 'bg-emerald-400',
  };
  return (
    <span className={`inline-block w-2.5 h-2.5 rounded-full ${colors[status] ?? 'bg-slate-400'} ring-2 ring-current/20`} />
  );
}

function SeverityBadge({ severity }: { severity: string }) {
  const styles: Record<string, string> = {
    CRITICAL: 'bg-red-500/20 text-red-300 border-red-500/30',
    HIGH: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
    MEDIUM: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
    LOW: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  };
  return (
    <span className={`px-2 py-0.5 rounded text-xs font-semibold border ${styles[severity] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}>
      {severity}
    </span>
  );
}

function StatCard({ label, value, sub, accent }: { label: string; value: string | number; sub?: string; accent?: string }) {
  return (
    <div className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-5 backdrop-blur-sm">
      <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-1">{label}</p>
      <p className={`text-3xl font-bold ${accent ?? 'text-white'}`}>{value}</p>
      {sub && <p className="text-xs text-slate-500 mt-1">{sub}</p>}
    </div>
  );
}

function HealthComponent({ name, data }: { name: string; data: any }) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-slate-900/50 rounded-lg border border-slate-700/40">
      <div className="flex items-center gap-3">
        <StatusDot status={data?.status ?? 'UNKNOWN'} />
        <span className="text-sm font-medium text-slate-200">{name}</span>
      </div>
      <div className="flex items-center gap-4 text-xs text-slate-400">
        {data?.latencyMs !== undefined && <span>{data.latencyMs}ms</span>}
        {data?.errorRatePct !== undefined && <span>{data.errorRatePct}% err</span>}
        <span className="font-semibold">{data?.status ?? '—'}</span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Page
// ─────────────────────────────────────────────────────────────────────────────
export default function OperationsDashboardPage() {
  const [snapshot, setSnapshot] = useState<any>(null);
  const [health, setHealth] = useState<any>(null);
  const [metrics, setMetrics] = useState<any>(null);
  const [incidentMetrics, setIncidentMetrics] = useState<any>(null);
  const [drReadiness, setDrReadiness] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'health' | 'metrics' | 'incidents' | 'backup'>('overview');
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [snapRes, healthRes, metricsRes, incRes, drRes] = await Promise.allSettled([
        operationsApi.getDashboardSnapshot(),
        operationsApi.getGlobalHealth(),
        operationsApi.getSystemMetrics(),
        operationsApi.getIncidentMetrics(),
        operationsApi.getDrReadiness(),
      ]);

      if (snapRes.status === 'fulfilled') setSnapshot(snapRes.value.data);
      if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);
      if (metricsRes.status === 'fulfilled') setMetrics(metricsRes.value.data);
      if (incRes.status === 'fulfilled') setIncidentMetrics(incRes.value.data);
      if (drRes.status === 'fulfilled') setDrReadiness(drRes.value.data);
      setLastRefresh(new Date());
    } catch (_) {
      // graceful degradation
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // Auto-refresh every 60 seconds
    const interval = setInterval(fetchData, 60000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const overallStatus = health?.overallStatus ?? snapshot?.health?.overallStatus ?? 'UNKNOWN';

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* ─── Header ─────────────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-[1600px] mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Enterprise Operations</h1>
              <p className="text-xs text-slate-400">Observability, Reliability & SRE Platform</p>
            </div>
            <div className="flex items-center gap-2 ml-4 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/50">
              <StatusDot status={overallStatus} />
              <span className={`text-xs font-semibold ${overallStatus === 'HEALTHY' ? 'text-emerald-400' : overallStatus === 'DEGRADED' ? 'text-amber-400' : 'text-red-400'}`}>
                {overallStatus}
              </span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500">Last refresh: {lastRefresh.toLocaleTimeString()}</span>
            <button
              onClick={fetchData}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-medium rounded-lg transition-colors"
            >
              {loading ? (
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
              )}
              Refresh
            </button>
          </div>
        </div>

        {/* Tab Bar */}
        <div className="max-w-[1600px] mx-auto px-6 flex gap-1">
          {(['overview', 'health', 'metrics', 'incidents', 'backup'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium capitalize border-b-2 transition-colors ${
                activeTab === tab
                  ? 'border-indigo-500 text-indigo-400'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* ─── Content ──────────────────────────────────────────────────────── */}
      <div className="max-w-[1600px] mx-auto px-6 py-6">

        {/* OVERVIEW TAB */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* KPI Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
              <StatCard
                label="Active Incidents"
                value={snapshot?.incidents?.active ?? incidentMetrics?.activeIncidents ?? '—'}
                accent={snapshot?.incidents?.active > 0 ? 'text-red-400' : 'text-emerald-400'}
              />
              <StatCard
                label="MTTR"
                value={incidentMetrics?.meanTimeToResolveMinutes ? `${incidentMetrics.meanTimeToResolveMinutes}m` : '—'}
                sub="Mean time to resolve"
              />
              <StatCard
                label="Failed Jobs"
                value={snapshot?.jobs?.failedJobs ?? '—'}
                accent={snapshot?.jobs?.failedJobs > 5 ? 'text-red-400' : 'text-emerald-400'}
              />
              <StatCard
                label="Running Jobs"
                value={snapshot?.jobs?.runningJobs ?? '—'}
                accent="text-blue-400"
              />
              <StatCard
                label="Heap Used"
                value={metrics?.heapUsedMb ? `${metrics.heapUsedMb} MB` : '—'}
                accent={metrics?.heapUsedMb > 600 ? 'text-amber-400' : 'text-slate-200'}
              />
              <StatCard
                label="DR Readiness"
                value={drReadiness?.readinessScore ? `${drReadiness.readinessScore}%` : '—'}
                accent={drReadiness?.readinessScore >= 95 ? 'text-emerald-400' : 'text-amber-400'}
                sub={drReadiness?.complianceStatus?.replace(/_/g, ' ')}
              />
            </div>

            {/* Health + Incidents side-by-side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Health Summary */}
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  System Health
                </h2>
                {health?.components ? (
                  <div className="space-y-2">
                    {Object.entries(health.components).map(([key, val]) => (
                      <HealthComponent key={key} name={key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} data={val} />
                    ))}
                  </div>
                ) : (
                  <LoadingPlaceholder rows={6} />
                )}
              </div>

              {/* Incident Metrics */}
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-red-400"></span>
                  Incident Center
                </h2>
                {incidentMetrics ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-800/60 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-white">{incidentMetrics.totalIncidents ?? 0}</div>
                        <div className="text-xs text-slate-400 mt-1">Total Incidents</div>
                      </div>
                      <div className="bg-slate-800/60 rounded-lg p-4 text-center">
                        <div className="text-3xl font-bold text-emerald-400">{incidentMetrics.resolvedIncidents ?? 0}</div>
                        <div className="text-xs text-slate-400 mt-1">Resolved</div>
                      </div>
                    </div>
                    <div className="bg-slate-800/60 rounded-lg p-4">
                      <p className="text-xs text-slate-400 mb-2">Severity Breakdown</p>
                      {Object.entries(incidentMetrics.severityBreakdown ?? {}).map(([sev, count]) => (
                        <div key={sev} className="flex items-center justify-between py-1">
                          <SeverityBadge severity={sev} />
                          <span className="text-sm font-semibold text-slate-200">{count as number}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <LoadingPlaceholder rows={4} />
                )}
              </div>
            </div>

            {/* System Metrics */}
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse"></span>
                Live System Metrics
              </h2>
              {metrics ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
                  <MetricTile label="Heap Used" value={`${metrics.heapUsedMb} MB`} warn={metrics.heapUsedMb > 600} />
                  <MetricTile label="Heap Total" value={`${metrics.heapTotalMb} MB`} />
                  <MetricTile label="RSS" value={`${metrics.rssMb} MB`} />
                  <MetricTile label="CPU Usage" value={`${metrics.cpuUsagePct}%`} warn={metrics.cpuUsagePct > 70} />
                  <MetricTile label="Event Loop" value={`${metrics.eventLoopLagMs}ms`} warn={metrics.eventLoopLagMs > 100} />
                  <MetricTile label="Uptime" value={formatUptime(metrics.uptimeSeconds)} />
                </div>
              ) : (
                <LoadingPlaceholder rows={1} />
              )}
            </div>

            {/* DR Readiness */}
            {drReadiness && (
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-200 mb-4 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-400"></span>
                  Disaster Recovery Status
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-800/60 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Readiness Score</p>
                    <p className={`text-2xl font-bold ${drReadiness.readinessScore >= 95 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {drReadiness.readinessScore}%
                    </p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Compliance</p>
                    <p className="text-sm font-semibold text-slate-200">{drReadiness.complianceStatus?.replace(/_/g, ' ')}</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Active DR Plans</p>
                    <p className="text-2xl font-bold text-blue-400">{drReadiness.activePlansCount ?? 0}</p>
                  </div>
                  <div className="bg-slate-800/60 rounded-lg p-4">
                    <p className="text-xs text-slate-400 mb-1">Primary Region</p>
                    <p className="text-sm font-mono text-slate-200">{drReadiness.businessContinuitySettings?.primaryRegion ?? '—'}</p>
                    <p className="text-xs text-slate-500">→ {drReadiness.businessContinuitySettings?.secondaryRegion ?? '—'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* HEALTH TAB */}
        {activeTab === 'health' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-6">
              <h2 className="text-base font-semibold text-white mb-2">Global Health Report</h2>
              <p className="text-sm text-slate-400 mb-6">
                Overall: <span className={`font-bold ${overallStatus === 'HEALTHY' ? 'text-emerald-400' : 'text-amber-400'}`}>{overallStatus}</span>
                {health?.timestamp && <span className="ml-2 text-slate-500">at {new Date(health.timestamp).toLocaleString()}</span>}
              </p>
              {health?.components ? (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
                  {Object.entries(health.components).map(([key, val]: [string, any]) => (
                    <div key={key} className="bg-slate-800/50 border border-slate-700/40 rounded-xl p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <StatusDot status={val?.status ?? 'UNKNOWN'} />
                          <h3 className="font-semibold text-slate-200">{key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}</h3>
                        </div>
                        <span className={`text-xs font-bold px-2 py-0.5 rounded ${
                          val?.status === 'HEALTHY' ? 'bg-emerald-500/20 text-emerald-300' :
                          val?.status === 'DEGRADED' ? 'bg-amber-500/20 text-amber-300' :
                          'bg-red-500/20 text-red-300'
                        }`}>{val?.status}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="bg-slate-900/60 rounded p-2">
                          <span className="text-slate-500">Latency</span>
                          <p className="font-mono font-semibold text-slate-200 mt-0.5">{val?.latencyMs ?? 0}ms</p>
                        </div>
                        <div className="bg-slate-900/60 rounded p-2">
                          <span className="text-slate-500">Error Rate</span>
                          <p className="font-mono font-semibold text-slate-200 mt-0.5">{val?.errorRatePct ?? 0}%</p>
                        </div>
                      </div>
                      {val?.details && Object.keys(val.details).length > 0 && (
                        <div className="mt-2 text-xs text-slate-500 font-mono bg-slate-900/40 rounded p-2 overflow-hidden text-ellipsis whitespace-nowrap">
                          {JSON.stringify(val.details).slice(0, 120)}...
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <LoadingPlaceholder rows={8} />
              )}
            </div>
          </div>
        )}

        {/* METRICS TAB */}
        {activeTab === 'metrics' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-200 mb-4">System Resource Metrics</h2>
                {metrics ? (
                  <div className="space-y-3">
                    <ProgressBar label="Heap Usage" value={metrics.heapUsedMb} max={metrics.heapTotalMb || 1000} unit="MB" warn={metrics.heapUsedMb > 600} />
                    <ProgressBar label="CPU Usage" value={metrics.cpuUsagePct} max={100} unit="%" warn={metrics.cpuUsagePct > 70} />
                    <ProgressBar label="Event Loop Lag" value={metrics.eventLoopLagMs} max={200} unit="ms" warn={metrics.eventLoopLagMs > 80} />
                    <div className="pt-2 border-t border-slate-700/40">
                      <div className="flex justify-between text-xs">
                        <span className="text-slate-400">RSS Memory</span>
                        <span className="font-mono text-slate-200">{metrics.rssMb} MB</span>
                      </div>
                      <div className="flex justify-between text-xs mt-2">
                        <span className="text-slate-400">Process Uptime</span>
                        <span className="font-mono text-slate-200">{formatUptime(metrics.uptimeSeconds)}</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <LoadingPlaceholder rows={4} />
                )}
              </div>

              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <h2 className="text-sm font-semibold text-slate-200 mb-4">Queue & Job Statistics</h2>
                {snapshot?.jobs ? (
                  <div className="space-y-3">
                    <MetricRow label="Running Jobs" value={snapshot.jobs.runningJobs} accent="text-blue-400" />
                    <MetricRow label="Pending Jobs" value={snapshot.jobs.pendingJobs} accent="text-amber-400" />
                    <MetricRow label="Failed Jobs" value={snapshot.jobs.failedJobs} accent={snapshot.jobs.failedJobs > 5 ? 'text-red-400' : 'text-slate-200'} />
                    <MetricRow label="Completed Jobs" value={snapshot.jobs.completedJobs} accent="text-emerald-400" />
                  </div>
                ) : (
                  <LoadingPlaceholder rows={4} />
                )}
              </div>
            </div>
          </div>
        )}

        {/* INCIDENTS TAB */}
        {activeTab === 'incidents' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Incident Metrics (SRE KPIs)</h2>
              {incidentMetrics ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  <StatCard label="Total Incidents" value={incidentMetrics.totalIncidents ?? 0} />
                  <StatCard label="Active" value={incidentMetrics.activeIncidents ?? 0} accent={incidentMetrics.activeIncidents > 0 ? 'text-red-400' : 'text-emerald-400'} />
                  <StatCard label="MTTR" value={`${incidentMetrics.meanTimeToResolveMinutes ?? 0}m`} sub="Mean time to resolve" />
                  <StatCard label="MTTD" value={`${incidentMetrics.meanTimeToDetectMinutes ?? 0}m`} sub="Mean time to detect" />
                </div>
              ) : (
                <LoadingPlaceholder rows={2} />
              )}

              <div className="bg-slate-800/40 rounded-xl p-4">
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Postmortem Actions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {['SEV1 - Complete Outage', 'SEV2 - Major Degradation', 'SEV3 - Partial Impairment'].map((title, i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-700/40 rounded-lg p-3">
                      <p className="text-xs font-semibold text-slate-300">{title}</p>
                      <p className="text-xs text-slate-500 mt-1">Requires 5-Why RCA + postmortem within 48h</p>
                      <div className={`mt-2 w-2 h-2 rounded-full ${i === 0 ? 'bg-red-500' : i === 1 ? 'bg-orange-500' : 'bg-amber-500'}`}></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* BACKUP TAB */}
        {activeTab === 'backup' && (
          <div className="space-y-6">
            <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
              <h2 className="text-sm font-semibold text-slate-200 mb-4">Backup & Disaster Recovery</h2>
              {drReadiness ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <div className="bg-slate-800/60 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">Business Continuity</h3>
                      <div className="space-y-2">
                        {Object.entries(drReadiness.businessContinuitySettings ?? {}).map(([k, v]) => (
                          <div key={k} className="flex justify-between text-xs">
                            <span className="text-slate-400">{k.replace(/([A-Z])/g, ' $1').trim()}</span>
                            <span className="font-mono text-slate-200">{String(v)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-slate-800/60 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">ISO 27001 / SOC 2 Compliance</h3>
                      <div className="flex items-center gap-3 mb-3">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold ${drReadiness.readinessScore >= 95 ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>
                          {drReadiness.readinessScore >= 95 ? '✓' : '!'}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-200">{drReadiness.readinessScore}% Readiness Score</p>
                          <p className="text-xs text-slate-400">{drReadiness.complianceStatus?.replace(/_/g, ' ')}</p>
                        </div>
                      </div>
                      <div className="text-xs text-slate-400">
                        <p>• {drReadiness.activePlansCount ?? 0} active DR plans</p>
                        <p>• {drReadiness.recentDrillsCount ?? 0} drills conducted</p>
                        <p>• Automated failover enabled</p>
                      </div>
                    </div>
                  </div>

                  {drReadiness.lastSuccessfulDrill && (
                    <div className="bg-slate-800/40 border border-slate-700/40 rounded-xl p-4">
                      <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Last Successful DR Drill</h3>
                      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                        <div>
                          <span className="text-slate-500">Drill Name</span>
                          <p className="text-slate-200 font-semibold">{drReadiness.lastSuccessfulDrill.drillName}</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Actual RTO</span>
                          <p className="text-emerald-400 font-semibold">{drReadiness.lastSuccessfulDrill.actualRtoMinutes}m</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Actual RPO</span>
                          <p className="text-emerald-400 font-semibold">{drReadiness.lastSuccessfulDrill.actualRpoMinutes}m</p>
                        </div>
                        <div>
                          <span className="text-slate-500">Status</span>
                          <p className="text-emerald-400 font-semibold">{drReadiness.lastSuccessfulDrill.status}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <LoadingPlaceholder rows={5} />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Shared sub-components ────────────────────────────────────────────────────
function LoadingPlaceholder({ rows }: { rows: number }) {
  return (
    <div className="space-y-3 animate-pulse">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 bg-slate-800 rounded-lg" />
      ))}
    </div>
  );
}

function MetricTile({ label, value, warn }: { label: string; value: string; warn?: boolean }) {
  return (
    <div className="bg-slate-800/60 rounded-lg p-3 text-center">
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className={`text-lg font-bold font-mono ${warn ? 'text-amber-400' : 'text-slate-200'}`}>{value}</p>
    </div>
  );
}

function MetricRow({ label, value, accent }: { label: string; value: number; accent?: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-slate-700/30">
      <span className="text-sm text-slate-400">{label}</span>
      <span className={`text-lg font-bold font-mono ${accent ?? 'text-slate-200'}`}>{value}</span>
    </div>
  );
}

function ProgressBar({ label, value, max, unit, warn }: { label: string; value: number; max: number; unit: string; warn?: boolean }) {
  const pct = Math.min(100, Math.round((value / max) * 100));
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-slate-400">{label}</span>
        <span className={`font-mono ${warn ? 'text-amber-400' : 'text-slate-300'}`}>{value}{unit} / {max}{unit}</span>
      </div>
      <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${warn ? 'bg-amber-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function formatUptime(seconds: number): string {
  if (!seconds) return '—';
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return `${h}h ${m}m`;
}
