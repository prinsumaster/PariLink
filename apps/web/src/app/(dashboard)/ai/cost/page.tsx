'use client';

import { useState } from 'react';
import { 
  DollarSign, TrendingUp, BarChart, Server, CreditCard, PieChart, Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AiCostDashboardPage() {
  const [dateRange, setDateRange] = useState('Last 30 Days');

  const stats = {
    totalSpend: 12450.75,
    projectedSpend: 14200.00,
    budgetRemaining: 7549.25,
    avgCostPerQuery: 0.0034,
  };

  const modelCosts = [
    { provider: 'OpenAI', model: 'gpt-4o', spend: 6850.20, pct: 55 },
    { provider: 'Google', model: 'gemini-1.5-pro', spend: 3240.50, pct: 26 },
    { provider: 'Anthropic', model: 'claude-3.5-sonnet', spend: 2360.05, pct: 19 },
  ];

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <DollarSign className="h-6 w-6 text-emerald-500" />
            AI Cost & Optimization
          </h1>
          <p className="text-sm text-slate-400 mt-1">Track LLM token expenditure, budget alerts, and ROI</p>
        </div>
        <select 
          value={dateRange}
          onChange={e => setDateRange(e.target.value)}
          className="bg-slate-900 border border-slate-800 text-sm text-slate-200 rounded-lg px-4 py-2 focus:outline-none focus:border-indigo-500"
        >
          <option>Today</option>
          <option>Last 7 Days</option>
          <option>Last 30 Days</option>
          <option>This Quarter</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Total Spend</p>
          <p className="text-3xl font-bold font-mono text-white">${stats.totalSpend.toLocaleString()}</p>
          <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
            <TrendingUp className="h-3 w-3" /> +15% vs previous period
          </p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Projected End of Month</p>
          <p className="text-3xl font-bold font-mono text-slate-300">${stats.projectedSpend.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-2">Based on current run rate</p>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Budget Remaining</p>
          <p className="text-3xl font-bold font-mono text-emerald-400">${stats.budgetRemaining.toLocaleString()}</p>
          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-3 overflow-hidden">
            <div className="h-full bg-emerald-500 rounded-full" style={{ width: '62%' }} />
          </div>
        </div>
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
          <p className="text-sm font-semibold text-slate-400 mb-1">Avg Cost / Interaction</p>
          <p className="text-3xl font-bold font-mono text-indigo-400">${stats.avgCostPerQuery.toFixed(4)}</p>
          <p className="text-xs text-emerald-400 mt-2 flex items-center gap-1">
            ↓ 8% via local LLM routing
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cost by Model */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 lg:col-span-2 flex flex-col">
          <h3 className="font-bold flex items-center gap-2 mb-6">
            <Server className="h-4 w-4 text-indigo-400" /> Spend by Model Provider
          </h3>
          <div className="flex-1 space-y-6 justify-center flex flex-col">
            {modelCosts.map(mc => (
              <div key={mc.model}>
                <div className="flex justify-between items-end mb-2">
                  <div>
                    <p className="text-sm font-bold text-slate-200">{mc.provider}</p>
                    <p className="text-xs font-mono text-slate-500">{mc.model}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono text-white">${mc.spend.toLocaleString()}</p>
                    <p className="text-xs text-slate-500">{mc.pct}%</p>
                  </div>
                </div>
                <div className="w-full h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${mc.provider === 'OpenAI' ? 'bg-emerald-500' : mc.provider === 'Google' ? 'bg-blue-500' : 'bg-orange-500'}`}
                    style={{ width: `${mc.pct}%` }} 
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Optimization Suggestions */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 flex flex-col">
          <h3 className="font-bold flex items-center gap-2 mb-6 text-amber-400">
            <Zap className="h-4 w-4" /> Optimization Opportunities
          </h3>
          <div className="flex-1 space-y-4">
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
              <h4 className="text-sm font-semibold text-slate-200 mb-1">Route simple tasks to Local LLMs</h4>
              <p className="text-xs text-slate-400 mb-3">15% of GPT-4o queries in dispatch had complexity scores under 0.2. Routing these to Llama-3 saves money.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-emerald-400">Est. Savings: $450/mo</span>
                <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-700 hover:bg-slate-800">Apply Rule</Button>
              </div>
            </div>
            
            <div className="p-4 bg-slate-950 rounded-lg border border-slate-800">
              <h4 className="text-sm font-semibold text-slate-200 mb-1">Enable Semantic Caching</h4>
              <p className="text-xs text-slate-400 mb-3">Many users query the same knowledge base documents repeatedly. Caching embeddings cuts API calls.</p>
              <div className="flex justify-between items-center">
                <span className="text-xs font-mono text-emerald-400">Est. Savings: $120/mo</span>
                <Button size="sm" variant="outline" className="h-6 text-[10px] border-slate-700 hover:bg-slate-800">Enable Cache</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
