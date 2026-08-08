import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AppBannerProps extends React.HTMLAttributes<HTMLDivElement> {
  imageUrl: string;
  fallbackColor?: string;
  children?: React.ReactNode;
}

export function AppBanner({ imageUrl, fallbackColor = 'from-primary/20 to-primary/5', children, className, ...props }: AppBannerProps) {
  return (
    <div
      className={cn(
        "relative w-full h-48 md:h-64 overflow-hidden rounded-xl border bg-gradient-to-br",
        !imageUrl && fallbackColor,
        className
      )}
      {...props}
    >
      {imageUrl && (
        <Image 
          src={imageUrl} 
          alt="App Banner" 
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent pointer-events-none" />
      
      {children && (
        <div className="absolute bottom-0 left-0 w-full p-6">
          {children}
        </div>
      )}
    </div>
  );
}
