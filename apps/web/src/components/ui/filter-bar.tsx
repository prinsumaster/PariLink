import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';

export interface FilterChip {
  id: string;
  label: string;
  value: string;
}

interface FilterBarProps {
  filters: FilterChip[];
  onRemove: (id: string) => void;
  onClearAll?: () => void;
  className?: string;
}

/**
 * FilterBar — horizontal active-filter chip row.
 * Renders dismissible chips for each active filter with a "Clear all" button.
 */
export function FilterBar({ filters, onRemove, onClearAll, className }: FilterBarProps) {
  if (filters.length === 0) return null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2 animate-fade-in', className)}>
      <span className="text-xs font-medium text-muted-foreground shrink-0">
        Filters:
      </span>

      {filters.map((chip) => (
        <span
          key={chip.id}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1',
            'bg-primary/8 border border-primary/20 text-primary',
            'text-xs font-medium',
            'transition-all hover:bg-primary/15',
          )}
        >
          <span className="text-muted-foreground">{chip.label}:</span>
          {chip.value}
          <button
            onClick={() => onRemove(chip.id)}
            className="ml-0.5 rounded-full p-0.5 hover:bg-primary/20 transition-colors"
            aria-label={`Remove ${chip.label} filter`}
          >
            <X className="h-3 w-3" />
          </button>
        </span>
      ))}

      {onClearAll && filters.length > 1 && (
        <button
          onClick={onClearAll}
          className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors underline-offset-2 hover:underline"
        >
          Clear all
        </button>
      )}
    </div>
  );
}
