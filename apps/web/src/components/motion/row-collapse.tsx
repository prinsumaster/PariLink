'use client';

import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import { ReactNode } from 'react';

interface RowCollapseProps {
  children: ReactNode;
  isVisible: boolean;
  as?: React.ElementType;
  className?: string;
}

export function RowCollapse({ children, isVisible, as: Component = 'div', className = '' }: RowCollapseProps) {
  const shouldReduceMotion = useReducedMotion();
  const MotionComponent = motion(Component as any);

  return (
    <AnimatePresence initial={false}>
      {isVisible && (
        <MotionComponent
          initial={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, scaleY: 0.8 }}
          animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, height: 'auto', scaleY: 1 }}
          exit={shouldReduceMotion ? { opacity: 0 } : { opacity: 0, height: 0, scaleY: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: 400,
            damping: 40
          }}
          className={`overflow-hidden ${className}`}
          style={{ originY: 0 }}
        >
          {children}
        </MotionComponent>
      )}
    </AnimatePresence>
  );
}
