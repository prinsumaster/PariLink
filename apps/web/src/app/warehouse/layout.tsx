'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Package, ArrowRightLeft, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function WarehouseLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { name: 'Dashboard', href: '/warehouse', icon: LayoutGrid },
    { name: 'Inventory', href: '/warehouse/inventory', icon: Package },
    { name: 'Transfers', href: '/warehouse/transfers', icon: ArrowRightLeft },
    { name: 'Tasks', href: '/warehouse/tasks', icon: ClipboardList },
  ];

  return (
    <div className="flex flex-col h-screen bg-slate-50 dark:bg-slate-950 pb-16 md:pb-0">
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full max-w-2xl mx-auto md:max-w-full">
        {children}
      </main>

      {/* Bottom Navigation for Mobile Devices / Scanners */}
      <nav className="fixed bottom-0 w-full bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-50 md:hidden pb-safe">
        <div className="flex justify-around items-center h-16">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link 
                key={item.name} 
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors",
                  isActive ? "text-indigo-600 dark:text-indigo-400" : "text-slate-500 hover:text-slate-900 dark:hover:text-slate-100"
                )}
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
