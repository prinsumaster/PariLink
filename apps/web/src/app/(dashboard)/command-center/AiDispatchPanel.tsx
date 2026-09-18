'use client';

import { Sparkles, Truck, User } from 'lucide-react';

interface DispatchRecommendation {
  tripId: string;
  tripNumber: string;
  vehicleId: string | null;
  vehicleName: string;
  driverId: string | null;
  driverName: string;
  confidenceScore: number;
  reasoning: string;
}

interface AiDispatchPanelProps {
  recommendations: DispatchRecommendation[];
  isLoading: boolean;
}

export function AiDispatchPanel({ recommendations, isLoading }: AiDispatchPanelProps) {
  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-white/10 flex items-center justify-between bg-gradient-to-r from-indigo-500/10 to-purple-500/10">
        <h2 className="text-xl font-semibold text-white flex items-center">
          <Sparkles className="w-5 h-5 mr-2 text-indigo-400" />
          AI Dispatch Engine
        </h2>
        <span className="text-xs font-medium bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full border border-indigo-500/30">
          Live Recommendations
        </span>
      </div>
      
      <div className="p-0 overflow-auto flex-1">
        {isLoading ? (
          <div className="p-8 flex flex-col items-center justify-center text-white/50 space-y-4">
            <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            <p>Analyzing pending trips and fleet capacity...</p>
          </div>
        ) : recommendations.length === 0 ? (
          <div className="p-8 text-center text-white/50">
            <p>No pending trips require recommendations.</p>
          </div>
        ) : (
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-black/20">
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider border-b border-white/10">Trip</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider border-b border-white/10">Assignment</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider border-b border-white/10">Confidence</th>
                <th className="p-4 text-xs font-semibold text-white/60 uppercase tracking-wider border-b border-white/10">Reasoning</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {recommendations.map((rec) => (
                <tr key={rec.tripId} className="hover:bg-white/5 transition-colors group">
                  <td className="p-4 align-top">
                    <span className="font-mono text-sm text-indigo-300 bg-indigo-900/40 px-2 py-1 rounded">
                      {rec.tripNumber}
                    </span>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex flex-col space-y-2">
                      <div className="flex items-center text-sm text-white/90">
                        <Truck className="w-4 h-4 mr-2 text-white/40 group-hover:text-white/70 transition-colors" />
                        {rec.vehicleName}
                      </div>
                      <div className="flex items-center text-sm text-white/90">
                        <User className="w-4 h-4 mr-2 text-white/40 group-hover:text-white/70 transition-colors" />
                        {rec.driverName}
                      </div>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <div className="flex items-center">
                      <div className="w-full bg-black/40 rounded-full h-2.5 mr-3 max-w-[80px]">
                        <div 
                          className={`h-2.5 rounded-full ${
                            rec.confidenceScore >= 95 ? 'bg-emerald-500' :
                            rec.confidenceScore >= 90 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${rec.confidenceScore}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-semibold text-white">{rec.confidenceScore}%</span>
                    </div>
                  </td>
                  <td className="p-4 align-top">
                    <p className="text-sm text-white/70 line-clamp-2">
                      {rec.reasoning}
                    </p>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
