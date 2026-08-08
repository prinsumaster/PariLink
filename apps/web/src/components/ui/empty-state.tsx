import React from 'react';
import { Button } from './button';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { FadeIn } from '@/components/ui/motion';

interface EmptyStateProps {
  title: string;
  description: string;
  icon: LucideIcon;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
  action?: { label: string; onClick: () => void; icon?: LucideIcon };
}

export function EmptyState({
  title,
  description,
  icon: Icon,
  actionLabel,
  actionHref,
  onAction,
  action
}: EmptyStateProps) {
  return (
    <FadeIn className="w-full flex flex-col items-center justify-center p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/20 shadow-sm transition-all hover:bg-slate-50 dark:hover:bg-slate-900/40">
      <div className="w-20 h-20 mb-6 rounded-full bg-blue-100/50 dark:bg-blue-900/20 flex items-center justify-center ring-8 ring-blue-50 dark:ring-blue-900/10 shadow-sm">
        <Icon className="w-10 h-10 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2 tracking-tight">{title}</h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 leading-relaxed text-sm">
        {description}
      </p>
      
      <div className="flex items-center gap-3">
        {actionLabel && (actionHref ? (
          <Link href={actionHref} passHref>
            <Button size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
              {actionLabel}
            </Button>
          </Link>
        ) : (
          <Button onClick={onAction} size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            {actionLabel}
          </Button>
        ))}

        {!actionLabel && action && (
          <Button onClick={action.onClick} size="lg" className="rounded-full shadow-sm hover:shadow-md transition-all active:scale-[0.98]">
            {action.icon && <action.icon className="w-4 h-4 mr-2" />}
            {action.label}
          </Button>
        )}
      </div>
    </FadeIn>
  );
}
