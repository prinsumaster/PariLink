import * as React from 'react';
import { cn } from '@/lib/utils';
import { CheckCircle2, AlertTriangle, XCircle, Activity, Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export type HealthStatus = 'HEALTHY' | 'WARNING' | 'ERROR' | 'OFFLINE' | 'SYNCING';

interface HealthBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  status: HealthStatus;
  lastSync?: Date;
  details?: string;
  showIcon?: boolean;
}

export function HealthBadge({ status, lastSync, details, showIcon = true, className, ...props }: HealthBadgeProps) {
  const getStatusConfig = (s: HealthStatus) => {
    switch (s) {
      case 'HEALTHY':
        return {
          icon: <CheckCircle2 className="h-3.5 w-3.5" />,
          colorClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-900',
          pulse: false,
          label: 'Healthy'
        };
      case 'WARNING':
        return {
          icon: <AlertTriangle className="h-3.5 w-3.5" />,
          colorClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-900',
          pulse: false,
          label: 'Warning'
        };
      case 'ERROR':
        return {
          icon: <XCircle className="h-3.5 w-3.5" />,
          colorClass: 'bg-destructive/15 text-destructive dark:text-red-400 border-destructive/30 dark:border-red-900',
          pulse: false,
          label: 'Error'
        };
      case 'SYNCING':
        return {
          icon: <Loader2 className="h-3.5 w-3.5 animate-spin" />,
          colorClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-200 dark:border-blue-900',
          pulse: false,
          label: 'Syncing'
        };
      case 'OFFLINE':
      default:
        return {
          icon: <Activity className="h-3.5 w-3.5" />,
          colorClass: 'bg-muted text-muted-foreground border-border',
          pulse: true,
          label: 'Offline'
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <div className={cn('flex items-center gap-2', className)} {...props} title={details}>
      <Badge 
        variant="outline" 
        className={cn(
          "flex items-center gap-1.5 font-medium px-2.5 py-0.5",
          config.colorClass
        )}
      >
        {showIcon && config.icon}
        {config.label}
      </Badge>
      {lastSync && (
        <span className="text-xs text-muted-foreground whitespace-nowrap">
          Sync: {lastSync.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      )}
    </div>
  );
}
