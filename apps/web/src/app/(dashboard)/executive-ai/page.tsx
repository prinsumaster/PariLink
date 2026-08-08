import React from 'react';
import { BrainCircuit, MessageSquare, TrendingUp } from 'lucide-react';

export default function ExecutiveAiPage() {
  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100 flex flex-col">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          Executive AI Copilot
        </h1>
        <p className="text-slate-400 mt-2">Natural language queries for C-Suite insights.</p>
      </header>
      
      <div className="flex-1 flex flex-col bg-slate-900/50 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div className="flex-1 overflow-y-auto mb-4 space-y-4">
          <div className="bg-slate-800/50 p-4 rounded-xl max-w-2xl border border-slate-700">
            <p className="text-slate-300">How can I help you today?</p>
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-full text-xs text-slate-400 cursor-pointer hover:bg-slate-800 transition">Which customer is becoming unprofitable?</span>
              <span className="px-3 py-1 bg-slate-950 border border-slate-700 rounded-full text-xs text-slate-400 cursor-pointer hover:bg-slate-800 transition">Predict next month's revenue.</span>
            </div>
          </div>
        </div>
        
        <div className="relative">
          <input 
            type="text" 
            placeholder="Ask anything about the business..." 
            className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-4 pl-12 text-slate-200 focus:outline-none focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
          />
          <MessageSquare className="absolute left-4 top-4 text-slate-500 w-5 h-5" />
        </div>
      </div>
    </div>
  );
}
