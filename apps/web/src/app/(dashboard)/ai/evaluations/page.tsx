'use client';

import { useState, useEffect } from 'react';
import { aiApi } from '@/services/ai';
import { 
  ShieldCheck, AlertOctagon, CheckSquare, XSquare, 
  Search, Filter, ShieldAlert
} from 'lucide-react';

export default function AiEvaluationDashboardPage() {
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real implementation this would fetch `aiApi.getComplianceReport()` or hallucination logs
    setLoading(false);
    setReports([
      { id: '1', type: 'HALLUCINATION', severity: 'HIGH', status: 'PENDING_REVIEW', description: 'Agent hallucinated a fake PO number for customer Acme Corp.', model: 'gpt-4o', date: new Date().toISOString() },
      { id: '2', type: 'PROMPT_INJECTION', severity: 'CRITICAL', status: 'BLOCKED', description: 'User attempted to force system prompt bypass in Chat.', model: 'gemini-1.5-pro', date: new Date(Date.now() - 86400000).toISOString() },
      { id: '3', type: 'PII_LEAK', severity: 'MEDIUM', status: 'REDACTED', description: 'SSN detected in driver chat prompt. Automatically redacted before sending to LLM.', model: 'N/A', date: new Date(Date.now() - 172800000).toISOString() },
    ]);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-indigo-500" />
            AI Governance & Evaluation
          </h1>
          <p className="text-sm text-slate-400 mt-1">Audit logs, hallucination reports, and safety filter triggers</p>
        </div>
        <div className="flex gap-2">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 text-emerald-400 rounded-lg border border-emerald-500/20 text-xs font-bold">
            <CheckSquare className="h-4 w-4" /> ISO 27001 Compliant
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Blocked Prompts</p>
          <p className="text-3xl font-bold font-mono text-white">142</p>
          <p className="text-xs text-slate-500 mt-2">Due to PII or injection rules</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Reported Hallucinations</p>
          <p className="text-3xl font-bold font-mono text-amber-400">12</p>
          <p className="text-xs text-slate-500 mt-2">Pending human review</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Safety Filter Pass Rate</p>
          <p className="text-3xl font-bold font-mono text-emerald-400">99.8%</p>
          <p className="text-xs text-slate-500 mt-2">Out of 14.5M tokens</p>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900/50">
          <h3 className="font-bold flex items-center gap-2">
            <AlertOctagon className="h-4 w-4 text-amber-400" />
            Security & Safety Audit Log
          </h3>
          <div className="flex gap-3">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
                <input 
                  type="text"
                  placeholder="Search logs..."
                  className="pl-8 pr-4 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-indigo-500 w-48"
                />
              </div>
              <button className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-300 hover:bg-slate-800">
                <Filter className="h-3.5 w-3.5" /> Filter
              </button>
          </div>
        </div>
        
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-950/50">
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Timestamp</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Event Type</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Severity</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Description</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Model Route</th>
              <th className="text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800">
            {reports.map(r => (
              <tr key={r.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{new Date(r.date).toLocaleString()}</td>
                <td className="px-4 py-3 font-semibold text-slate-200">{r.type}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    r.severity === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border-red-500/30' :
                    r.severity === 'HIGH' ? 'bg-orange-500/20 text-orange-400 border-orange-500/30' :
                    'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {r.severity}
                  </span>
                </td>
                <td className="px-4 py-3 text-slate-300">{r.description}</td>
                <td className="px-4 py-3 text-slate-400 font-mono text-xs">{r.model}</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                    r.status === 'BLOCKED' || r.status === 'REDACTED' ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30' :
                    'bg-amber-500/20 text-amber-400 border-amber-500/30'
                  }`}>
                    {r.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
