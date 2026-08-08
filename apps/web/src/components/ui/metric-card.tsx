"use client";

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  icon?: LucideIcon;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  colorTheme?: 'brand' | 'success' | 'warning' | 'error' | 'default';
  className?: string;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  title,
  value,
  icon: Icon,
  trend,
  colorTheme = 'default',
  className = '',
}) => {
  const themeStyles = {
    default: 'text-slate-100',
    brand: 'text-indigo-400',
    success: 'text-emerald-400',
    warning: 'text-amber-400',
    error: 'text-rose-400',
  };

  return (
    <Card className={`bg-slate-900/80 backdrop-blur border-slate-800 overflow-hidden relative shadow-lg ${className}`}>
      {/* Accent border top */}
      {colorTheme !== 'default' && (
        <div className={`absolute top-0 left-0 w-full h-1 ${
          colorTheme === 'brand' ? 'bg-indigo-500' :
          colorTheme === 'success' ? 'bg-emerald-500' :
          colorTheme === 'warning' ? 'bg-amber-500' :
          'bg-rose-500'
        }`} />
      )}
      
      <CardContent className="p-5 flex flex-col justify-between h-full">
        <div className="flex justify-between items-start mb-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
          {Icon && (
            <div className={`p-1.5 rounded-md bg-slate-800/50 ${themeStyles[colorTheme]}`}>
              <Icon className="h-4 w-4 opacity-80" />
            </div>
          )}
        </div>
        
        <div className="flex items-end gap-3 mt-1">
          <h3 className={`text-3xl font-bold tracking-tight ${themeStyles[colorTheme]}`}>{value}</h3>
          
          {trend && (
            <div className={`flex items-center text-xs font-medium mb-1 ${trend.isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
              <span className="bg-slate-800 px-1.5 py-0.5 rounded mr-1 flex items-center">
                {trend.isPositive ? '+' : '-'}{trend.value}
              </span>
              <span className="text-slate-500 font-normal">vs last week</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
