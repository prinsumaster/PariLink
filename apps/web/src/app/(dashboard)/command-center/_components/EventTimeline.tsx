'use client';

import React, { useState, useEffect } from 'react';
import { Clock, Truck, ShieldAlert, FileText, CheckCircle2, User, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

type TimelineEvent = {
  id: string;
  type: 'driver_assigned' | 'vehicle_started' | 'gps_updated' | 'load_delayed' | 'document_uploaded' | 'ai_recommendation';
  title: string;
  description: string;
  timestamp: string;
  entityId: string;
  entityType: 'driver' | 'vehicle' | 'load' | 'document' | 'anomaly';
};

const FAKE_EVENTS: TimelineEvent[] = [
  { id: '1', type: 'ai_recommendation', title: 'Route Inefficiency Detected', description: 'AI suggests alternative route for Trip T-8422 due to heavy traffic on I-95.', timestamp: new Date(Date.now() - 1000 * 60 * 2).toISOString(), entityId: 'T-8422', entityType: 'anomaly' },
  { id: '2', type: 'load_delayed', title: 'Load L-992 Delayed', description: 'Driver reported 45 minute delay at pickup location warehouse A.', timestamp: new Date(Date.now() - 1000 * 60 * 15).toISOString(), entityId: 'L-992', entityType: 'load' },
  { id: '3', type: 'gps_updated', title: 'Vehicle V-102 Deviated', description: 'Vehicle V-102 deviated from planned route by > 5 miles.', timestamp: new Date(Date.now() - 1000 * 60 * 22).toISOString(), entityId: 'V-102', entityType: 'vehicle' },
  { id: '4', type: 'document_uploaded', title: 'POD Uploaded', description: 'Proof of Delivery uploaded for Load L-881.', timestamp: new Date(Date.now() - 1000 * 60 * 45).toISOString(), entityId: 'L-881', entityType: 'document' },
  { id: '5', type: 'driver_assigned', title: 'Driver Assigned', description: 'Marcus Johnson assigned to Vehicle V-105.', timestamp: new Date(Date.now() - 1000 * 60 * 60).toISOString(), entityId: 'D-12', entityType: 'driver' },
];

export function EventTimeline() {
  const [events, setEvents] = useState<TimelineEvent[]>(FAKE_EVENTS);

  // In a real app, we'd subscribe to the EventBus here.
  
  const getIcon = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'driver_assigned': return <User className="h-4 w-4 text-blue-500" />;
      case 'vehicle_started': return <Truck className="h-4 w-4 text-emerald-500" />;
      case 'gps_updated': return <Clock className="h-4 w-4 text-slate-500" />;
      case 'load_delayed': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
      case 'document_uploaded': return <FileText className="h-4 w-4 text-indigo-500" />;
      case 'ai_recommendation': return <ShieldAlert className="h-4 w-4 text-rose-500" />;
      default: return <CheckCircle2 className="h-4 w-4 text-slate-500" />;
    }
  };

  return (
    <div className="h-full w-full bg-white dark:bg-slate-950 overflow-y-auto p-4">
      <div className="max-w-4xl mx-auto">
        <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Live Operational Events</h3>
        <div className="relative border-l border-slate-200 dark:border-slate-800 ml-3 space-y-6 pb-4">
          {events.map((event) => (
            <div key={event.id} className="relative pl-6 group cursor-pointer">
              <div className="absolute -left-[9px] top-1 h-4 w-4 rounded-full bg-white dark:bg-slate-950 border-2 border-slate-200 dark:border-slate-700 flex items-center justify-center group-hover:border-indigo-500 transition-colors">
                <div className="h-1.5 w-1.5 rounded-full bg-slate-300 dark:bg-slate-600 group-hover:bg-indigo-500" />
              </div>
              
              <div className="flex items-start gap-3">
                <div className="mt-0.5 p-1.5 rounded-md bg-slate-100 dark:bg-slate-800">
                  {getIcon(event.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                      {event.title}
                    </p>
                    <time className="text-xs text-slate-500 shrink-0">
                      {format(new Date(event.timestamp), 'HH:mm:ss')}
                    </time>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-0.5 line-clamp-2">
                    {event.description}
                  </p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="inline-flex items-center rounded-md bg-slate-100 dark:bg-slate-800 px-2 py-1 text-xs font-medium text-slate-600 dark:text-slate-400">
                      {event.entityType}: {event.entityId}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
