"use client";

import { useEffect, useState } from 'react';

export interface Assignment {
  tripId: string;
  tripNumber: string;
  vehicleId: string | null;
  vehicleName: string;
  driverId: string | null;
  driverName: string;
  confidenceScore: number;
  reasoning: string;
}

export function AiDispatchPanel() {
  const [assignments, setAssignments] = useState<Assignment[] | null>(null);
  const [error, setError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    
    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('/api/v1/intelligence/dispatch/recommendations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: Assignment[] = await response.json();
        if (isMounted) {
          setAssignments(data);
          setError(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(true);
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    fetchRecommendations();
    
    const interval = setInterval(fetchRecommendations, 15000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="bg-white/10 dark:bg-black/20 backdrop-blur-lg border border-white/20 shadow-xl rounded-xl p-6 flex flex-col space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-white">AI Dispatch Recommendations</h2>
        {isLoading && (
          <span className="flex h-3 w-3 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-indigo-500"></span>
          </span>
        )}
      </div>

      {error ? (
        <div className="bg-rose-500/20 border border-rose-500/30 text-rose-200 p-4 rounded-lg">
          Failed to load AI recommendations. Please check your connection.
        </div>
      ) : isLoading && !assignments ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse flex space-x-4 p-4 rounded-lg bg-white/5 border border-white/10">
              <div className="h-12 w-12 rounded-full bg-white/10"></div>
              <div className="flex-1 space-y-2 py-1">
                <div className="h-4 bg-white/10 rounded w-3/4"></div>
                <div className="h-3 bg-white/10 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : assignments?.length === 0 ? (
        <div className="text-slate-300 text-center py-8">
          No pending trips requiring dispatch.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {assignments?.map((assignment: Assignment, idx: number) => (
            <div key={assignment.tripId || idx} className="bg-white/5 hover:bg-white/10 transition-colors border border-white/10 p-4 rounded-lg space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-medium">{assignment.tripNumber}</h4>
                  <p className="text-sm text-indigo-300">{assignment.vehicleName}</p>
                </div>
                <div className="flex items-center space-x-1 bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded text-xs font-semibold">
                  <span>{assignment.confidenceScore}%</span>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 text-sm text-slate-300">
                <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span>{assignment.driverName}</span>
              </div>
              
              <p className="text-xs text-slate-400 italic">
                "{assignment.reasoning}"
              </p>
              
              <button className="w-full mt-2 bg-indigo-600 hover:bg-indigo-500 text-white text-sm py-2 rounded transition-colors font-medium">
                Approve & Dispatch
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
