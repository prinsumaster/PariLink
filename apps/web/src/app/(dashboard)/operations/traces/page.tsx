'use client';

import { useState, useCallback } from 'react';
import { operationsApi } from '@/services/operations';

const STATUS_STYLES: Record<string, string> = {
  OK:      'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  ERROR:   'bg-red-500/20 text-red-300 border-red-500/30',
  TIMEOUT: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
};

function SpanBar({ durationMs, maxMs }: { durationMs: number; maxMs: number }) {
  const pct = Math.max(4, Math.round((durationMs / (maxMs || 1)) * 100));
  const warn = durationMs > 500;
  return (
    <div className="flex items-center gap-2">
      <div className="w-32 h-2 bg-slate-700 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${warn ? 'bg-amber-500' : 'bg-indigo-500'}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className={`text-xs font-mono ${warn ? 'text-amber-400' : 'text-slate-400'}`}>{durationMs}ms</span>
    </div>
  );
}

function SpanNode({ span, depth = 0, maxMs }: { span: any; depth?: number; maxMs: number }) {
  const [open, setOpen] = useState(depth === 0);
  const hasChildren = span.children && span.children.length > 0;
  return (
    <div className={depth > 0 ? 'ml-4 border-l border-slate-700/50 pl-3' : ''}>
      <div
        className={`flex items-center gap-2 py-2 px-3 rounded-lg cursor-pointer hover:bg-slate-800/50 transition-colors ${
          depth === 0 ? 'bg-slate-800/40' : ''
        }`}
        onClick={() => hasChildren && setOpen(o => !o)}
      >
        {hasChildren && (
          <svg className={`w-3 h-3 text-slate-500 transition-transform ${open ? 'rotate-90' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        )}
        {!hasChildren && <span className="w-3 h-3 inline-block" />}
        <span className={`px-1.5 py-0.5 rounded text-xs font-bold border ${STATUS_STYLES[span.status] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}>
          {span.status}
        </span>
        <span className="text-xs text-indigo-400 font-mono shrink-0 w-28 truncate">{span.serviceName}</span>
        <span className="flex-1 text-sm text-slate-200 font-mono truncate">{span.operationName}</span>
        <SpanBar durationMs={span.durationMs} maxMs={maxMs} />
      </div>
      {open && hasChildren && (
        <div className="mt-1">
          {span.children.map((child: any, i: number) => (
            <SpanNode key={child.spanId || i} span={child} depth={depth + 1} maxMs={maxMs} />
          ))}
        </div>
      )}
    </div>
  );
}

export default function TraceExplorerPage() {
  const [spans, setSpans] = useState<any[]>([]);
  const [traceTree, setTraceTree] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'search' | 'trace'>('search');
  const [traceId, setTraceId] = useState('');

  const [filter, setFilter] = useState({
    serviceName: '',
    operationName: '',
    status: '',
    minDurationMs: '',
    limit: 50,
  });

  const search = useCallback(async () => {
    setLoading(true);
    try {
      const res = await operationsApi.searchTraces({
        serviceName: filter.serviceName || undefined,
        operationName: filter.operationName || undefined,
        status: filter.status || undefined,
        minDurationMs: filter.minDurationMs ? parseInt(filter.minDurationMs) : undefined,
        limit: filter.limit,
      });
      setSpans(res.data || []);
    } catch {
      setSpans([]);
    } finally {
      setLoading(false);
    }
  }, [filter]);

  const loadTrace = useCallback(async () => {
    if (!traceId.trim()) return;
    setLoading(true);
    try {
      const res = await operationsApi.getTrace(traceId.trim());
      setTraceTree(res.data);
    } catch {
      setTraceTree(null);
    } finally {
      setLoading(false);
    }
  }, [traceId]);

  const maxMs = spans.length > 0 ? Math.max(...spans.map((s: any) => s.durationMs || 0)) : 1000;

  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-6 py-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <div>
              <h1 className="text-base font-bold text-white">Trace Explorer</h1>
              <p className="text-xs text-slate-400">Distributed tracing · Span waterfall · Service map</p>
            </div>
          </div>
          <div className="flex gap-1">
            {(['search', 'trace'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 text-xs font-semibold rounded-lg capitalize transition-colors ${
                  activeTab === tab ? 'bg-indigo-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {tab === 'trace' ? 'Trace Waterfall' : 'Span Search'}
              </button>
            ))}
          </div>
        </div>

        {activeTab === 'search' && (
          <div className="flex gap-3 flex-wrap">
            <input
              type="text"
              placeholder="Service name..."
              value={filter.serviceName}
              onChange={e => setFilter(f => ({ ...f, serviceName: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 w-40"
            />
            <input
              type="text"
              placeholder="Operation name..."
              value={filter.operationName}
              onChange={e => setFilter(f => ({ ...f, operationName: e.target.value }))}
              className="flex-1 min-w-40 bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            />
            <select
              value={filter.status}
              onChange={e => setFilter(f => ({ ...f, status: e.target.value }))}
              className="bg-slate-800 border border-slate-700 text-sm text-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500"
            >
              <option value="">All Status</option>
              <option value="OK">OK</option>
              <option value="ERROR">ERROR</option>
              <option value="TIMEOUT">TIMEOUT</option>
            </select>
            <input
              type="number"
              placeholder="Min duration (ms)..."
              value={filter.minDurationMs}
              onChange={e => setFilter(f => ({ ...f, minDurationMs: e.target.value }))}
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

        {activeTab === 'trace' && (
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Enter Trace ID..."
              value={traceId}
              onChange={e => setTraceId(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && loadTrace()}
              className="flex-1 bg-slate-800 border border-slate-700 text-sm text-slate-200 placeholder-slate-500 rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 font-mono"
            />
            <button
              onClick={loadTrace}
              disabled={loading || !traceId.trim()}
              className="px-5 py-2 bg-violet-600 hover:bg-violet-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
            >
              {loading ? '...' : 'Load Trace'}
            </button>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        {/* Span Search Results */}
        {activeTab === 'search' && (
          <div>
            {loading && (
              <div className="space-y-2 animate-pulse">
                {Array.from({ length: 6 }).map((_, i) => <div key={i} className="h-14 bg-slate-800 rounded-lg" />)}
              </div>
            )}
            {!loading && spans.length === 0 && (
              <div className="text-center py-16 text-slate-500">
                <p className="text-sm">Search for spans to explore distributed traces</p>
              </div>
            )}
            {!loading && spans.length > 0 && (
              <div>
                <p className="text-xs text-slate-500 mb-3">{spans.length} spans found</p>
                <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl overflow-hidden">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-slate-700/40 bg-slate-800/40">
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Service</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Operation</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Trace ID</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Duration</th>
                        <th className="text-left px-4 py-2.5 text-xs font-semibold text-slate-400 uppercase tracking-wider">Start</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700/30">
                      {spans.map((span: any, i) => (
                        <tr
                          key={span.spanId || i}
                          className="hover:bg-slate-800/40 cursor-pointer transition-colors"
                          onClick={() => { setTraceId(span.traceId); setActiveTab('trace'); }}
                        >
                          <td className="px-4 py-3">
                            <span className={`px-1.5 py-0.5 rounded text-xs font-bold border ${STATUS_STYLES[span.status] ?? 'bg-slate-700 text-slate-300 border-slate-600'}`}>
                              {span.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-indigo-400 font-mono text-xs">{span.serviceName}</td>
                          <td className="px-4 py-3 text-slate-200 font-mono text-xs">{span.operationName}</td>
                          <td className="px-4 py-3 text-slate-400 font-mono text-xs">{span.traceId?.slice(0, 12)}…</td>
                          <td className="px-4 py-3"><SpanBar durationMs={span.durationMs} maxMs={maxMs} /></td>
                          <td className="px-4 py-3 text-slate-500 text-xs">{span.startTime ? new Date(span.startTime).toLocaleTimeString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Trace Waterfall */}
        {activeTab === 'trace' && (
          <div>
            {loading && <div className="text-slate-500 text-sm text-center py-16">Loading trace...</div>}
            {!loading && !traceTree && (
              <div className="text-center py-16 text-slate-500">
                <p className="text-sm">Enter a Trace ID to view the span waterfall</p>
              </div>
            )}
            {!loading && traceTree && (
              <div>
                <div className="flex items-center gap-6 mb-6 bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-white">{traceTree.spansCount ?? 0}</p>
                    <p className="text-xs text-slate-400">Spans</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-slate-200">{traceTree.totalDurationMs ?? 0}ms</p>
                    <p className="text-xs text-slate-400">Total Duration</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-red-400">{traceTree.errorCount ?? 0}</p>
                    <p className="text-xs text-slate-400">Errors</p>
                  </div>
                  <div className="flex-1">
                    <p className="text-xs text-slate-400 mb-1">Services</p>
                    <div className="flex flex-wrap gap-2">
                      {(traceTree.servicesInvolved ?? []).map((svc: string) => (
                        <span key={svc} className="px-2 py-0.5 bg-indigo-500/20 text-indigo-300 rounded text-xs font-mono border border-indigo-500/30">{svc}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {traceTree.rootSpan && (
                  <div className="bg-slate-900/60 border border-slate-700/40 rounded-xl p-4">
                    <SpanNode span={traceTree.rootSpan} maxMs={traceTree.totalDurationMs || 1000} />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
