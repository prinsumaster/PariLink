import * as React from 'react';
import { cn } from '@/lib/utils';
import { ShieldAlert, ShieldCheck, Info } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export interface AppPermissionDef {
  id: string;
  scope: string;
  description: string;
  isRequired: boolean;
  isGranted?: boolean;
}

interface PermissionMatrixProps extends React.HTMLAttributes<HTMLDivElement> {
  permissions: AppPermissionDef[];
  onPermissionChange?: (id: string, granted: boolean) => void;
  readonly?: boolean;
}

export function PermissionMatrix({ permissions, onPermissionChange, readonly = false, className, ...props }: PermissionMatrixProps) {
  return (
    <div className={cn("space-y-4", className)} {...props}>
      {permissions.map((perm) => (
        <div 
          key={perm.id} 
          className={cn(
            "flex items-start justify-between gap-4 rounded-xl border p-4 transition-colors",
            perm.isRequired ? "bg-muted/30" : "bg-card"
          )}
        >
          <div className="flex items-start gap-3">
            <div className="mt-0.5">
              {perm.isRequired ? (
                <ShieldAlert className="h-5 w-5 text-amber-500" />
              ) : (
                <ShieldCheck className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{perm.scope}</span>
                {perm.isRequired && (
                  <span className="rounded bg-amber-500/10 px-1.5 py-0.5 text-[10px] font-medium text-amber-600 dark:text-amber-400">
                    Required
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{perm.description}</p>
            </div>
          </div>
          
          <div className="flex items-center h-full pt-1">
            <Switch 
              checked={perm.isRequired ? true : perm.isGranted}
              disabled={readonly || perm.isRequired}
              onCheckedChange={(checked) => onPermissionChange?.(perm.id, checked)}
            />
          </div>
        </div>
      ))}
      
      {permissions.length === 0 && (
        <div className="flex flex-col items-center justify-center p-8 text-center border rounded-xl border-dashed">
          <Info className="h-8 w-8 text-muted-foreground mb-3 opacity-50" />
          <p className="text-sm text-muted-foreground">This application does not request any special permissions.</p>
        </div>
      )}
    </div>
  );
}
