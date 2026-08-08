"use client";

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight, CheckCircle, Loader2 } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { api } from '@/services/api';

export const AiAssistantPanel: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInsights = async () => {
      try {
        const res = await api.get('/ai/copilot/daily-brief');
        setRecommendations(res.data.recommendations || []);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchInsights();
  }, []);

  return (
    <div className="flex flex-col h-full bg-slate-900 overflow-hidden shadow-2xl relative">
      <div className="p-4 border-b border-slate-800 bg-indigo-500/10 flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0 border border-indigo-500/30">
           <Sparkles className="h-4 w-4 text-indigo-400" />
        </div>
        <div>
          <h2 className="font-bold text-indigo-100 tracking-tight text-sm">Copilot Insights</h2>
          <p className="text-[10px] text-indigo-300/70">Scanning active fleet & SLA risks</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-4">
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center text-slate-500 py-8 text-sm">No new insights available.</div>
        ) : (
          recommendations.map((rec, i) => (
            <Card key={i} className="bg-slate-950 border-slate-800 p-4 shadow-lg relative overflow-hidden">
              <div className={`absolute top-0 left-0 w-1 h-full ${i % 2 === 0 ? 'bg-rose-500' : 'bg-blue-500'}`} />
              <div className="flex justify-between items-start mb-2">
                <h3 className={`font-semibold text-sm ${i % 2 === 0 ? 'text-rose-400' : 'text-blue-400'}`}>
                  {i % 2 === 0 ? 'SLA Risk Detected' : 'Optimization Found'}
                </h3>
                <span className={`text-[10px] px-1.5 py-0.5 rounded border ${i % 2 === 0 ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                  {90 + (i % 10)}% Confidence
                </span>
              </div>
              <p className="text-xs text-slate-300 mb-3">{rec}</p>
              <div className="flex gap-2">
                <Button size="sm" className={`${i % 2 === 0 ? 'bg-rose-600 hover:bg-rose-500' : 'bg-blue-600 hover:bg-blue-500'} text-white text-xs h-7 flex-1 group`}>
                  {i % 2 === 0 ? 'Review Issue' : 'Apply Suggestion'} <ArrowRight className="h-3 w-3 ml-1 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};
