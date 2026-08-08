import React from 'react';
import { cn } from '@/lib/utils';

interface PageShellProps {
  /** Page title */
  title: string;
  /** Subtitle / description */
  description?: string;
  /** Right-side CTA actions */
  actions?: React.ReactNode;
  /** Optional breadcrumb or status line below title */
  meta?: React.ReactNode;
  /** Page content */
  children: React.ReactNode;
  /** Additional className for the outer wrapper */
  className?: string;
  /** Whether to apply a fade-in-up animation */
  animate?: boolean;
}

/**
 * PageShell — universal page wrapper for all PariLink dashboard pages.
 * Provides consistent spacing, header layout, and page-enter animation.
 */
export function PageShell({
  title,
  description,
  actions,
  meta,
  children,
  className,
  animate = true,
}: PageShellProps) {
  return (
    <div
      className={cn(
        'flex flex-col h-full min-h-0 bg-background',
        animate && 'page-enter',
        className,
      )}
    >
      {/* Page Header */}
      <div className="flex items-start justify-between gap-4 px-6 py-5 border-b border-border bg-background/80 backdrop-blur-sm shrink-0">
        <div className="min-w-0 flex-1">
          <h1 className="text-2xl font-bold tracking-tight text-foreground truncate">
            {title}
          </h1>
          {description && (
            <p className="mt-0.5 text-sm text-muted-foreground truncate">
              {description}
            </p>
          )}
          {meta && <div className="mt-2">{meta}</div>}
        </div>

        {actions && (
          <div className="flex items-center gap-2 shrink-0 pt-0.5">
            {actions}
          </div>
        )}
      </div>

      {/* Page Content */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-6 py-5">
        {children}
      </div>
    </div>
  );
}

/**
 * PageShellSection — a titled section inside a PageShell.
 */
export function PageShellSection({
  title,
  description,
  children,
  className,
}: {
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('space-y-4', className)}>
      {(title || description) && (
        <div>
          {title && (
            <h2 className="text-base font-semibold text-foreground">{title}</h2>
          )}
          {description && (
            <p className="text-sm text-muted-foreground mt-0.5">{description}</p>
          )}
        </div>
      )}
      {children}
    </section>
  );
}
