'use client';

import { cn } from '@/lib/utils';
import { Check, Circle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  status?: 'completed' | 'current' | 'pending';
  icon?: React.ReactNode;
}

interface ActivityTimelineProps {
  events: TimelineEvent[];
  className?: string;
}

export function ActivityTimeline({ events, className }: ActivityTimelineProps) {
  return (
    <div className={cn('space-y-0', className)}>
      {events.map((event, index) => (
        <div key={event.id} className="flex gap-3">
          {/* Icon column */}
          <div className="flex flex-col items-center">
            <div
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full border-2 shrink-0 z-10',
                event.status === 'completed'
                  ? 'border-emerald-500 bg-emerald-500 text-white'
                  : event.status === 'current'
                  ? 'border-blue-500 bg-blue-500 text-white'
                  : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-400'
              )}
            >
              {event.icon ?? (
                event.status === 'completed' ? (
                  <Check className="h-4 w-4" />
                ) : (
                  <Circle className="h-3 w-3" />
                )
              )}
            </div>
            {index < events.length - 1 && (
              <div
                className={cn(
                  'w-px flex-1 my-1',
                  index < events.findIndex((e) => e.status === 'current')
                    ? 'bg-emerald-300 dark:bg-emerald-700'
                    : 'bg-gray-200 dark:bg-gray-700'
                )}
                style={{ minHeight: '24px' }}
              />
            )}
          </div>

          {/* Content column */}
          <div className={cn('pb-6 flex-1', index === events.length - 1 && 'pb-0')}>
            <div className="flex items-start justify-between gap-2">
              <p
                className={cn(
                  'text-sm font-medium',
                  event.status === 'pending'
                    ? 'text-gray-400 dark:text-gray-500'
                    : 'text-gray-900 dark:text-gray-100'
                )}
              >
                {event.title}
              </p>
              <time className="text-xs text-muted-foreground whitespace-nowrap">{event.timestamp}</time>
            </div>
            {event.description && (
              <p className="mt-0.5 text-xs text-muted-foreground">{event.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
