'use client';

import { useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useCreateLoad } from '@/hooks/use-loads';
import { useCustomers } from '@/hooks';
import {
  Dialog,
  DialogContent,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2, ArrowRight, DollarSign, ChevronRight,
  ChevronLeft, Check, Package, MapPin, Truck,
} from 'lucide-react';

// ─── Schema ───────────────────────────────────────────────────────────────────
const schema = z.object({
  // Step 1
  customerId: z.string().min(1, 'Customer is required'),
  referenceNumber: z.string().min(1, 'Reference number is required'),
  equipmentType: z.enum(['DRY_VAN', 'REEFER', 'FLATBED', 'STEP_DECK', 'TANKER']).default('DRY_VAN'),
  // Step 2
  originAddress: z.string().min(1, 'Origin address is required'),
  originCity: z.string().min(1, 'Origin city is required'),
  originState: z.string().min(2, 'Origin state is required'),
  consignor: z.string().optional(),
  destinationAddress: z.string().min(1, 'Destination address is required'),
  destinationCity: z.string().min(1, 'Destination city is required'),
  destinationState: z.string().min(2, 'Destination state is required'),
  consignee: z.string().optional(),
  // Step 3
  pickupDate: z.string().min(1, 'Pickup date is required'),
  deliveryDate: z.string().min(1, 'Delivery date is required'),
  rate: z.coerce.number().positive('Rate must be a positive number'),
  weight: z.union([z.coerce.number().positive(), z.literal(''), z.undefined()])
    .optional()
    .transform((v) => (v === '' ? undefined : v)),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

// ─── Step Config ─────────────────────────────────────────────────────────────
const STEPS = [
  { id: 1, label: 'Customer', icon: Building2, description: 'Who is shipping?' },
  { id: 2, label: 'Route', icon: MapPin, description: 'Origin → Destination' },
  { id: 3, label: 'Details', icon: DollarSign, description: 'Rate, dates & notes' },
] as const;

const EQUIPMENT_OPTIONS: { value: string; label: string; description: string }[] = [
  { value: 'DRY_VAN', label: 'Dry Van', description: '53\' standard trailer' },
  { value: 'REEFER', label: 'Reefer', description: 'Temperature controlled' },
  { value: 'FLATBED', label: 'Flatbed', description: 'Open trailer' },
  { value: 'STEP_DECK', label: 'Step Deck', description: 'For tall loads' },
  { value: 'TANKER', label: 'Tanker', description: 'Liquid/gas freight' },
];

// ─── Step Indicator ───────────────────────────────────────────────────────────
function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((step, i) => {
        const done = i + 1 < current;
        const active = i + 1 === current;

        return (
          <div key={step.id} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                done
                  ? 'bg-emerald-500 text-white'
                  : active
                  ? 'bg-primary text-primary-foreground ring-4 ring-primary/20'
                  : 'bg-muted text-muted-foreground',
              )}>
                {done ? <Check className="h-3.5 w-3.5" /> : step.id}
              </div>
              <p className={cn(
                'text-[10px] font-medium mt-1 hidden sm:block',
                active ? 'text-foreground' : 'text-muted-foreground',
              )}>
                {step.label}
              </p>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'h-0.5 w-8 sm:w-16 mx-1 transition-all duration-500 mb-3.5',
                done ? 'bg-emerald-500' : 'bg-border',
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Input field helper ───────────────────────────────────────────────────────
function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="text-red-500 ml-0.5">*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-500 flex items-center gap-1">{error}</p>}
    </div>
  );
}

const inputClass = (hasError?: boolean) => cn(
  'h-9 w-full rounded-lg border bg-background px-3 text-sm transition-shadow',
  'focus:outline-none focus:ring-2 focus:ring-ring placeholder:text-muted-foreground',
  hasError ? 'border-red-400 focus:ring-red-300' : 'border-input',
);

const selectClass = (hasError?: boolean) => cn(
  'h-9 w-full rounded-lg border bg-background px-3 text-sm transition-shadow appearance-none',
  'focus:outline-none focus:ring-2 focus:ring-ring',
  hasError ? 'border-red-400 focus:ring-red-300' : 'border-input',
);

// ─── Props ───────────────────────────────────────────────────────────────────
interface CreateLoadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// ─── Component ───────────────────────────────────────────────────────────────
export function CreateLoadDialog({ open, onOpenChange }: CreateLoadDialogProps) {
  const router = useRouter();
  const { mutate: createLoad, isPending } = useCreateLoad();
  const { data: customers } = useCustomers({ limit: 100, status: 'ACTIVE' });
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);

  const { register, handleSubmit, reset, watch, trigger, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema) as any,
    defaultValues: { equipmentType: 'DRY_VAN' },
    mode: 'onChange',
  });

  const handleClose = useCallback(() => {
    reset();
    setStep(1);
    onOpenChange(false);
  }, [reset, onOpenChange]);

  // Step-aware field validation before advancing
  const STEP_FIELDS: Record<number, (keyof FormValues)[]> = {
    1: ['customerId', 'referenceNumber', 'equipmentType'],
    2: ['originAddress', 'originCity', 'originState', 'destinationAddress', 'destinationCity', 'destinationState'],
    3: ['pickupDate', 'deliveryDate', 'rate'],
  };

  const advance = async () => {
    const valid = await trigger(STEP_FIELDS[step]);
    if (!valid) {
      console.log('[DEBUG] Validation failed for step', step, 'errors:', errors);
      return;
    }
    setDirection(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDirection(-1);
    setStep((s) => s - 1);
  };

  const onSubmit = (data: FormValues) => {
    createLoad(data as any, {
      onSuccess: (load: any) => {
        toast.success(`Load ${load.referenceNumber} created!`);
        handleClose();
        router.push(`/loads/${load.id}`);
      },
      onError: (err: any) => {
        toast.error(err?.response?.data?.message ?? 'Failed to create load');
      },
    });
  };

  const variants = {
    enter: (dir: number) => ({ x: dir * 24, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir * -24, opacity: 0 }),
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg p-0 overflow-hidden gap-0">
        {/* ── Header ─────────────────────────────────── */}
        <div className="px-6 pt-6 pb-4 border-b border-border bg-muted/30">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-8 w-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
              <Package className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-sm text-foreground">New Load</p>
              <p className="text-xs text-muted-foreground">{STEPS[step - 1].description}</p>
            </div>
          </div>
          <StepIndicator current={step} total={STEPS.length} />
        </div>

        {/* ── Form Body ──────────────────────────────── */}
        <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col">
          <div className="px-6 py-5 min-h-[320px] relative overflow-hidden">
            <AnimatePresence custom={direction} mode="wait">
              {/* ── Step 1: Customer & Equipment ─────── */}
              {step === 1 && (
                <motion.div
                  key="step1"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <Field label="Customer" required error={errors.customerId?.message}>
                    <select
                      {...register('customerId')}
                      className={selectClass(!!errors.customerId)}
                    >
                      <option value="">Select customer…</option>
                      {customers?.data.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Reference Number" required error={errors.referenceNumber?.message}>
                    <Input
                      placeholder="LD-2024-001"
                      {...register('referenceNumber')}
                      className={inputClass(!!errors.referenceNumber)}
                    />
                  </Field>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">Equipment Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      {EQUIPMENT_OPTIONS.map((opt) => {
                        // eslint-disable-next-line react-hooks/incompatible-library
                        const current = watch('equipmentType');
                        const isSelected = current === opt.value;
                        return (
                          <label
                            key={opt.value}
                            className={cn(
                              'flex items-start gap-2.5 p-2.5 rounded-lg border cursor-pointer transition-all duration-150',
                              isSelected
                                ? 'border-primary bg-primary/5 ring-1 ring-primary/30'
                                : 'border-border hover:border-primary/40 hover:bg-muted/40',
                            )}
                          >
                            <input
                              type="radio"
                              value={opt.value}
                              {...register('equipmentType')}
                              className="sr-only"
                            />
                            <div className={cn(
                              'h-4 w-4 rounded-full border-2 mt-0.5 shrink-0 transition-all',
                              isSelected ? 'border-primary bg-primary' : 'border-muted-foreground/40',
                            )}>
                              {isSelected && (
                                <div className="h-full w-full flex items-center justify-center">
                                  <div className="h-1.5 w-1.5 rounded-full bg-white" />
                                </div>
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className={cn('text-xs font-semibold leading-tight', isSelected ? 'text-primary' : 'text-foreground')}>
                                {opt.label}
                              </p>
                              <p className="text-[10px] text-muted-foreground mt-0.5">{opt.description}</p>
                            </div>
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 2: Route ─────────────────────── */}
              {step === 2 && (
                <motion.div
                  key="step2"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="space-y-5"
                >
                  {/* Origin */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shrink-0" />
                      <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
                        Pickup Location
                      </p>
                    </div>
                    <div className="space-y-3 pl-4 border-l-2 border-emerald-200 dark:border-emerald-800">
                      <Field label="Address" required error={errors.originAddress?.message}>
                        <Input
                          placeholder="123 Industrial Blvd"
                          {...register('originAddress')}
                          className={inputClass(!!errors.originAddress)}
                        />
                      </Field>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <Field label="City" required error={errors.originCity?.message}>
                            <Input
                              placeholder="Dallas"
                              {...register('originCity')}
                              className={inputClass(!!errors.originCity)}
                            />
                          </Field>
                        </div>
                        <Field label="State" required error={errors.originState?.message}>
                          <Input
                            placeholder="TX"
                            maxLength={2}
                            {...register('originState')}
                            className={cn(inputClass(!!errors.originState), 'uppercase')}
                          />
                        </Field>
                      </div>
                      <Field label="Consignor (Shipper)">
                        <Input placeholder="Shipper name (optional)" {...register('consignor')} className={inputClass()} />
                      </Field>
                    </div>
                  </div>

                  {/* Arrow divider */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <div className="h-7 w-7 rounded-full border border-border bg-muted flex items-center justify-center shrink-0">
                      <ArrowRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Destination */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="h-2 w-2 rounded-full bg-primary shrink-0" />
                      <p className="text-xs font-semibold text-primary uppercase tracking-wider">
                        Delivery Location
                      </p>
                    </div>
                    <div className="space-y-3 pl-4 border-l-2 border-primary/30">
                      <Field label="Address" required error={errors.destinationAddress?.message}>
                        <Input
                          placeholder="456 Distribution Center"
                          {...register('destinationAddress')}
                          className={inputClass(!!errors.destinationAddress)}
                        />
                      </Field>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="col-span-2">
                          <Field label="City" required error={errors.destinationCity?.message}>
                            <Input
                              placeholder="Houston"
                              {...register('destinationCity')}
                              className={inputClass(!!errors.destinationCity)}
                            />
                          </Field>
                        </div>
                        <Field label="State" required error={errors.destinationState?.message}>
                          <Input
                            placeholder="TX"
                            maxLength={2}
                            {...register('destinationState')}
                            className={cn(inputClass(!!errors.destinationState), 'uppercase')}
                          />
                        </Field>
                      </div>
                      <Field label="Consignee (Receiver)">
                        <Input placeholder="Receiver name (optional)" {...register('consignee')} className={inputClass()} />
                      </Field>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* ── Step 3: Dates & Rate ──────────────── */}
              {step === 3 && (
                <motion.div
                  key="step3"
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.2, ease: 'easeInOut' }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Pickup Date" required error={errors.pickupDate?.message}>
                      <input
                        type="datetime-local"
                        {...register('pickupDate')}
                        className={inputClass(!!errors.pickupDate)}
                      />
                    </Field>
                    <Field label="Delivery Date" required error={errors.deliveryDate?.message}>
                      <input
                        type="datetime-local"
                        {...register('deliveryDate')}
                        className={inputClass(!!errors.deliveryDate)}
                      />
                    </Field>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Field label="Rate (USD)" required error={errors.rate?.message}>
                      <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          type="number"
                          step="0.01"
                          min="0"
                          placeholder="2,500.00"
                          {...register('rate')}
                          className={cn(inputClass(!!errors.rate), 'pl-8')}
                        />
                      </div>
                    </Field>
                    <Field label="Weight (lbs)">
                      <div className="relative">
                        <Truck className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="42,000"
                          {...register('weight')}
                          className={cn(inputClass(), 'pl-8')}
                        />
                      </div>
                    </Field>
                  </div>

                  <Field label="Notes">
                    <textarea
                      {...register('notes')}
                      rows={3}
                      placeholder="Hazmat, special handling, or delivery instructions…"
                      className={cn(
                        inputClass(),
                        'h-auto py-2 resize-none leading-relaxed',
                      )}
                    />
                  </Field>

                  {/* Confirm summary */}
                  <div className="p-3 rounded-lg bg-muted/50 border border-border">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Summary</p>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <p>
                        // eslint-disable-next-line react-hooks/incompatible-library
                        <span className="font-medium text-foreground">{watch('referenceNumber') || '—'}</span>
                        // eslint-disable-next-line react-hooks/incompatible-library
                        {' '}· {customers?.data.find((c) => c.id === watch('customerId'))?.name ?? 'No customer'}
                      </p>
                      <p>
                        // eslint-disable-next-line react-hooks/incompatible-library
                        {watch('originCity')}, {watch('originState')} → {watch('destinationCity')}, {watch('destinationState')}
                      </p>
                      <p className="font-semibold text-foreground">
                        // eslint-disable-next-line react-hooks/incompatible-library
                        {watch('rate') ? `$${Number(watch('rate')).toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Footer ─────────────────────────────────── */}
          <div className="px-6 py-4 border-t border-border bg-muted/20 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={step === 1 ? handleClose : back}
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              {step > 1 && <ChevronLeft className="h-4 w-4" />}
              {step === 1 ? 'Cancel' : 'Back'}
            </button>

            {step < 3 ? (
              <Button
                type="button"
                onClick={advance}
                className="gap-1.5 min-w-[120px]"
              >
                Continue
                <ChevronRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                type="submit"
                disabled={isPending}
                className="min-w-[140px] gap-1.5"
              >
                {isPending ? (
                  <>
                    <svg className="animate-spin h-3.5 w-3.5" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Creating…
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    Create Load
                  </>
                )}
              </Button>
            )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
