'use client';

import { useState, useCallback, useEffect } from 'react';
import { operationsApi } from '@/services/operations';

const SEVERITY_STYLES: Record<string, string> = {
  SEV1: 'bg-red-500/20 text-red-300 border-red-500/30',
  SEV2: 'bg-orange-500/20 text-orange-300 border-orange-500/30',
  SEV3: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  SEV4: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
};

const STATUS_STYLES: Record<string, string> = {
  INVESTIGATING: 'text-amber-400',
  IDENTIFIED: 'text-orange-400',
  MONITORING: 'text-blue-400',
  RESOLVED: 'text-emerald-400',
};

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<any[]>([]);
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedIncident, setSelectedIncident] = useState<any>(null);
  const [incidentDetails, setIncidentDetails] = useState<any>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const metricsRes = await operationsApi.getIncidentMetrics().catch(() => null);

      if (metricsRes?.data) {
        setMetrics(metricsRes.data);
        // If the backend doesn't have a direct list endpoint in the current API, 
        // we would fetch it here. For now, we'll set empty if not provided.
        // In a real app we'd have a search endpoint.
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const loadDetails = async (id: string) => {
    setLoadingDetails(true);
    try {
      const res = await operationsApi.getIncident(id);
      setIncidentDetails(res.data);
    } catch {
      setIncidentDetails(null);
    } finally {
      setLoadingDetails(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-orange-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Incident Command Center</h1>
            <p className="text-xs text-slate-400">SEV1-SEV4 Tracking · Postmortems · MTTD / MTTR</p>
          </div>
        </div>
        <button
          onClick={fetchData}
          disabled={loading}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
        >
          {loading ? 'Refreshing...' : 'Refresh'}
        </button>
      </div>

      <div className="flex-1 p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Metrics & List */}
        <div className="lg:col-span-1 space-y-6">
          {/* KPI Panel */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
            <h2 className="text-sm font-semibold text-slate-200 mb-4">Service Level Objectives (SLOs)</h2>
            {loading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-10 bg-slate-800 rounded"></div>
                <div className="h-10 bg-slate-800 rounded"></div>
              </div>
            ) : metrics ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">MTTR</p>
                  <p className="text-xl font-bold text-emerald-400">{metrics.meanTimeToResolveMinutes ?? 0}m</p>
                </div>
                <div className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">MTTD</p>
                  <p className="text-xl font-bold text-blue-400">{metrics.meanTimeToDetectMinutes ?? 0}m</p>
                </div>
                <div className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Active SEV1</p>
                  <p className={`text-xl font-bold ${metrics.severityBreakdown?.SEV1 > 0 ? 'text-red-400' : 'text-slate-200'}`}>
                    {metrics.severityBreakdown?.SEV1 ?? 0}
                  </p>
                </div>
                <div className="bg-slate-800/40 rounded-lg p-3">
                  <p className="text-xs text-slate-400 mb-1">Resolved</p>
                  <p className="text-xl font-bold text-emerald-400">{metrics.resolvedIncidents ?? 0}</p>
                </div>
              </div>
            ) : (
              <div className="text-slate-500 text-sm">No metrics available.</div>
            )}
          </div>

          {/* Incident List */}
          <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col h-[calc(100vh-320px)]">
            <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
              <h2 className="text-sm font-semibold text-slate-200">Recent Incidents</h2>
            </div>
            <div className="flex-1 overflow-auto p-2 space-y-1">
              {incidents.length === 0 && !loading && (
                <div className="text-center py-10 text-slate-500 text-sm">
                  No recent incidents found.
                </div>
              )}
              {incidents.map((inc) => (
                <button
                  key={inc.id}
                  onClick={() => { setSelectedIncident(inc); loadDetails(inc.id); }}
                  className={`w-full text-left p-3 rounded-lg border transition-colors ${
                    selectedIncident?.id === inc.id
                      ? 'bg-slate-800 border-indigo-500/50'
                      : 'bg-transparent border-transparent hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border ${SEVERITY_STYLES[inc.severity] ?? 'bg-slate-700 border-slate-600'}`}>
                      {inc.severity}
                    </span>
                    <span className={`text-[10px] font-bold ${STATUS_STYLES[inc.status] ?? 'text-slate-400'}`}>
                      {inc.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-slate-200 truncate">{inc.title}</p>
                  <p className="text-xs text-slate-500 mt-1">
                    {new Date(inc.createdAt).toLocaleString()}
                  </p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Details & Timeline */}
        <div className="lg:col-span-2 bg-slate-900/60 border border-slate-700/50 rounded-xl flex flex-col overflow-hidden h-[calc(100vh-100px)]">
          {!selectedIncident ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500">
              <svg className="w-16 h-16 opacity-20 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>Select an incident to view its timeline and postmortem</p>
            </div>
          ) : loadingDetails ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
            </div>
          ) : incidentDetails ? (
            <>
              {/* Detail Header */}
              <div className="p-6 border-b border-slate-700/50 bg-slate-900">
                <div className="flex items-center gap-3 mb-2">
                  <span className={`px-2 py-0.5 rounded text-xs font-bold border ${SEVERITY_STYLES[incidentDetails.severity]}`}>
                    {incidentDetails.severity}
                  </span>
                  <span className={`text-xs font-bold ${STATUS_STYLES[incidentDetails.status]}`}>
                    {incidentDetails.status}
                  </span>
                  <span className="text-xs text-slate-500 font-mono ml-auto">ID: {incidentDetails.id}</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">{incidentDetails.title}</h2>
                <p className="text-sm text-slate-400 whitespace-pre-wrap">{incidentDetails.description}</p>
                
                {incidentDetails.rootCause && (
                  <div className="mt-4 p-3 bg-slate-800/50 border border-slate-700 rounded-lg">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Root Cause</p>
                    <p className="text-sm text-slate-200">{incidentDetails.rootCause}</p>
                  </div>
                )}
              </div>

              {/* Timeline */}
              <div className="flex-1 overflow-auto p-6 bg-slate-950/30">
                <h3 className="text-sm font-semibold text-slate-200 mb-6 flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Chronological Timeline
                </h3>
                
                <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-slate-700/50">
                  {incidentDetails.timeline?.map((event: any, i: number) => (
                    <div key={event.id || i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                      <div className="flex items-center justify-center w-10 h-10 rounded-full border-4 border-slate-950 bg-slate-800 text-slate-400 shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 shadow">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] bg-slate-900/80 border border-slate-700/50 p-4 rounded-xl shadow">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs font-bold text-indigo-400">{event.eventType}</span>
                          <span className="text-xs font-mono text-slate-500">
                            {new Date(event.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <p className="text-sm text-slate-300">{event.description}</p>
                        {event.metadata && Object.keys(event.metadata).length > 0 && (
                          <pre className="mt-2 p-2 bg-slate-950 rounded text-[10px] text-slate-400 font-mono overflow-x-auto border border-slate-800">
                            {JSON.stringify(event.metadata, null, 2)}
                          </pre>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-red-400 text-sm">Failed to load incident details.</div>
          )}
        </div>
      </div>
    </div>
  );
}
