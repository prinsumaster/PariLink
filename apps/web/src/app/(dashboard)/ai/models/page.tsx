'use client';

import { useState, useEffect } from 'react';
import { aiApi } from '@/services/ai';
import { 
  Network, Server, Cpu, Key, DollarSign, Activity, 
  Settings, CheckCircle2, AlertTriangle, Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModelConfig {
  provider: string;
  modelName: string;
  latencyMs: number;
  costPer1kTokens: number;
  status: 'ONLINE' | 'DEGRADED' | 'OFFLINE';
  isDefault: boolean;
}

export default function ModelRegistryPage() {
  const [models, setModels] = useState<ModelConfig[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchModels = async () => {
    setLoading(true);
    try {
      const res = await aiApi.listModels();
      const list = Array.isArray(res.data) ? res.data : (res.data.models || []);
      
      if (list.length === 0) {
        setModels([
          { provider: 'Google', modelName: 'gemini-1.5-pro', latencyMs: 650, costPer1kTokens: 0.015, status: 'ONLINE', isDefault: true },
          { provider: 'OpenAI', modelName: 'gpt-4o', latencyMs: 820, costPer1kTokens: 0.030, status: 'ONLINE', isDefault: false },
          { provider: 'Anthropic', modelName: 'claude-3.5-sonnet', latencyMs: 710, costPer1kTokens: 0.015, status: 'ONLINE', isDefault: false },
          { provider: 'Azure OpenAI', modelName: 'gpt-4-turbo', latencyMs: 950, costPer1kTokens: 0.030, status: 'DEGRADED', isDefault: false },
          { provider: 'Local', modelName: 'Llama-3-70b-Instruct', latencyMs: 1200, costPer1kTokens: 0.000, status: 'ONLINE', isDefault: false },
        ]);
      } else {
        setModels(list);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Network className="h-6 w-6 text-indigo-500" />
            AI Model & Provider Registry
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage LLM providers, routing rules, fallback chains, and token economics</p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-500 text-white">
          <Key className="h-4 w-4 mr-2" /> Add Provider API Key
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col: Registry List */}
        <div className="lg:col-span-2 space-y-4">
          {loading ? (
            <div className="space-y-4 animate-pulse">
              {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-900 rounded-xl" />)}
            </div>
          ) : (
            models.map(model => (
              <div key={`${model.provider}-${model.modelName}`} className={`bg-slate-900/60 border rounded-xl p-5 flex items-center justify-between transition-colors ${model.isDefault ? 'border-indigo-500/50 shadow-[0_0_15px_rgba(99,102,241,0.1)]' : 'border-slate-800'}`}>
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-slate-800 flex items-center justify-center border border-slate-700">
                    <Server className={`h-6 w-6 ${model.provider === 'Local' ? 'text-amber-400' : 'text-indigo-400'}`} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold text-slate-100">{model.provider}</h3>
                      <span className="text-xs font-mono text-slate-400">{model.modelName}</span>
                      {model.isDefault && (
                        <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-400 text-[10px] font-bold rounded uppercase tracking-wide border border-indigo-500/20">
                          Primary Router
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <Activity className="h-3 w-3" /> {model.latencyMs}ms avg latency
                      </span>
                      <span className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" /> ${model.costPer1kTokens.toFixed(3)} / 1k tokens
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-right">
                    <div className={`flex items-center gap-1.5 justify-end text-xs font-bold ${
                      model.status === 'ONLINE' ? 'text-emerald-400' :
                      model.status === 'DEGRADED' ? 'text-amber-400' : 'text-red-400'
                    }`}>
                      {model.status === 'ONLINE' ? <CheckCircle2 className="h-3.5 w-3.5" /> : <AlertTriangle className="h-3.5 w-3.5" />}
                      {model.status}
                    </div>
                    <p className="text-[10px] text-slate-500 mt-1">API Health</p>
                  </div>
                  <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-slate-800">
                    <Settings className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Right Col: Routing Rules & Fallback */}
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Network className="h-4 w-4 text-indigo-400" />
              Smart Routing Engine
            </h3>
            <div className="space-y-3">
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">Complex Reasoning Tasks</span>
                  <span className="text-[10px] font-mono text-indigo-400">gemini-1.5-pro</span>
                </div>
                <p className="text-[10px] text-slate-500">Routing triggered for high complexity scores &gt; 0.8</p>
              </div>
              <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-semibold text-slate-300">High-Volume Data Extraction</span>
                  <span className="text-[10px] font-mono text-amber-400">Local Llama-3</span>
                </div>
                <p className="text-[10px] text-slate-500">Routing triggered for batches &gt; 1000 tokens</p>
              </div>
              <Button variant="outline" className="w-full h-8 mt-2 text-xs border-slate-700 text-slate-300 hover:bg-slate-800">
                Configure Routing Rules
              </Button>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
            <h3 className="font-bold text-slate-200 mb-4 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-400" />
              Fallback Chain
            </h3>
            <div className="relative">
              <div className="absolute left-[11px] top-4 bottom-4 w-0.5 bg-slate-800" />
              <div className="space-y-4">
                <div className="relative flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 border border-indigo-500 flex items-center justify-center text-[10px] font-bold text-indigo-400 z-10">1</div>
                  <div className="flex-1 bg-slate-950 rounded border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300">gemini-1.5-pro</div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400 z-10">2</div>
                  <div className="flex-1 bg-slate-950 rounded border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300">gpt-4o</div>
                </div>
                <div className="relative flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-[10px] font-bold text-slate-400 z-10">3</div>
                  <div className="flex-1 bg-slate-950 rounded border border-slate-800 px-3 py-1.5 text-xs font-mono text-slate-300">claude-3.5-sonnet</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
