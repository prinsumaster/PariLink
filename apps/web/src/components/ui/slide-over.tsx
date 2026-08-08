'use client';

import React from 'react';
import { cn } from '@/lib/utils';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface SlideOverProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  /** Footer content (actions, buttons) */
  footer?: React.ReactNode;
  children: React.ReactNode;
  /** Panel width */
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const SIZE_MAP = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-xl',
};

/**
 * SlideOver — premium right-side drawer panel.
 * Used for detail views, forms, and contextual info without losing page context.
 * Built on top of the existing Sheet/Dialog primitives for full accessibility.
 */
export function SlideOver({
  open,
  onClose,
  title,
  description,
  footer,
  children,
  size = 'md',
}: SlideOverProps) {
  // Trap focus & lock scroll when open
  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  if (!open) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={cn(
          'fixed inset-y-0 right-0 z-50 flex flex-col',
          'w-full shadow-2xl',
          'bg-background border-l border-border',
          'animate-slide-in-right',
          SIZE_MAP[size],
        )}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 px-6 py-4 border-b border-border shrink-0">
          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-foreground truncate">{title}</h2>
            {description && (
              <p className="text-sm text-muted-foreground mt-0.5 truncate">{description}</p>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={onClose}
            className="shrink-0 rounded-md text-muted-foreground hover:text-foreground"
            aria-label="Close panel"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-4">
          {children}
        </div>

        {/* Footer */}
        {footer && (
          <div className="shrink-0 border-t border-border px-6 py-4 bg-muted/30">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
