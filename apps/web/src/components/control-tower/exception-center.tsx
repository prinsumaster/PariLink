'use client';

import React from 'react';
import { useControlTowerStore } from '../../store/control-tower.store';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';

export const ExceptionCenter = () => {
  const exceptions = useControlTowerStore((state) => state.exceptions);

  const getSeverityColor = (ruleType: string) => {
    if (ruleType.includes('CRITICAL') || ruleType === 'OVERSPEEDING') return 'bg-red-500/10 text-red-500 border-red-500/20';
    if (ruleType === 'LATE_DELIVERY') return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
    if (ruleType === 'IDLE') return 'bg-amber-500/10 text-amber-500 border-amber-500/20';
    return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
  };

  return (
    <div className="flex flex-col space-y-3">
      {exceptions.length === 0 ? (
        <div className="text-center text-slate-500 text-sm mt-10">No active exceptions</div>
      ) : (
        <AnimatePresence initial={false}>
          {exceptions.map((exc) => (
            <motion.div
              key={exc.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className={`rounded-lg p-3 border flex flex-col space-y-2 ${getSeverityColor(exc.ruleType)}`}
            >
              <div className="flex justify-between items-start">
                <span className="text-xs font-bold uppercase tracking-wider">
                  {exc.ruleType.replace(/_/g, ' ')}
                </span>
                <span className="text-xs opacity-70">
                  {formatDistanceToNow(new Date(exc.timestamp), { addSuffix: true })}
                </span>
              </div>
              <p className="text-sm font-medium text-slate-200">
                Alert triggered for Vehicle or System Entity
              </p>
              <div className="flex space-x-2 mt-2">
                <button className="text-xs font-medium bg-white/10 hover:bg-white/20 px-2 py-1 rounded transition-colors">
                  Investigate
                </button>
                <button className="text-xs font-medium bg-white/5 hover:bg-white/10 px-2 py-1 rounded transition-colors">
                  Acknowledge
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      )}
    </div>
  );
};
