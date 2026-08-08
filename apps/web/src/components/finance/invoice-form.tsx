'use client';

import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { financeService } from '@/services/finance';
import { Invoice } from '@/types/finance';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Save, X, Plus, Trash2, Calculator } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useEffect } from 'react';

const invoiceFormSchema = z.object({
  customerId: z.string().min(1, 'Customer ID is required'),
  customerName: z.string().min(1, 'Customer Name is required'),
  issueDate: z.string().min(1, 'Issue date required'),
  dueDate: z.string().min(1, 'Due date required'),
  paymentTerms: z.string().min(1, 'Terms required'),
  currency: z.string().min(3),
  status: z.enum(['DRAFT', 'ISSUED', 'PARTIAL', 'PAID', 'OVERDUE', 'CANCELLED', 'REFUNDED']),
  lineItems: z.array(z.object({
    description: z.string().min(1, 'Description required'),
    quantity: z.number().min(1),
    unitPrice: z.number().min(0),
    taxRate: z.number().min(0),
    orderId: z.string().optional()
  })).min(1, 'At least one line item is required'),
  notes: z.string().optional(),
  discountTotal: z.number().min(0)
});

export type InvoiceFormValues = z.infer<typeof invoiceFormSchema>;

interface InvoiceFormProps {
  initialData?: Invoice;
  isEdit?: boolean;
}

