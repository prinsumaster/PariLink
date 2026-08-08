'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command';
import { 
  Settings, Users, Truck, Package, Activity, Zap, FileText, 
  PlusCircle, LayoutDashboard, BarChart3, Building2, Map, CreditCard
} from 'lucide-react';

export function GlobalCommandMenu() {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            <CommandItem onSelect={() => runCommand(() => router.push('/trips/new'))}>
              <PlusCircle className="mr-2 h-4 w-4 text-emerald-500" />
              <span>Create Shipment</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/drivers/new'))}>
              <PlusCircle className="mr-2 h-4 w-4 text-blue-500" />
              <span>Create Driver</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/vehicles/new'))}>
              <PlusCircle className="mr-2 h-4 w-4 text-indigo-500" />
              <span>Create Vehicle</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/finance/invoices/new'))}>
              <PlusCircle className="mr-2 h-4 w-4 text-amber-500" />
              <span>Create Invoice</span>
            </CommandItem>
          </CommandGroup>
          
          <CommandSeparator />
          
          <CommandGroup heading="Navigation">
            <CommandItem onSelect={() => runCommand(() => router.push('/dashboard'))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Open Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/fleet'))}>
              <Truck className="mr-2 h-4 w-4" />
              <span>Open Fleet</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/analytics'))}>
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Open Analytics</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/customers'))}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Customers</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/dispatch'))}>
              <Map className="mr-2 h-4 w-4" />
              <span>Dispatch Board</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/finance/invoices'))}>
              <CreditCard className="mr-2 h-4 w-4" />
              <span>Invoices</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push('/settings/organization'))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Organization Settings</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push('/settings/billing'))}>
              <FileText className="mr-2 h-4 w-4" />
              <span>Billing & Subscriptions</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
