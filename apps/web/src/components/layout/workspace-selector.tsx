'use client';

import { useAuthStore } from '@/store/auth';
import { Building2, Check, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function WorkspaceSelector() {
  const { user, activeTenant, setTenant } = useAuthStore();

  if (!user || !user.tenants || user.tenants.length === 0) {
    return null;
  }

  // Fallback to first tenant if none is active
  const current = activeTenant || user.tenants[0];

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors w-full justify-between">
          <div className="flex items-center truncate">
            <Building2 className="mr-2 h-4 w-4 shrink-0 opacity-50" />
            <span className="truncate">{current.name}</span>
          </div>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="start">
        {user.tenants.map((tenant) => (
          <DropdownMenuItem
            key={tenant.id}
            onSelect={() => setTenant(tenant)}
            className="flex items-center justify-between"
          >
            {tenant.name}
            <Check
              className={cn(
                "h-4 w-4",
                current.id === tenant.id ? "opacity-100" : "opacity-0"
              )}
            />
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
