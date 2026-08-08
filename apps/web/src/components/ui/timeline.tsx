import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';
import { StaggerContainer, StaggerItem } from '@/components/ui/motion';

export interface TimelineItem {
  id: string;
  title: string;
  description?: React.ReactNode;
  time?: string;
  icon?: React.ReactNode;
  status?: 'success' | 'warning' | 'error' | 'default';
  isLast?: boolean;
}

interface TimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  items: TimelineItem[];
}

export function Timeline({ items, className, ...props }: TimelineProps) {
  return (
    <StaggerContainer className={cn('space-y-4', className)} {...props}>
      {items.map((item, index) => (
        <TimelineItemComponent
          key={item.id}
          item={item}
          isLast={index === items.length - 1}
        />
      ))}
    </StaggerContainer>
  );
}

function TimelineItemComponent({
  item,
  isLast,
}: {
  item: TimelineItem;
  isLast: boolean;
}) {
  const statusColors = {
    success: 'bg-emerald-500 text-white border-emerald-600',
    warning: 'bg-amber-500 text-white border-amber-600',
    error: 'bg-destructive text-destructive-foreground border-destructive',
    default: 'bg-muted text-muted-foreground border-border',
  };

  const statusColor = statusColors[item.status || 'default'];

  return (
    <StaggerItem className={cn('relative flex gap-4')}>
      {/* Timeline Line */}
      {!isLast && (
        <div
          className="absolute left-[15px] top-8 bottom-[-16px] w-0.5 bg-border rounded-full"
          aria-hidden="true"
        />
      )}

      {/* Node / Icon */}
      <div
        className={cn(
          'relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2',
          'shadow-sm z-10 transition-transform hover:scale-110',
          statusColor
        )}
      >
        {item.icon ? (
          item.icon
        ) : item.status === 'success' ? (
          <Check className="h-4 w-4" />
        ) : (
          <div className="h-2 w-2 rounded-full bg-current" />
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col pb-4 pt-1 flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground truncate">
            {item.title}
          </h4>
          {item.time && (
            <time className="text-xs font-medium text-muted-foreground shrink-0 tabular-nums">
              {item.time}
            </time>
          )}
        </div>
        {item.description && (
          <div className="mt-1 text-sm text-muted-foreground line-clamp-2 leading-relaxed">
            {item.description}
          </div>
        )}
      </div>
    </StaggerItem>
  );
}
