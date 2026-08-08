import React from 'react';
import { Activity, Clock, Zap } from 'lucide-react';

export default function PredictionsPage() {
  return (
    <div className="p-6 bg-slate-950 min-h-screen text-slate-100">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">
          AI Predictions Engine
        </h1>
        <p className="text-slate-400 mt-2">Real-time ETA and fuel consumption models.</p>
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placeholder cards for MVP */}
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-blue-400 mb-4">
            <Clock className="w-6 h-6" />
            <h2 className="text-lg font-semibold text-slate-200">ETA Predictor</h2>
          </div>
          <p className="text-3xl font-mono text-white mb-2">98.2% Accuracy</p>
          <p className="text-sm text-slate-500">Based on last 1M trips</p>
        </div>
        
        <div className="glass-panel p-6 rounded-xl border border-white/5 bg-slate-900/50 backdrop-blur-xl">
          <div className="flex items-center space-x-3 text-green-400 mb-4">
            <Zap className="w-6 h-6" />
            <h2 className="text-lg font-semibold text-slate-200">Fuel Predictor</h2>
          </div>
          <p className="text-3xl font-mono text-white mb-2">94.7% Accuracy</p>
          <p className="text-sm text-slate-500">Savings identified: $1.2M</p>
        </div>
      </div>
    </div>
  );
}
