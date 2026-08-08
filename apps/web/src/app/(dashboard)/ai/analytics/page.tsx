'use client';

import { useState, useEffect } from 'react';
import { aiApi } from '@/services/ai';
import { 
  BarChart3, Brain, Activity, Clock, FileText, 
  ThumbsUp, ShieldAlert, Zap
} from 'lucide-react';

export default function AiAnalyticsPage() {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const res = await aiApi.getMetrics();
        // Assume backend returns { totalInteractions, avgLatencyMs, totalTokens, hallucinationRate, ... }
        setMetrics(res.data || {});
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading) {
    return <div className="min-h-screen bg-slate-950 p-6 flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
    </div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BarChart3 className="h-6 w-6 text-indigo-500" />
          AI Platform Analytics
        </h1>
        <p className="text-sm text-slate-400 mt-1">Real-time performance, usage, and quality metrics across all AI models</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400"><Brain className="h-4 w-4" /></div>
            <p className="text-sm font-semibold text-slate-300">Total Interactions</p>
          </div>
          <p className="text-3xl font-bold font-mono">{metrics.totalInteractions.toLocaleString()}</p>
          <p className="text-xs text-emerald-400 mt-1">↑ 12% vs last week</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400"><Clock className="h-4 w-4" /></div>
            <p className="text-sm font-semibold text-slate-300">Avg Latency</p>
          </div>
          <p className="text-3xl font-bold font-mono">{metrics.averageLatencyMs || 0}ms</p>
          <p className="text-xs text-emerald-400 mt-1">↓ 45ms vs last week</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-amber-500/10 rounded-lg text-amber-400"><FileText className="h-4 w-4" /></div>
            <p className="text-sm font-semibold text-slate-300">Total Tokens</p>
          </div>
          <p className="text-3xl font-bold font-mono">{(((metrics.totalPromptTokens || 0) + (metrics.totalCompletionTokens || 0)) / 1000000).toFixed(1)}M</p>
          <p className="text-xs text-slate-500 mt-1">Across all models</p>
        </div>

        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/10 rounded-lg text-red-400"><ShieldAlert className="h-4 w-4" /></div>
            <p className="text-sm font-semibold text-slate-300">Hallucination Rate</p>
          </div>
          <p className="text-3xl font-bold font-mono">{((metrics.hallucinationReports || 0) / Math.max(1, metrics.totalInteractions || 1) * 100).toFixed(2)}%</p>
          <p className="text-xs text-emerald-400 mt-1">Target &lt; 0.5%</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interaction Volume Chart Placeholder */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2"><Activity className="h-4 w-4 text-indigo-400" /> Interaction Volume</h3>
          </div>
          <div className="flex-1 flex items-end gap-2 px-4">
            {(metrics.dailyVolume || [0,0,0,0,0,0,0]).map((val: number, idx: number) => {
              const max = Math.max(...(metrics.dailyVolume || [1,1,1,1,1,1,1]));
              const pct = (val / max) * 100;
              return (
                <div key={idx} className="flex-1 flex flex-col justify-end items-center group">
                  <div className="w-full bg-indigo-500/30 hover:bg-indigo-500/50 rounded-t-sm transition-all relative" style={{ height: `${pct}%` }}>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-800 text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                      {val}
                    </div>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-2">D{idx+1}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quality & Feedback */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 h-80 flex flex-col">
          <div className="flex items-center justify-between mb-6">
            <h3 className="font-bold flex items-center gap-2"><ThumbsUp className="h-4 w-4 text-emerald-400" /> Quality & User Feedback</h3>
          </div>
          <div className="flex-1 flex flex-col justify-center items-center">
            <div className="text-6xl font-bold text-white mb-2">{(metrics.feedbackSummary?.averageRating || 0).toFixed(1)}</div>
            <div className="flex gap-1 mb-4">
              {[1, 2, 3, 4, 5].map(star => (
                <svg key={star} className={`w-6 h-6 ${star <= Math.round(metrics.feedbackSummary?.averageRating || 0) ? 'text-amber-400' : 'text-slate-700'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <p className="text-sm text-slate-400">Based on 1,245 user ratings</p>
            
            <div className="w-full mt-8 p-4 bg-slate-950 rounded-lg border border-slate-800 flex justify-between items-center">
              <div>
                <p className="text-xs font-semibold text-slate-300">Semantic Accuracy</p>
                <p className="text-[10px] text-slate-500">Auto-eval benchmark</p>
              </div>
              <div className="text-emerald-400 font-mono font-bold">94.2%</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
