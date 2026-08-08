import { SkeletonCard, SkeletonTable } from '@/components/ui/skeleton';
import { StaggerContainer, StaggerItem, FadeIn } from '@/components/ui/motion';

export default function GlobalLoading() {
  return (
    <FadeIn className="flex flex-col h-full w-full p-6 space-y-6">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="space-y-2">
          <div className="h-6 w-48 rounded-md bg-slate-200 dark:bg-slate-800 animate-pulse" />
          <div className="h-4 w-64 rounded-md bg-slate-100 dark:bg-slate-800/50 animate-pulse" />
        </div>
        <div className="h-9 w-32 rounded-lg bg-blue-100 dark:bg-blue-900/20 animate-pulse" />
      </div>

      <StaggerContainer className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <StaggerItem key={i}>
            <SkeletonCard />
          </StaggerItem>
        ))}
      </StaggerContainer>

      <StaggerItem className="flex-1 mt-6">
        <SkeletonTable rows={6} cols={5} />
      </StaggerItem>
    </FadeIn>
  );
}
