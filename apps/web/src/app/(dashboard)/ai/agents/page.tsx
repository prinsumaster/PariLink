'use client';

import { useState, useEffect } from 'react';
import { aiApi } from '@/services/ai';
import { 
  Bot, Activity, CheckCircle2, AlertCircle, Shield, 
  Workflow, Database, Cpu, Search, RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AiAgent {
  name: string;
  description: string;
  capabilities: string[];
  status: 'ACTIVE' | 'IDLE' | 'ERROR';
  lastActive: string;
  successRate: number;
  tasksCompleted: number;
}

export default function AgentConsolePage() {
  const [agents, setAgents] = useState<AiAgent[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  const fetchAgents = async () => {
    setLoading(true);
    try {
      const res = await aiApi.listAgents();
      // Assume the backend returns an array of agents, or map if it's an object
      const agentList = Array.isArray(res.data) ? res.data : (res.data?.agents || []);
      setAgents(agentList);
    } catch (e) {
      console.error('Failed to load agents', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const filteredAgents = agents.filter(a => a.name.toLowerCase().includes(search.toLowerCase()) || a.description.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Bot className="h-6 w-6 text-indigo-500" />
            Autonomous Agent Console
          </h1>
          <p className="text-sm text-slate-400 mt-1">Monitor and orchestrate specialized AI agents across the LogOS platform</p>
        </div>
        <div className="flex gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input 
              type="text"
              placeholder="Search agents..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 bg-slate-900 border border-slate-800 rounded-lg text-sm text-slate-200 focus:outline-none focus:border-indigo-500 w-64"
            />
          </div>
          <Button onClick={fetchAgents} variant="outline" className="border-slate-800 text-slate-300 hover:bg-slate-800">
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-slate-900 border border-slate-800 rounded-xl h-64 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAgents.map((agent) => (
            <div key={agent.name} className="bg-slate-900/60 border border-slate-800 rounded-xl p-6 hover:border-indigo-500/50 transition-colors group">
              <div className="flex justify-between items-start mb-4">
                <div className="h-10 w-10 rounded-lg bg-indigo-500/10 flex items-center justify-center text-indigo-400 border border-indigo-500/20 group-hover:bg-indigo-500 group-hover:text-white transition-colors">
                  <Cpu className="h-5 w-5" />
                </div>
                <div className={`px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider flex items-center gap-1.5 ${
                  agent.status === 'ACTIVE' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  agent.status === 'IDLE' ? 'bg-slate-800 text-slate-400 border border-slate-700' :
                  'bg-red-500/10 text-red-400 border border-red-500/20'
                }`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${agent.status === 'ACTIVE' ? 'bg-emerald-400 animate-pulse' : agent.status === 'IDLE' ? 'bg-slate-400' : 'bg-red-400'}`} />
                  {agent.status}
                </div>
              </div>
              
              <h3 className="text-lg font-bold text-slate-100 mb-1">{agent.name}</h3>
              <p className="text-xs text-slate-400 mb-5 h-8 line-clamp-2">{agent.description}</p>
              
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Success Rate</p>
                  <p className="text-lg font-mono text-emerald-400">{agent.successRate}%</p>
                </div>
                <div className="bg-slate-950 rounded-lg p-3 border border-slate-800">
                  <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Tasks Done</p>
                  <p className="text-lg font-mono text-indigo-400">{agent.tasksCompleted.toLocaleString()}</p>
                </div>
              </div>

              <div>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-2">Core Capabilities</p>
                <div className="flex flex-wrap gap-2">
                  {agent.capabilities.map(cap => (
                    <span key={cap} className="px-2 py-1 bg-slate-800 text-slate-300 text-[10px] rounded border border-slate-700">
                      {cap}
                    </span>
                  ))}
                </div>
              </div>

              <div className="mt-5 pt-4 border-t border-slate-800 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1"><Activity className="h-3 w-3" /> Last Active: {new Date(agent.lastActive).toLocaleTimeString()}</span>
                <button className="text-indigo-400 hover:text-indigo-300 font-medium">View Logs →</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
