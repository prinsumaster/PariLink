import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
  isCompleted?: boolean;
}

interface InstallWizardProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: WizardStep[];
  currentStepIndex: number;
  onNext?: () => void;
  onBack?: () => void;
  onCancel?: () => void;
  nextLabel?: string;
  isNextDisabled?: boolean;
  isLoading?: boolean;
  children: React.ReactNode;
}

export function InstallWizard({
  steps,
  currentStepIndex,
  onNext,
  onBack,
  onCancel,
  nextLabel = 'Next',
  isNextDisabled = false,
  isLoading = false,
  children,
  className,
  ...props
}: InstallWizardProps) {
  return (
    <div className={cn("flex flex-col h-full bg-background", className)} {...props}>
      {/* Header / Stepper */}
      <div className="border-b bg-card/50 px-6 py-6 overflow-x-auto">
        <div className="flex items-center min-w-max mx-auto max-w-4xl">
          {steps.map((step, idx) => {
            const isActive = idx === currentStepIndex;
            const isPast = idx < currentStepIndex || step.isCompleted;

            return (
              <React.Fragment key={step.id}>
                <div className="flex flex-col items-center relative z-10 w-32">
                  <div
                    className={cn(
                      "flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold transition-colors duration-300",
                      isActive
                        ? "border-primary bg-primary text-primary-foreground shadow-[0_0_15px_rgba(var(--primary),0.5)]"
                        : isPast
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-muted bg-background text-muted-foreground"
                    )}
                  >
                    {isPast && !isActive ? <Check className="h-4 w-4" /> : idx + 1}
                  </div>
                  <span
                    className={cn(
                      "mt-3 text-xs font-medium text-center",
                      isActive ? "text-foreground" : "text-muted-foreground"
                    )}
                  >
                    {step.title}
                  </span>
                </div>
                
                {idx < steps.length - 1 && (
                  <div className="flex-1 h-[2px] mx-2 relative -top-3 w-16">
                    <div className="absolute inset-0 bg-muted rounded-full" />
                    <div 
                      className={cn(
                        "absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500 ease-in-out",
                        isPast ? "w-full" : "w-0"
                      )} 
                    />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto p-6 md:p-10">
        <div className="mx-auto max-w-3xl">
          <div className="mb-8">
            <h2 className="text-2xl font-bold tracking-tight">{steps[currentStepIndex]?.title}</h2>
            {steps[currentStepIndex]?.description && (
              <p className="text-muted-foreground mt-1">{steps[currentStepIndex]?.description}</p>
            )}
          </div>
          
          <div className="min-h-[400px]">
            {children}
          </div>
        </div>
      </div>

      {/* Footer / Controls */}
      <div className="border-t bg-card/50 p-6 flex items-center justify-between sticky bottom-0">
        <div>
          {onCancel && (
            <Button variant="ghost" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
          )}
        </div>
        <div className="flex items-center gap-3">
          {currentStepIndex > 0 && onBack && (
            <Button variant="outline" onClick={onBack} disabled={isLoading}>
              Back
            </Button>
          )}
          {onNext && (
            <Button onClick={onNext} disabled={isNextDisabled || isLoading}>
              {isLoading ? 'Processing...' : nextLabel}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
