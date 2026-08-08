import * as React from 'react';
import { cn } from '@/lib/utils';
import { GitCommit, Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export interface AppVersion {
  id: string;
  version: string;
  releaseDate: Date;
  releaseNotes: string;
  isLatest?: boolean;
}

interface VersionTimelineProps extends React.HTMLAttributes<HTMLDivElement> {
  versions: AppVersion[];
}

export function VersionTimeline({ versions, className, ...props }: VersionTimelineProps) {
  if (!versions || versions.length === 0) return null;
  
  // Sort by date descending
  const sortedVersions = [...versions].sort((a, b) => b.releaseDate.getTime() - a.releaseDate.getTime());

  return (
    <div className={cn("relative pl-4 border-l-2 border-muted space-y-8", className)} {...props}>
      {sortedVersions.map((ver, idx) => (
        <div key={ver.id} className="relative group">
          {/* Timeline Node */}
          <div 
            className={cn(
              "absolute -left-[25px] flex h-6 w-6 items-center justify-center rounded-full border-2 bg-background transition-colors",
              ver.isLatest ? "border-primary text-primary" : "border-muted text-muted-foreground group-hover:border-primary/50 group-hover:text-primary/50"
            )}
          >
            {ver.isLatest ? <Star className="h-3 w-3 fill-current" /> : <GitCommit className="h-3 w-3" />}
          </div>
          
          {/* Content */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <h4 className="text-sm font-semibold tracking-tight text-foreground">
                Version {ver.version}
              </h4>
              <span className="text-xs text-muted-foreground">
                {ver.releaseDate.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
              </span>
              {ver.isLatest && (
                <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">Latest</Badge>
              )}
            </div>
            
            <div className="text-sm text-muted-foreground whitespace-pre-wrap rounded-md bg-muted/20 p-4 border border-border/50">
              {ver.releaseNotes || 'No release notes provided.'}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
