import * as React from 'react';
import { cn } from '@/lib/utils';
import { FadeIn } from '@/components/ui/motion';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  breadcrumbs?: React.ReactNode;
}

export function PageHeader({ title, description, actions, breadcrumbs, className, ...props }: PageHeaderProps) {
  return (
    <FadeIn className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between mb-8", className)} {...props}>
      <div className="flex flex-col gap-1">
        {breadcrumbs && <div className="mb-2">{breadcrumbs}</div>}
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{title}</h1>
        {description && (
          <div className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl leading-relaxed">
            {description}
          </div>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-2 shrink-0">
          {actions}
        </div>
      )}
    </FadeIn>
  );
}
