'use client';

import { motion, useMotionValue, useTransform, animate, useReducedMotion } from 'framer-motion';
import { useEffect } from 'react';

interface CountUpProps {
  value: number;
  duration?: number;
  formatFn?: (val: number) => string;
  className?: string;
}

export function CountUp({ value, duration = 1.5, formatFn, className = '' }: CountUpProps) {
  const shouldReduceMotion = useReducedMotion();
  const count = useMotionValue(value);
  const rounded = useTransform(count, (latest) => 
    formatFn ? formatFn(latest) : Math.round(latest).toLocaleString()
  );

  useEffect(() => {
    if (shouldReduceMotion) {
      count.set(value);
      return;
    }
    
    const controls = animate(count, value, {
      duration: duration,
      ease: "easeOut"
    });
    
    return controls.stop;
  }, [value, duration, shouldReduceMotion, count]);

  return <motion.span className={className}>{rounded}</motion.span>;
}
