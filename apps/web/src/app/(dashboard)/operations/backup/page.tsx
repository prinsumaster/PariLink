'use client';

import { useState, useCallback, useEffect } from 'react';
import { operationsApi } from '@/services/operations';

export default function BackupDrPage() {
  const [drReadiness, setDrReadiness] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await operationsApi.getDrReadiness();
      setDrReadiness(res.data);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
            </svg>
          </div>
          <div>
            <h1 className="text-base font-bold text-white">Backup & Disaster Recovery</h1>
            <p className="text-xs text-slate-400">RPO/RTO Targets · ISO 27001 Compliance · Automated Failover Drills</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-sm font-semibold rounded-lg transition-colors border border-slate-700">
            Start DR Drill
          </button>
          <button className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-lg transition-colors">
            Trigger Backup
          </button>
        </div>
      </div>

      <div className="flex-1 p-6 space-y-6 max-w-[1600px] mx-auto w-full">
        {loading ? (
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-slate-800 rounded-xl"></div>
            <div className="h-64 bg-slate-800 rounded-xl"></div>
          </div>
        ) : !drReadiness ? (
          <div className="flex-1 flex items-center justify-center text-slate-500 text-sm py-20">
            Unable to load DR Readiness report.
          </div>
        ) : (
          <>
            {/* Top KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5 flex items-center gap-4">
                <div className={`w-14 h-14 rounded-full flex items-center justify-center text-2xl font-bold border-4 ${
                  drReadiness.readinessScore >= 95 ? 'border-emerald-500 text-emerald-400 bg-emerald-500/10' : 'border-amber-500 text-amber-400 bg-amber-500/10'
                }`}>
                  {drReadiness.readinessScore}%
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-200">Readiness Score</p>
                  <p className="text-xs text-slate-400 mt-0.5">{drReadiness.complianceStatus?.replace(/_/g, ' ')}</p>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Active DR Plans</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{drReadiness.activePlansCount ?? 0}</p>
                  <span className="text-sm text-emerald-400 font-medium">Verified</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Recent Drills</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-3xl font-bold text-white">{drReadiness.recentDrillsCount ?? 0}</p>
                  <span className="text-sm text-slate-400 font-medium">Last 90 days</span>
                </div>
              </div>

              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Primary / Secondary</p>
                <p className="text-lg font-mono text-slate-200">{drReadiness.businessContinuitySettings?.primaryRegion || 'US-EAST-1'}</p>
                <p className="text-sm font-mono text-slate-500 mt-1">→ {drReadiness.businessContinuitySettings?.secondaryRegion || 'US-WEST-2'}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Business Continuity Settings */}
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
                  <h2 className="text-sm font-semibold text-slate-200">Business Continuity Posture</h2>
                </div>
                <div className="p-5">
                  <div className="space-y-4">
                    {Object.entries(drReadiness.businessContinuitySettings ?? {}).map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-2 border-b border-slate-700/30 last:border-0">
                        <span className="text-sm text-slate-400 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</span>
                        <span className="text-sm font-mono font-medium text-slate-200">
                          {typeof value === 'boolean' ? (value ? 'Enabled' : 'Disabled') : String(value)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Last Successful Drill */}
              <div className="bg-slate-900/60 border border-slate-700/50 rounded-xl overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-700/50 bg-slate-800/20">
                  <h2 className="text-sm font-semibold text-slate-200">Last Successful DR Drill</h2>
                </div>
                {drReadiness.lastSuccessfulDrill ? (
                  <div className="p-5 flex-1 flex flex-col justify-center">
                    <div className="text-center mb-8">
                      <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-4">
                        <svg className="w-8 h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <h3 className="text-xl font-bold text-white">{drReadiness.lastSuccessfulDrill.drillName}</h3>
                      <p className="text-sm text-slate-400 mt-1">Conducted successfully across multiple regions</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-slate-800/40 rounded-lg p-4 text-center border border-emerald-500/20">
                        <p className="text-xs text-slate-400 mb-1">Actual RTO</p>
                        <p className="text-2xl font-bold text-emerald-400 font-mono">{drReadiness.lastSuccessfulDrill.actualRtoMinutes}m</p>
                        <p className="text-[10px] text-slate-500 mt-1">Recovery Time Obj.</p>
                      </div>
                      <div className="bg-slate-800/40 rounded-lg p-4 text-center border border-emerald-500/20">
                        <p className="text-xs text-slate-400 mb-1">Actual RPO</p>
                        <p className="text-2xl font-bold text-emerald-400 font-mono">{drReadiness.lastSuccessfulDrill.actualRpoMinutes}m</p>
                        <p className="text-[10px] text-slate-500 mt-1">Recovery Point Obj.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-5 flex-1 flex items-center justify-center text-slate-500 text-sm">
                    No successful DR drills recorded.
                  </div>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
