'use client';

import React from 'react';
import { useControlTowerStore } from '../../store/control-tower.store';
import { motion, AnimatePresence } from 'framer-motion';
import { Navigation2, LogIn, Fuel, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { format } from 'date-fns';

export const EventStream = () => {
  const events = useControlTowerStore((state) => state.events);

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'GEOFENCE_ENTERED': return <Navigation2 className="w-4 h-4 text-emerald-400" />;
      case 'GEOFENCE_EXITED': return <Navigation2 className="w-4 h-4 text-blue-400 transform rotate-180" />;
      case 'TRIP_STARTED': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'VEHICLE_DELAYED': return <AlertTriangle className="w-4 h-4 text-amber-500" />;
      case 'FUEL_FILLED': return <Fuel className="w-4 h-4 text-purple-400" />;
      default: return <LogIn className="w-4 h-4 text-slate-400" />;
    }
  };

  const getEventDescription = (event: any) => {
    switch (event.type) {
      case 'GEOFENCE_ENTERED': return `Entered ${event.geofenceName || 'Checkpoint'}`;
      case 'GEOFENCE_EXITED': return `Exited ${event.geofenceName || 'Checkpoint'}`;
      default: return event.type.replace(/_/g, ' ');
    }
  };

  return (
    <div className="flex flex-col space-y-3">
      {events.length === 0 ? (
        <div className="text-center text-slate-500 text-sm mt-10">Waiting for live events...</div>
      ) : (
        <AnimatePresence initial={false}>
          {events.map((event) => (
            <motion.div
              key={event.id}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="bg-slate-800/50 hover:bg-slate-800 rounded-lg p-3 border border-slate-700/50 flex space-x-3 items-start transition-colors"
            >
              <div className="mt-0.5 p-1.5 bg-slate-900 rounded-md shrink-0">
                {getEventIcon(event.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-slate-200 truncate">
                    {event.vehicleId}
                  </p>
                  <span className="text-xs text-slate-500 shrink-0 tabular-nums">
                    {format(new Date(event.timestamp), 'HH:mm:ss')}
                  </span>
                </div>
                <p className="text-sm text-slate-400 mt-0.5 truncate capitalize">
                  {getEventDescription(event)}
                </p>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