export function InvoiceForm({ initialData, isEdit }: InvoiceFormProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const { register, control, handleSubmit, setValue, watch, formState: { errors, isDirty } } = useForm<InvoiceFormValues>({
    resolver: zodResolver(invoiceFormSchema),
    defaultValues: initialData ? {
      customerId: initialData.customerId,
      customerName: initialData.customerName,
      issueDate: initialData.issueDate.slice(0, 10),
      dueDate: initialData.dueDate.slice(0, 10),
      paymentTerms: initialData.paymentTerms,
      currency: initialData.currency,
      status: initialData.status,
      notes: initialData.notes,
      discountTotal: initialData.discountTotal,
      lineItems: initialData.lineItems.map(li => ({
        description: li.description,
        quantity: li.quantity,
        unitPrice: li.unitPrice,
        taxRate: li.taxRate,
        orderId: li.orderId
      })),
    } : {
      status: 'DRAFT',
      currency: 'USD',
      paymentTerms: 'NET_30',
      discountTotal: 0,
      issueDate: new Date().toISOString().slice(0, 10),
      dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
      lineItems: [{ description: '', quantity: 1, unitPrice: 0, taxRate: 0 }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "lineItems"
  });

  // Watch fields to auto-calculate totals
  // eslint-disable-next-line react-hooks/incompatible-library
  const lineItemsWatch = watch("lineItems");
  const discountWatch = watch("discountTotal");

  const subtotal = lineItemsWatch.reduce((acc, item) => acc + ((item.quantity || 0) * (item.unitPrice || 0)), 0);
  const taxTotal = lineItemsWatch.reduce((acc, item) => acc + (((item.quantity || 0) * (item.unitPrice || 0)) * (item.taxRate || 0) / 100), 0);
  const grandTotal = subtotal + taxTotal - (discountWatch || 0);

  const mutation = useMutation({
    mutationFn: (data: InvoiceFormValues) => {
      // Inject calculated totals into payload
      const payload = {
        ...data,
        subtotal,
        taxTotal,
        grandTotal,
        lineItems: data.lineItems.map(item => ({
          ...item,
          total: (item.quantity * item.unitPrice) * (1 + item.taxRate / 100)
        })),
        amountPaid: initialData ? initialData.amountPaid : 0,
        balanceDue: initialData ? (grandTotal - initialData.amountPaid) : grandTotal
      };

      const submissionData = {
        ...payload,
        lineItems: payload.lineItems.map((item: any) => ({ ...item, id: '' }))
      };

      if (isEdit && initialData) {
        return financeService.updateInvoice(initialData.id, submissionData as any);
      }
      return financeService.createInvoice(submissionData as any);
    },
    onSuccess: (data) => {
      toast.success(isEdit ? 'Invoice updated' : 'Invoice created successfully');
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      router.push(`/finance/${data.id}`);
    },
    onError: (err: any) => {
      toast.error(err.normalizedMessage || 'Failed to save invoice');
    }
  });

  const onSubmit = (data: InvoiceFormValues) => mutation.mutate(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
      
      {/* Header Info */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Invoice Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Customer ID</Label>
            <Input {...register('customerId')} placeholder="CUST-XYZ" />
          </div>
          <div className="space-y-2">
            <Label>Customer Name</Label>
            <Input {...register('customerName')} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            // eslint-disable-next-line react-hooks/incompatible-library
            <Select value={watch('status')} onValueChange={(v: any) => setValue('status', v, { shouldDirty: true })}>
              <SelectTrigger><SelectValue placeholder="Status" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="ISSUED">Issued</SelectItem>
                <SelectItem value="PAID">Paid</SelectItem>
                <SelectItem value="OVERDUE">Overdue</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input type="date" {...register('issueDate')} />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" {...register('dueDate')} />
          </div>
          <div className="space-y-2">
            <Label>Payment Terms</Label>
            <Input {...register('paymentTerms')} />
          </div>
        </div>
      </div>

      {/* Line Items Array */}
      <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Line Items</h3>
          <Button type="button" variant="outline" size="sm" onClick={() => append({ description: '', quantity: 1, unitPrice: 0, taxRate: 0 })}>
            <Plus className="mr-2 h-4 w-4" /> Add Item
          </Button>
        </div>
        <div className="space-y-4">
          {fields.map((field, index) => {
            const qty = lineItemsWatch[index]?.quantity || 0;
            const price = lineItemsWatch[index]?.unitPrice || 0;
            const tax = lineItemsWatch[index]?.taxRate || 0;
            const lineTotal = (qty * price) * (1 + tax / 100);

            return (
              <div key={field.id} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg relative">
                {fields.length > 1 && (
                  <Button type="button" variant="ghost" size="icon" className="absolute right-2 top-2 text-red-500" onClick={() => remove(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
                <div className="grid grid-cols-1 md:grid-cols-6 gap-4 pr-8 items-end">
                  <div className="space-y-2 md:col-span-2"><Label>Description</Label><Input {...register(`lineItems.${index}.description` as const)} placeholder="Freight charge, fuel surcharge, etc." /></div>
                  <div className="space-y-2"><Label>Quantity</Label><Input type="number" {...register(`lineItems.${index}.quantity` as const, { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Unit Price</Label><Input type="number" step="0.01" {...register(`lineItems.${index}.unitPrice` as const, { valueAsNumber: true })} /></div>
                  <div className="space-y-2"><Label>Tax Rate (%)</Label><Input type="number" step="0.01" {...register(`lineItems.${index}.taxRate` as const, { valueAsNumber: true })} /></div>
                  <div className="space-y-2 text-right">
                    <Label>Line Total</Label>
                    <div className="font-mono font-medium pt-2">${lineTotal.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Totals & Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Notes</h3>
          <textarea 
            {...register('notes')} 
            className="w-full h-32 p-3 border border-gray-300 dark:border-gray-700 rounded-md bg-transparent resize-none focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Payment instructions, terms, or customer notes..."
          ></textarea>
        </div>

        <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-800">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center gap-2"><Calculator className="h-5 w-5"/> Financial Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span>Subtotal</span>
              <span className="font-mono">${subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-gray-600 dark:text-gray-400">
              <span>Tax Total</span>
              <span className="font-mono">${taxTotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-green-600 dark:text-green-400">
              <span>Discount</span>
              <div className="w-24">
                <Input type="number" step="0.01" {...register('discountTotal', { valueAsNumber: true })} className="h-8 text-right font-mono" />
              </div>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between items-center text-lg font-bold">
              <span>Grand Total</span>
              // eslint-disable-next-line react-hooks/incompatible-library
              <span className="font-mono">${grandTotal.toFixed(2)} {watch('currency')}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button type="button" variant="outline" onClick={() => router.back()}>
          <X className="mr-2 h-4 w-4" /> Cancel
        </Button>
        <Button type="submit" disabled={!isDirty || mutation.isPending}>
          <Save className="mr-2 h-4 w-4" /> {mutation.isPending ? 'Saving...' : 'Save Invoice'}
        </Button>
      </div>
    </form>
  );
}
