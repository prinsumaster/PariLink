'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreatePayment } from '@/hooks';
import { useInvoices } from '@/hooks';
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
import { toast } from 'sonner';

const createPaymentSchema = z.object({
  invoiceId: z.string().min(1, 'Invoice is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  method: z.enum(['CHECK', 'ACH', 'WIRE', 'CREDIT_CARD', 'CASH']),
  paymentDate: z.string().min(1, 'Payment date is required'),
  referenceNumber: z.string().optional(),
});

type CreatePaymentFormValues = z.infer<typeof createPaymentSchema>;

interface RecordPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const selectClass = 'w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring';

export function RecordPaymentDialog({ open, onOpenChange }: RecordPaymentDialogProps) {
  const { mutate: createPayment, isPending } = useCreatePayment();
  const { data: invoices } = useInvoices({ limit: 100, status: 'SENT' }); // only get sent invoices

  const { register, handleSubmit, reset, formState: { errors } } = useForm<CreatePaymentFormValues>({
    resolver: zodResolver(createPaymentSchema) as any,
    defaultValues: {
      paymentDate: new Date().toISOString().split('T')[0], // today's date
    }
  });

  const onSubmit = (data: CreatePaymentFormValues) => {
    createPayment(data, {
      onSuccess: () => {
        toast.success('Payment recorded successfully!');
        reset();
        onOpenChange(false);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Failed to record payment');
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Record Payment</DialogTitle>
          <DialogDescription>Record a payment received from a customer against an invoice.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-2">
          <div className="space-y-1">
            <Label>Invoice *</Label>
            <select {...register('invoiceId')} className={`${selectClass} ${errors.invoiceId ? 'border-red-500' : ''}`}>
              <option value="">Select invoice…</option>
              {invoices?.data.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.invoiceNumber} — {inv.customer?.name} (${inv.amount})
                </option>
              ))}
            </select>
            {errors.invoiceId && <p className="text-xs text-red-500">{errors.invoiceId.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Amount (USD) *</Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                <Input type="number" step="0.01" className={`pl-7 ${errors.amount ? 'border-red-500' : ''}`} {...register('amount')} />
              </div>
              {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
            </div>

            <div className="space-y-1">
              <Label>Date *</Label>
              <Input type="date" {...register('paymentDate')} className={errors.paymentDate ? 'border-red-500' : ''} />
              {errors.paymentDate && <p className="text-xs text-red-500">{errors.paymentDate.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label>Payment Method *</Label>
            <select {...register('method')} className={selectClass}>
              <option value="ACH">ACH Transfer</option>
              <option value="WIRE">Wire Transfer</option>
              <option value="CHECK">Check</option>
              <option value="CREDIT_CARD">Credit Card</option>
              <option value="CASH">Cash</option>
            </select>
          </div>

          <div className="space-y-1">
            <Label>Reference #</Label>
            <Input placeholder="Check #, Transaction ID, etc." {...register('referenceNumber')} />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>Cancel</Button>
            <Button type="submit" disabled={isPending} className="bg-emerald-600 hover:bg-emerald-700">
              {isPending ? 'Recording…' : 'Record Payment'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
