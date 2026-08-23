'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface StatusFlipProps {
  statusKey: string;
  children: ReactNode;
  className?: string;
}

export function StatusFlip({ statusKey, children, className = '' }: StatusFlipProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <div className={`relative inline-block ${className}`} style={{ perspective: 1000 }}>
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={statusKey}
          initial={shouldReduceMotion ? { opacity: 0 } : { rotateX: 90, opacity: 0 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { rotateX: 0, opacity: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { rotateX: -90, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          style={{ transformOrigin: 'center center' }}
        >
          {children}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
