'use client';

import { useState, useCallback } from 'react';
import { operationsApi } from '@/services/operations';

type LogLevel = 'INFO' | 'WARN' | 'ERROR' | 'DEBUG' | 'FATAL';

const LEVEL_STYLES: Record<LogLevel | string, string> = {
  INFO:  'bg-blue-500/20 text-blue-300 border-blue-500/30',
  WARN:  'bg-amber-500/20 text-amber-300 border-amber-500/30',
  ERROR: 'bg-red-500/20 text-red-300 border-red-500/30',
  DEBUG: 'bg-slate-500/20 text-slate-300 border-slate-600/30',
  FATAL: 'bg-red-700/30 text-red-200 border-red-600/50',
};

export default function LogExplorerPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [errorGroups, setErrorGroups] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'errors'>('search');
  const [expandedLog, setExpandedLog] = useState<string | null>(null);

  const [filter, setFilter] = useState({
    query: '',
    level: '',
    service: '',
    correlationId: '',
    limit: 100,
  });

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const res = await operationsApi.searchLogs({
        query: filter.query || undefined,
        level: filter.level || undefined,
        service: filter.service || undefined,
        correlationId: filter.correlationId || undefined,
        limit: filter.limit,
      });
      setLogs(res.data || []);
    } catch (e) {
      setLogs([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const fetchErrorGroups = useCallback(async () => {
    setLoading(true);
    try {
      const res = await operationsApi.getErrorGroups();
      setErrorGroups(res.data || []);
    } catch (e) {
      setErrorGroups([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleTabSwitch = (tab: 'search' | 'errors') => {
    setActiveTab(tab);
    if (tab === 'errors' && errorGroups.length === 0) fetchErrorGroups();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Log Explorer</h1>
              <p className="text-xs text-slate-400">Full-text search · Sensitive data redacted · 90-day retention</p>
            </div>
          </div>
          <div className="flex gap-1">
            {(['search', 'errors'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => handleTabSwitch(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  activeTab === tab
                    ? 'bg-indigo-600 text-white'
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'errors' ? 'Error Groups' : 'Log Search'}
              </button>
            ))}
          </div>
        </div>

        {/* Search Bar */}
        {activeTab === 'search' && (
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Search log message..."
              value={filter.query}
              onChange={e => setFilter(f => ({ ...f, query: e.target.value }))}
              onKeyDown={e => e.key === 'Enter' && search()}
              className="flex-1 min-w-48 bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={filter.level}
              onChange={e => setFilter(f => ({ ...f, level: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Levels</option>
              {['DEBUG', 'INFO', 'WARN', 'ERROR', 'FATAL'].map(l => (
                <option key={l} value={l}>{l}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Service name..."
              value={filter.service}
              onChange={e => setFilter(f => ({ ...f, service: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 w-40"
            />
            <input
              type="text"
              placeholder="Correlation ID..."
              value={filter.correlationId}
              onChange={e => setFilter(f => ({ ...f, correlationId: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 w-44"
            />
            <button
              onClick={search}
              disabled={loading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? '...' : 'Search'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {activeTab === 'search' && (
          <div>
            {logs.length === 0 && !loading && (
              <div className="text-center py-16 text-slate-500">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-sm">Run a search to explore logs</p>
              </div>
            )}
            {loading && (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="h-12 bg-slate-800 rounded-lg" />
                ))}
              </div>
            )}
            {!loading && logs.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs text-slate-500 mb-3">{logs.length} result{logs.length !== 1 ? 's' : ''}</p>
                {logs.map((log: any, i) => {
                  const isExpanded = expandedLog === (log.id || String(i));
                  return (
                    <div
                      key={log.id || i}
                      className="bg-slate-900/60 border border-slate-700/40 rounded-lg overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedLog(isExpanded ? null : (log.id || String(i)))}
                        className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-800/40 transition-colors"
                      >
                        <span className={`shrink-0 px-2 py-0.5 rounded text-xs font-bold border ${LEVEL_STYLES[log.level] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                          {log.level}
                        </span>
                        <span className="text-xs text-slate-400 font-mono shrink-0 w-36 truncate">{log.service}</span>
                        <span className="flex-1 text-sm text-slate-200 truncate font-mono">{log.message}</span>
                        {log.correlationId && (
                          <span className="shrink-0 text-xs font-mono text-indigo-400 opacity-60">{log.correlationId.slice(0, 8)}</span>
                        )}
                        <span className="shrink-0 text-xs text-slate-500">
                          {log.createdAt ? new Date(log.createdAt).toLocaleTimeString() : ''}
                        </span>
                        <svg className={`w-4 h-4 text-slate-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                      {isExpanded && (
                        <div className="border-t border-slate-700/40 px-4 py-3 bg-slate-950/60">
                          <div className="grid grid-cols-2 gap-4 mb-3 text-xs">
                            <div>
                              <span className="text-slate-500">Service</span>
                              <p className="font-mono text-slate-200">{log.service}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Correlation ID</span>
                              <p className="font-mono text-slate-200">{log.correlationId || '—'}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Trace ID</span>
                              <p className="font-mono text-slate-200">{log.traceId || '—'}</p>
                            </div>
                            <div>
                              <span className="text-slate-500">Redacted</span>
                              <p className={`font-semibold ${log.isRedacted ? 'text-amber-400' : 'text-slate-400'}`}>{log.isRedacted ? 'Yes' : 'No'}</p>
                            </div>
                          </div>
                          {log.structuredData && (
                            <div>
                              <p className="text-xs text-slate-500 mb-1">Structured Data</p>
                              <pre className="text-xs font-mono text-slate-300 bg-slate-900 rounded p-3 overflow-auto max-h-40">
                                {JSON.stringify(log.structuredData, null, 2)}
                              </pre>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {activeTab === 'errors' && (
          <div>
            {loading && (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-20 bg-slate-800 rounded-xl" />
                ))}
              </div>
            )}
            {!loading && errorGroups.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <p className="text-sm">No error groups found</p>
              </div>
            )}
            {!loading && errorGroups.length > 0 && (
              <div className="space-y-3">
                <p className="text-xs text-slate-500 mb-3">{errorGroups.length} error group{errorGroups.length !== 1 ? 's' : ''}</p>
                {errorGroups.map((group: any, i) => (
                  <div key={i} className="bg-slate-900/60 border border-red-900/30 rounded-xl p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="px-2 py-0.5 rounded text-xs font-bold border bg-red-500/20 text-red-300 border-red-500/30">ERROR</span>
                          <span className="text-xs text-slate-400 font-mono">{group.service}</span>
                        </div>
                        <p className="text-sm font-mono text-slate-200 truncate">{group.messageFingerprint || group.firstMessage || '—'}</p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-2xl font-bold text-red-400">{group.count ?? 0}</p>
                        <p className="text-xs text-slate-500">occurrences</p>
                      </div>
                    </div>
                    {group.firstSeen && (
                      <p className="text-xs text-slate-500 mt-2">
                        First: {new Date(group.firstSeen).toLocaleString()} · Last: {group.lastSeen ? new Date(group.lastSeen).toLocaleString() : '—'}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
