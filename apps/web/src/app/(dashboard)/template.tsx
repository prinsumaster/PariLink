'use client';

import { motion } from 'framer-motion';
import { useReducedMotion } from 'framer-motion';
import { usePathname } from 'next/navigation';

export default function DashboardTemplate({ children }: { children: React.ReactNode }) {
  const prefersReducedMotion = useReducedMotion();
  const pathname = usePathname();

  return (
    <motion.div
      key={pathname}
      initial={false}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: prefersReducedMotion ? 0 : 0.15 }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}
