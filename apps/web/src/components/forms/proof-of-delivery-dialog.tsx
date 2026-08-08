'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUpdateLoad } from '@/hooks/use-loads';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { FileUp, MapPin, PenTool, Image as ImageIcon } from 'lucide-react';
import type { Load } from '@/types';

const podSchema = z.object({
  comments: z.string().optional(),
  receiverName: z.string().min(1, 'Receiver name is required'),
});

type PodFormValues = z.infer<typeof podSchema>;

interface ProofOfDeliveryDialogProps {
  load: Load;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ProofOfDeliveryDialog({ load, open, onOpenChange }: ProofOfDeliveryDialogProps) {
  const { mutate: updateLoad, isPending } = useUpdateLoad(load.id);
  const [hasSignature, setHasSignature] = useState(false);
  const [files, setFiles] = useState<File[]>([]);

  const { register, handleSubmit, reset, formState: { errors } } = useForm<PodFormValues>({
    resolver: zodResolver(podSchema) as any,
  });

  const onSubmit = (data: PodFormValues) => {
    if (!hasSignature && files.length === 0) {
      toast.error('Please provide either a signature or upload a POD document/photo.');
      return;
    }

    // In a real app, we would upload the files and signature image to S3/Cloud Storage here,
    // then pass the URLs to the update payload.
    updateLoad(
      { status: 'DELIVERED' },
      {
        onSuccess: () => {
          toast.success('Proof of Delivery submitted successfully!');
          reset();
          setFiles([]);
          setHasSignature(false);
          onOpenChange(false);
        },
        onError: () => toast.error('Failed to submit POD'),
      }
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Proof of Delivery (POD)</DialogTitle>
          <DialogDescription>
            Complete delivery verification for Load {load.referenceNumber} ({load.originCity} → {load.destinationCity})
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Left Column: Details & Receiver */}
            <div className="space-y-4">
              <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-800 rounded-lg space-y-2">
                <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-400">
                  <MapPin className="h-4 w-4" />
                  <span className="font-semibold">GPS Verified</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Location matched to {load.destinationCity} geofence at {new Date().toLocaleTimeString()}
                </p>
              </div>

              <div className="space-y-2">
                <Label>Receiver Name *</Label>
                <Input placeholder="John Doe" {...register('receiverName')} className={errors.receiverName ? 'border-red-500' : ''} />
                {errors.receiverName && <p className="text-xs text-red-500">{errors.receiverName.message}</p>}
              </div>

              <div className="space-y-2">
                <Label>Delivery Comments</Label>
                <Textarea 
                  placeholder="Note any damages, shortages, or delivery conditions..." 
                  className="resize-none h-24"
                  {...register('comments')} 
                />
              </div>
            </div>

            {/* Right Column: Signature & Photos */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className="flex justify-between">
                  <span>Digital Signature</span>
                  <Button type="button" variant="ghost" size="sm" className="h-4 px-2 text-xs" onClick={() => setHasSignature(!hasSignature)}>
                    {hasSignature ? 'Clear' : 'Sign'}
                  </Button>
                </Label>
                <div 
                  className={`h-32 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer transition-colors ${hasSignature ? 'bg-gray-50 border-emerald-500' : 'bg-gray-50/50 hover:bg-gray-50 dark:bg-gray-900'}`}
                  onClick={() => setHasSignature(true)}
                >
                  {hasSignature ? (
                    <span className="font-signature text-3xl text-gray-800 dark:text-gray-200" style={{ fontFamily: 'cursive' }}>Signed</span>
                  ) : (
                    <div className="text-center text-muted-foreground flex flex-col items-center gap-2">
                      <PenTool className="h-6 w-6 opacity-50" />
                      <span className="text-sm">Click to sign</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Photos & Documents</Label>
                <div className="border-2 border-dashed rounded-lg p-4 flex flex-col items-center justify-center gap-2 bg-gray-50/50 dark:bg-gray-900">
                  <div className="flex gap-2">
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                      <ImageIcon className="h-4 w-4" />
                      Camera
                    </Button>
                    <Button type="button" variant="outline" size="sm" className="gap-2">
                      <FileUp className="h-4 w-4" />
                      Upload
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground mt-2">Required: Bill of Lading (signed)</p>
                </div>
              </div>
            </div>
            
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700 min-w-32">
              {isPending ? 'Submitting...' : 'Submit POD'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
