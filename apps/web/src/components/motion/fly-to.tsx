'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface FlyToProps {
  children: ReactNode;
  layoutId?: string;
  isVisible: boolean;
  className?: string;
  onAnimationComplete?: () => void;
}

export function FlyTo({ children, layoutId, isVisible, className = '', onAnimationComplete }: FlyToProps) {
  const shouldReduceMotion = useReducedMotion();

  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {isVisible && (
        <motion.div
          layoutId={layoutId}
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, scale: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 30
          }}
          className={className}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
