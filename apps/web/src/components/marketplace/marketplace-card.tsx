import * as React from 'react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Star, CheckCircle, Download } from 'lucide-react';
import Link from 'next/link';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export interface AppData {
  id: string;
  name: string;
  developer: string;
  description: string;
  category: string;
  logoUrl?: string;
  rating?: number;
  reviews?: number;
  installs?: string;
  isVerified?: boolean;
  price?: string;
  licenseType?: string;
  installed?: boolean;
}

interface MarketplaceCardProps extends React.HTMLAttributes<HTMLDivElement> {
  app: AppData;
  onInstall?: (appId: string) => void;
  onConfigure?: (appId: string) => void;
}

export function MarketplaceCard({ app, onInstall, onConfigure, className, ...props }: MarketplaceCardProps) {
  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border bg-card p-6 shadow-sm transition-all hover:shadow-md hover:border-primary/50",
        className
      )}
      {...props}
    >
      <div className="flex items-start justify-between">
        <Avatar className="h-14 w-14 rounded-xl border bg-background shadow-sm">
          <AvatarImage src={app.logoUrl} alt={app.name} className="object-cover" />
          <AvatarFallback className="rounded-xl font-bold bg-primary/10 text-primary">
            {app.name.substring(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col items-end gap-1">
          <Badge variant={app.installed ? "default" : "secondary"} className="rounded-full px-2 py-0.5 text-xs">
            {app.installed ? 'Installed' : app.category}
          </Badge>
          {app.price && !app.installed && (
            <span className="text-xs font-semibold text-muted-foreground">{app.price}</span>
          )}
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1">
        <Link href={`/admin/marketplace/${app.id}`} className="group-hover:underline underline-offset-4">
          <h3 className="text-lg font-semibold leading-tight tracking-tight text-foreground flex items-center gap-1.5">
            {app.name}
            {app.isVerified && <CheckCircle className="h-4 w-4 text-emerald-500" />}
          </h3>
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 mt-1 min-h-[40px]">
          {app.description}
        </p>
      </div>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-1">
          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
          <span className="font-medium text-foreground">{app.rating?.toFixed(1) || 'New'}</span>
          {app.reviews && <span>({app.reviews})</span>}
        </div>
        <div className="flex items-center gap-1">
          <Download className="h-3.5 w-3.5" />
          <span>{app.installs || '0'} installs</span>
        </div>
      </div>

      <div className="mt-5 flex items-center gap-3">
        {app.installed ? (
          <Button 
            variant="outline" 
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onConfigure?.(app.id);
            }}
          >
            Configure
          </Button>
        ) : (
          <Button 
            variant="default" 
            className="w-full"
            onClick={(e) => {
              e.preventDefault();
              onInstall?.(app.id);
            }}
          >
            Install
          </Button>
        )}
      </div>
    </div>
  );
}
