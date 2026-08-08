"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AlertTriangle } from 'lucide-react';

interface DangerousActionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description: string;
  actionLabel?: string;
  onConfirm: () => Promise<void> | void;
  requireConfirmText?: string;
}

export function DangerousActionDialog({
  open,
  onOpenChange,
  title,
  description,
  actionLabel = "Delete",
  onConfirm,
  requireConfirmText = "CONFIRM"
}: DangerousActionDialogProps) {
  const [confirmText, setConfirmText] = useState("");
  const [isPending, setIsPending] = useState(false);

  const handleConfirm = async () => {
    if (confirmText !== requireConfirmText) return;
    
    setIsPending(true);
    try {
      await onConfirm();
      onOpenChange(false);
    } finally {
      setIsPending(false);
      setConfirmText("");
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    setConfirmText("");
  };

  const isMatched = confirmText === requireConfirmText;

  return (
    <Dialog open={open} onOpenChange={handleCancel}>
      <DialogContent className="sm:max-w-md border-red-200 dark:border-red-900/50">
        <DialogHeader>
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 dark:text-red-500" aria-hidden="true" />
          </div>
          <DialogTitle className="text-center text-xl text-red-600 dark:text-red-500">{title}</DialogTitle>
          <DialogDescription className="text-center pt-2">
            {description}
          </DialogDescription>
        </DialogHeader>

        <div className="my-6 space-y-4">
          <div className="bg-red-50 dark:bg-red-950/20 p-4 rounded-lg border border-red-100 dark:border-red-900/30 text-sm text-red-800 dark:text-red-200 text-center">
            This action cannot be undone. To verify, type <strong>{requireConfirmText}</strong> below.
          </div>
          <Input 
            value={confirmText}
            onChange={(e) => setConfirmText(e.target.value)}
            placeholder={requireConfirmText}
            className="text-center uppercase font-mono tracking-widest"
            disabled={isPending}
            autoFocus
          />
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2 sm:gap-0">
          <Button 
            type="button" 
            variant="outline" 
            onClick={handleCancel}
            disabled={isPending}
            className="sm:mr-auto"
          >
            Cancel
          </Button>
          <Button 
            type="button" 
            variant="destructive" 
            onClick={handleConfirm}
            disabled={!isMatched || isPending}
            isLoading={isPending}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
