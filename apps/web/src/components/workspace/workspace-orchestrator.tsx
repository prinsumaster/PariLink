'use client';

import { useWorkspaceKernelStore, WorkspaceOverlay } from '@/store/workspace-kernel';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import dynamic from 'next/dynamic';
import { Loader2, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

// Fallback loader for dynamic components
const Fallback = () => (
  <div className="flex h-40 items-center justify-center">
    <Loader2 className="h-6 w-6 animate-spin text-primary" />
  </div>
);

// Fallback when a component isn't implemented yet
const PlaceholderOverlay = ({ title, type }: { title?: string; type: string }) => (
  <div className="flex flex-col items-center justify-center py-20 text-center">
    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
      <Zap className="h-6 w-6 text-primary" />
    </div>
    <h3 className="text-lg font-semibold text-foreground">{title || 'Coming Soon'}</h3>
    <p className="text-sm text-muted-foreground mt-2 max-w-[280px]">
      This {type} workflow is being integrated into the Workspace Orchestrator.
    </p>
  </div>
);

// Map of available overlay components
const OverlayRegistry: Record<string, React.ComponentType<any>> = {
  // Ideally, these would be the pure forms, NOT wrapped in Dialogs
  // For now we use the Placeholder for everything except what we explicitly build
};

function renderOverlayContent(overlay: WorkspaceOverlay) {
  const Component = OverlayRegistry[overlay.component];
  if (!Component) {
    return <PlaceholderOverlay title={overlay.title} type={overlay.type} />;
  }
  return <Component {...overlay.props} />;
}

export function WorkspaceOrchestrator() {
  const { overlays, closeOverlay } = useWorkspaceKernelStore();

  if (!overlays || overlays.length === 0) return null;

  return (
    <>
      {overlays.map((overlay) => {
        // Render as Sheet
        if (overlay.type === 'sheet') {
          return (
            <Sheet
              key={overlay.id}
              open={overlay.isOpen}
              onOpenChange={(open) => !open && closeOverlay(overlay.id)}
            >
              <SheetContent className="sm:max-w-xl w-full p-0 flex flex-col border-l border-border bg-background shadow-2xl">
                <SheetHeader className="px-6 py-4 border-b border-border bg-muted/30">
                  <SheetTitle>{overlay.title || overlay.component}</SheetTitle>
                  <SheetDescription className="hidden">Workspace orchestrator sheet</SheetDescription>
                </SheetHeader>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-6">
                  {renderOverlayContent(overlay)}
                </div>
              </SheetContent>
            </Sheet>
          );
        }

        // Render as Dialog
        if (overlay.type === 'dialog') {
          return (
            <Dialog
              key={overlay.id}
              open={overlay.isOpen}
              onOpenChange={(open) => !open && closeOverlay(overlay.id)}
            >
              <DialogContent className="sm:max-w-lg p-0 overflow-hidden border-border bg-background shadow-2xl">
                <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
                  <DialogTitle>{overlay.title || overlay.component}</DialogTitle>
                  <DialogDescription className="hidden">Workspace orchestrator dialog</DialogDescription>
                </DialogHeader>
                <div className="p-6">
                  {renderOverlayContent(overlay)}
                </div>
              </DialogContent>
            </Dialog>
          );
        }

        // Add 'drawer' or 'inspector' handling here later
        return null;
      })}
    </>
  );
}
