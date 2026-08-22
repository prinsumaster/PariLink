import { PackageOpen } from 'lucide-react';
import { Button } from './button';

export function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="flex h-full min-h-[60vh] flex-col items-center justify-center p-6 text-center animate-fade-in font-sans">
      <div className="h-16 w-16 flex items-center justify-center mb-6 border border-border bg-card rounded-xl elevation-1 text-muted-foreground">
        <PackageOpen className="h-6 w-6" />
      </div>
      <h1 className="text-xl font-medium tracking-tight text-foreground mb-2">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        This module is not available in the current environment.
      </p>
      <div className="flex items-center gap-3">
        <Button variant="outline" size="sm" onClick={() => window.history.back()} className="elevation-1">
          Go Back
        </Button>
      </div>
    </div>
  );
}
