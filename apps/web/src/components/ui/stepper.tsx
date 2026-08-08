"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { motion } from 'framer-motion';

export interface Step {
  id: string;
  label: string;
  description?: string;
  status: 'complete' | 'current' | 'upcoming';
}

interface StepperProps {
  steps: Step[];
  className?: string;
}

export function Stepper({ steps, className }: StepperProps) {
  return (
    <div className={cn("w-full py-4", className)}>
      <div className="flex flex-col md:flex-row md:items-start md:justify-between w-full relative">
        
        {/* Background connector line for desktop */}
        <div className="hidden md:block absolute top-[15px] left-[15px] right-[15px] h-0.5 bg-slate-200 dark:bg-slate-800 -z-10" />

        {steps.map((step, index) => {
          const isComplete = step.status === 'complete';
          const isCurrent = step.status === 'current';
          const isUpcoming = step.status === 'upcoming';
          const isLast = index === steps.length - 1;

          return (
            <div key={step.id} className="relative flex md:flex-col items-center flex-1 mb-6 md:mb-0 group">
              
              {/* Vertical connector line for mobile */}
              {!isLast && (
                <div 
                  className={cn(
                    "md:hidden absolute left-[15px] top-[30px] bottom-[-20px] w-0.5 -z-10",
                    isComplete ? "bg-emerald-500" : "bg-slate-200 dark:bg-slate-800"
                  )} 
                />
              )}

              {/* Progress connector line overlay for desktop */}
              {isComplete && !isLast && (
                <motion.div 
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="hidden md:block absolute top-[15px] left-[50%] right-[-50%] h-0.5 bg-emerald-500 -z-10 origin-left"
                />
              )}

              {/* Step indicator node */}
              <div 
                className={cn(
                  "relative flex items-center justify-center w-8 h-8 rounded-full border-2 transition-all duration-300 shadow-sm z-10 shrink-0",
                  isComplete ? "bg-emerald-500 border-emerald-500 text-white" :
                  isCurrent ? "bg-white dark:bg-slate-900 border-blue-500 ring-4 ring-blue-500/20" :
                  "bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400"
                )}
              >
                {isComplete ? (
                  <Check className="w-4 h-4" strokeWidth={3} />
                ) : (
                  <span className={cn(
                    "text-xs font-semibold",
                    isCurrent ? "text-blue-600 dark:text-blue-400" : ""
                  )}>
                    {index + 1}
                  </span>
                )}
              </div>

              {/* Step text content */}
              <div className="ml-4 md:ml-0 md:mt-3 flex flex-col md:items-center text-left md:text-center w-full">
                <span 
                  className={cn(
                    "text-sm font-semibold transition-colors duration-200",
                    isComplete ? "text-slate-900 dark:text-slate-100" :
                    isCurrent ? "text-blue-600 dark:text-blue-400" :
                    "text-slate-500 dark:text-slate-400"
                  )}
                >
                  {step.label}
                </span>
                {step.description && (
                  <span className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-[120px]">
                    {step.description}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
