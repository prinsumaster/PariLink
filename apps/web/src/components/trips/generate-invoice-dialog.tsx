'use client';
import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGenerateInvoiceFromTrips } from '@/hooks';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

interface GenerateInvoiceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  selectedTrips: string[];
}

export function GenerateInvoiceDialog({ open, onOpenChange, selectedTrips }: GenerateInvoiceDialogProps) {
  const [customerId, setCustomerId] = useState('');
  const { mutate: generate, isPending } = useGenerateInvoiceFromTrips();
  const router = useRouter();

  const handleGenerate = () => {
    if (!customerId) {
      toast.error('Customer ID is required');
      return;
    }
    generate(
      { customerId, tripIds: selectedTrips },
      {
        onSuccess: (data) => {
          toast.success('Invoice generated successfully');
          onOpenChange(false);
          router.push(`/billing/${data.id}`);
        }
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>
            Generate a draft invoice for the {selectedTrips.length} selected trips.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Customer ID</Label>
            <Input 
              value={customerId} 
              onChange={e => setCustomerId(e.target.value)} 
              placeholder="Enter customer ID (uuid)" 
            />
            <p className="text-xs text-muted-foreground">
              In a full implementation, this would be a CustomerSelect dropdown.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isPending}>Cancel</Button>
          <Button onClick={handleGenerate} disabled={isPending} className="bg-blue-600 hover:bg-blue-700">
            {isPending ? 'Generating...' : 'Generate Invoice'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
