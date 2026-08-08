'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Truck,
  Map as MapIcon,
  Users,
  Settings,
  Shield,
  Bot,
  X,
  Package,
  Building2,
  DollarSign,
  BarChart3,
  FileText,
  CreditCard,
  Boxes,
  ChevronDown,
  ChevronRight,
  Zap,
  UsersRound,
  Warehouse,
  BookOpen,
  Bell,
  Store,
  Navigation,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WorkspaceSelector } from './workspace-selector';
import { useState } from 'react';

// ─── Nav Structure ────────────────────────────────────────────────────────────
interface NavItem {
  name: string;
  href: string;
  icon: React.ElementType;
  children?: { name: string; href: string }[];
}

const navigation: NavItem[] = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'AI Copilot', href: '/ai/copilot', icon: Bot },
  { name: 'Dispatch', href: '/dispatch', icon: Zap },
  { name: 'Live Map', href: '/tracking', icon: MapIcon },
  {
    name: 'Operations',
    href: '/loads',
    icon: Package,
    children: [
      { name: 'Loads', href: '/loads' },
      { name: 'Trips', href: '/trips' },
      { name: 'Orders', href: '/orders' },
    ],
  },
  {
    name: 'Fleet',
    href: '/fleet',
    icon: Truck,
    children: [
      { name: 'Vehicles', href: '/fleet' },
      { name: 'Trailers', href: '/trailers' },
      { name: 'Permits', href: '/vehicles/permits' },
    ],
  },
  {
    name: 'Workforce',
    href: '/drivers',
    icon: Users,
    children: [
      { name: 'Drivers', href: '/drivers' },
      { name: 'Attendance', href: '/drivers/attendance' },
      { name: 'Users', href: '/admin/users' },
    ],
  },
  {
    name: 'CRM',
    href: '/customers',
    icon: UsersRound,
    children: [
      { name: 'Customers', href: '/customers' },
      { name: 'Vendors', href: '/vendors' },
      { name: 'Leads', href: '/crm/leads' },
    ],
  },
  {
    name: 'Warehouses',
    href: '/wms',
    icon: Warehouse,
    children: [
      { name: 'Warehouses', href: '/wms' },
      { name: 'Branches', href: '/branches' },
    ],
  },
  {
    name: 'Finance',
    href: '/billing',
    icon: DollarSign,
    children: [
      { name: 'Invoices', href: '/billing' },
      { name: 'Payments', href: '/payments' },
      { name: 'Ledger', href: '/ledger' },
      { name: 'Finance', href: '/finance' },
    ],
  },
  {
    name: 'Reports',
    href: '/reports',
    icon: BarChart3,
    children: [
      { name: 'Dashboard', href: '/reports' },
      { name: 'Analytics', href: '/analytics/command-center' },
    ],
  },
  { name: 'Documents', href: '/documents', icon: FileText },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  {
    name: 'Admin',
    href: '/admin',
    icon: Shield,
    children: [
      { name: 'Overview', href: '/admin' },
      { name: 'Users', href: '/admin/users' },
      { name: 'Roles', href: '/admin/roles' },
      { name: 'Audit Log', href: '/admin/audit' },
      { name: 'Enterprise', href: '/admin/enterprise' },
      { name: 'Marketplace', href: '/admin/marketplace' },
    ],
  },
  { name: 'Integrations', href: '/integrations', icon: Store },
  { name: 'Settings', href: '/settings', icon: Settings },
];

interface SidebarProps {
  onClose?: () => void;
}

function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const isParentActive = pathname.startsWith(item.href);
  const [open, setOpen] = useState(isParentActive);

  if (!item.children) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link
        href={item.href}
        className={cn(
          'group flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isActive
            ? 'bg-primary/10 text-primary dark:bg-primary/20'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        )}
      >
        <item.icon className={cn('h-4 w-4 flex-shrink-0', isActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500')} />
        {item.name}
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(v => !v)}
        className={cn(
          'w-full group flex items-center gap-2.5 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
          isParentActive
            ? 'text-primary dark:text-primary'
            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-gray-100'
        )}
      >
        <item.icon className={cn('h-4 w-4 flex-shrink-0', isParentActive ? 'text-primary' : 'text-gray-400 group-hover:text-gray-500')} />
        <span className="flex-1 text-left">{item.name}</span>
        {open
          ? <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
          : <ChevronRight className="h-3.5 w-3.5 text-gray-400" />
        }
      </button>
      {open && (
        <div className="mt-0.5 ml-6 pl-2 border-l border-gray-200 dark:border-gray-700 space-y-0.5">
          {item.children.map(child => {
            const isChildActive = pathname === child.href || pathname.startsWith(child.href + '/');
            return (
              <Link
                key={child.href}
                href={child.href}
                className={cn(
                  'flex items-center px-3 py-1.5 text-sm rounded-md transition-colors',
                  isChildActive
                    ? 'text-primary font-medium bg-primary/5'
                    : 'text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-800/50'
                )}
              >
                {child.name}
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

export function Sidebar({ onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800">
      {/* Logo */}
      <div className="flex items-center justify-between h-14 px-4 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="flex items-center gap-2">
          <div className="bg-blue-600 p-1.5 rounded-md">
            <Navigation className="h-4 w-4 text-white" />
          </div>
          <span className="text-lg font-bold text-gray-900 dark:text-white">PariLink</span>
        </div>
        {onClose && (
          <button onClick={onClose} className="md:hidden p-2 rounded-md text-gray-500 hover:bg-gray-100">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      {/* Workspace Selector */}
      <div className="px-3 py-2 border-b border-gray-200 dark:border-gray-800 flex-shrink-0">
        <WorkspaceSelector />
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-3 space-y-0.5 overflow-y-auto scrollbar-thin">
        {navigation.map((item) => (
          <NavGroup key={item.href} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-800 flex-shrink-0">
        <div className="text-[10px] font-medium text-gray-400 dark:text-gray-600 uppercase tracking-wider">
          PariLink Enterprise v2.1
        </div>
      </div>
    </div>
  );
}
