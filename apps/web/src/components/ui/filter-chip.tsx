"use client";

import React from 'react';
import { X, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

export interface FilterChipProps {
  label: string;
  value?: string | number;
  selected?: boolean;
  onSelect?: () => void;
  onRemove?: () => void;
  icon?: React.ReactNode;
  variant?: 'default' | 'status' | 'date';
  color?: 'blue' | 'emerald' | 'amber' | 'rose' | 'slate';
  disabled?: boolean;
}

const colorMap = {
  blue: 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-500/10 dark:text-blue-400 dark:border-blue-500/20 hover:bg-blue-100 dark:hover:bg-blue-500/20',
  emerald: 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20',
  amber: 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-500/10 dark:text-amber-400 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20',
  rose: 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-500/10 dark:text-rose-400 dark:border-rose-500/20 hover:bg-rose-100 dark:hover:bg-rose-500/20',
  slate: 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700',
};

export function FilterChip({
  label,
  value,
  selected = false,
  onSelect,
  onRemove,
  icon,
  variant = 'default',
  color = 'slate',
  disabled = false,
}: FilterChipProps) {
  const isSelectable = !!onSelect;
  const isRemovable = !!onRemove;

  const baseStyles = "inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-200";
  const unselectedStyles = "bg-white text-slate-700 border-slate-200 hover:bg-slate-50 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800 dark:hover:bg-slate-800";
  
  const appliedStyles = selected || variant !== 'default' ? colorMap[color] : unselectedStyles;

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={isSelectable ? onSelect : undefined}
      disabled={disabled}
      className={cn(
        baseStyles,
        appliedStyles,
        isSelectable && !disabled ? "cursor-pointer" : "cursor-default",
        disabled && "opacity-50 cursor-not-allowed",
      )}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {selected && variant === 'default' && (
        <Check className="h-3 w-3 shrink-0" strokeWidth={3} />
      )}
      
      <span className="truncate max-w-[150px]">{label}</span>
      
      {value !== undefined && (
        <span className="ml-1 bg-white/50 dark:bg-black/20 px-1.5 rounded-md text-[10px]">
          {value}
        </span>
      )}

      {isRemovable && (
        <div
          role="button"
          tabIndex={0}
          className="ml-1 p-0.5 rounded-full hover:bg-black/10 dark:hover:bg-white/10 transition-colors"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.stopPropagation();
              onRemove();
            }
          }}
        >
          <X className="h-3 w-3" />
        </div>
      )}
    </motion.button>
  );
}
