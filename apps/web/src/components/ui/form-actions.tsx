"use client";

import React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { FadeIn } from '@/components/ui/motion';

interface FormActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  onCancel?: () => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  isDirty?: boolean;
  submitLabel?: string;
  cancelLabel?: string;
  className?: string;
}

export function FormActions({
  onCancel,
  onSubmit,
  isSubmitting = false,
  isDirty = true,
  submitLabel = "Save Changes",
  cancelLabel = "Cancel",
  className,
  ...props
}: FormActionsProps) {
  return (
    <FadeIn 
      className={cn(
        "sticky bottom-0 z-40 mt-8 w-full border-t border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md px-6 py-4 flex items-center justify-end gap-3 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.02)] transition-all",
        !isDirty && "opacity-0 translate-y-full pointer-events-none",
        className
      )}
      {...props}
    >
      <div className="flex items-center gap-3 w-full sm:w-auto">
        {onCancel && (
          <Button 
            type="button" 
            variant="outline" 
            onClick={onCancel}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {cancelLabel}
          </Button>
        )}
        <Button 
          type={onSubmit ? "button" : "submit"} 
          onClick={onSubmit}
          isLoading={isSubmitting}
          disabled={!isDirty || isSubmitting}
          className="w-full sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </FadeIn>
  );
}
