'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Truck, AlertTriangle, ArrowRight, BrainCircuit, Activity } from 'lucide-react';

interface ContextPanelProps {
  selectedEntityId: string | null;
}

export function ContextPanel({ selectedEntityId }: ContextPanelProps) {
  if (!selectedEntityId) {
    return (
      <div className="w-96 border-l border-slate-800 bg-slate-950 p-6 flex items-center justify-center text-slate-500">
        <div className="text-center">
          <BrainCircuit className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>Select an entity on the map<br/>to view AI insights.</p>
        </div>
      </div>
    );
  }

  const [entityData, setEntityData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedEntityId) return;
    
    const fetchContext = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/v1/operations/context/${selectedEntityId}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
        });
        if (res.ok) {
          const data = await res.json();
          setEntityData(data);
        } else {
          setEntityData(null);
        }
      } catch (e) {
        setEntityData(null);
      } finally {
        setLoading(false);
      }
    };
    fetchContext();
  }, [selectedEntityId]);

  const isTrip = selectedEntityId.startsWith('TRP');
  const isVehicle = selectedEntityId.startsWith('TRK');
  
  if (loading) {
    return (
      <div className="w-96 border-l border-slate-800 bg-slate-950 flex flex-col shrink-0 text-slate-100 h-full items-center justify-center">
        <Activity className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  return (
    <div className="w-96 border-l border-slate-800 bg-slate-950 flex flex-col shrink-0 text-slate-100 h-full">
      {/* Header */}
      <div className="p-6 border-b border-slate-800 bg-slate-900/50 shrink-0">
        <div className="flex items-center justify-between mb-4">
          <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/20">
            {entityData?.type || (isTrip ? 'TRIP' : isVehicle ? 'VEHICLE' : 'WAREHOUSE')}
          </Badge>
          <span className="text-xs text-slate-500">ID: {selectedEntityId}</span>
        </div>
        <h2 className="text-2xl font-bold tracking-tight mb-1 flex items-center gap-2">
          {isTrip ? <AlertTriangle className="text-amber-500 h-6 w-6" /> : isVehicle ? <Truck className="text-emerald-500 h-6 w-6" /> : <Building2 className="text-blue-500 h-6 w-6" />}
          {entityData?.name || selectedEntityId}
        </h2>
        <p className="text-sm text-slate-400">
          {entityData?.description || 'Details unavailable'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        
        {/* AI Insight Section */}
        {entityData?.aiInsight && (
          <Card className="bg-amber-500/10 border-amber-500/20 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-amber-500 flex items-center gap-2">
                <BrainCircuit className="h-4 w-4" /> AI Risk Analysis
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-200 mb-3">
                {entityData.aiInsight}
              </p>
              <Button size="sm" className="w-full bg-amber-600 hover:bg-amber-700 text-white">
                Generate Recovery Plan
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Prediction Data */}
        <Card className="bg-slate-900 border-slate-800 shadow-none">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-slate-300">Predicted Future State</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Risk Score:</span>
              <span className={entityData?.riskScore > 50 ? 'text-amber-400 font-bold' : 'text-emerald-400 font-bold'}>
                {entityData?.riskScore || 0}/100
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-slate-500">Estimated Delay:</span>
              <span>{entityData?.estimatedDelay || 'None'}</span>
            </div>
          </CardContent>
        </Card>

        {/* Dependencies */}
        {entityData?.dependencies && entityData.dependencies.length > 0 && (
          <Card className="bg-slate-900 border-slate-800 shadow-none">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-slate-300 flex items-center justify-between">
                Blast Radius
                <Badge variant="outline" className="text-xs">Depth: 1</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {entityData.dependencies.map((dep: any, idx: number) => (
                  <div key={idx} className="flex items-center justify-between p-2 rounded bg-slate-800/50 text-sm">
                    <span className="flex items-center gap-2"><Truck className="h-4 w-4 text-slate-400" /> {dep.name}</span>
                    <ArrowRight className="h-3 w-3 text-slate-600" />
                  </div>
                ))}
                <Button variant="ghost" size="sm" className="w-full mt-2 text-xs text-indigo-400">
                  View Full Graph Context
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
