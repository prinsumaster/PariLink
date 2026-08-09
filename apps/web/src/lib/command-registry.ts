/**
 * PariLink Command Registry
 *
 * The single source of truth for every runnable operation in the OS.
 * Commands can navigate, open inline panels, trigger mutations, or
 * orchestrate multi-step workflows — all without leaving the palette.
 */

export type CommandCategory =
  | 'create'
  | 'navigate'
  | 'system'
  | 'search';

export interface PariCommand {
  id: string;
  title: string;
  description: string;
  category: CommandCategory;
  keywords: string[];
  shortcut?: string;
  /** If set, the command opens this route via router.push */
  href?: string;
  /** If set, opens an inline panel inside the palette */
  inlinePanel?: string;
  /** If set, fires this action directly */
  action?: string;
  /** Visual accent for the icon bg */
  color?: string;
  icon: string; // lucide icon name
  /** Estimated time to complete this workflow */
  eta?: string;
}

export const COMMAND_REGISTRY: PariCommand[] = [
  // ─── CREATE ────────────────────────────────────────────
  {
    id: 'create-trip',
    title: 'Create Trip',
    description: 'Plan a new driver trip and route assignment',
    category: 'create',
    keywords: ['trip', 'route', 'plan', 'create', 'new', 'drive'],
    shortcut: 'C T',
    href: '/trips/new',
    color: 'bg-blue-500',
    icon: 'MapPin',
    eta: '~1 min',
  },
  {
    id: 'create-driver',
    title: 'Add Driver',
    description: 'Onboard a new driver to the fleet',
    category: 'create',
    keywords: ['driver', 'operator', 'add', 'onboard', 'hire', 'new'],
    href: '/drivers/new',
    color: 'bg-violet-500',
    icon: 'UserPlus',
    eta: '~2 min',
  },
  {
    id: 'create-vehicle',
    title: 'Add Vehicle',
    description: 'Register a new asset into the fleet',
    category: 'create',
    keywords: ['vehicle', 'truck', 'trailer', 'add', 'new', 'fleet'],
    href: '/fleet/new',
    color: 'bg-indigo-500',
    icon: 'Truck',
    eta: '~1 min',
  },

  // ─── NAVIGATE ──────────────────────────────────────────
  {
    id: 'nav-command-center',
    title: 'Command Center',
    description: 'Operations dashboard and live metrics',
    category: 'navigate',
    keywords: ['dashboard', 'overview', 'command', 'center', 'home', 'metrics'],
    shortcut: 'G C',
    href: '/command-center',
    icon: 'LayoutDashboard',
  },
  {
    id: 'nav-loads',
    title: 'Loads',
    description: 'All load orders and shipment status',
    category: 'navigate',
    keywords: ['loads', 'shipments', 'freight', 'orders'],
    shortcut: 'G L',
    href: '/loads',
    icon: 'Package',
  },
  {
    id: 'nav-trips',
    title: 'Trips',
    description: 'Active and planned driver trips',
    category: 'navigate',
    keywords: ['trips', 'routes', 'drivers', 'active'],
    shortcut: 'G T',
    href: '/trips',
    icon: 'MapPin',
  },
  {
    id: 'nav-dispatch',
    title: 'Dispatch Board',
    description: 'Live dispatch workspace for operations',
    category: 'navigate',
    keywords: ['dispatch', 'board', 'operations', 'live'],
    shortcut: 'G D',
    href: '/dispatch-workspace',
    icon: 'TerminalSquare',
  },
  {
    id: 'nav-fleet',
    title: 'Fleet',
    description: 'Vehicle inventory and maintenance status',
    category: 'navigate',
    keywords: ['fleet', 'vehicles', 'trucks', 'trailers', 'maintenance'],
    shortcut: 'G F',
    href: '/fleet',
    icon: 'Truck',
  },
  {
    id: 'nav-drivers',
    title: 'Drivers',
    description: 'Driver roster, compliance and availability',
    category: 'navigate',
    keywords: ['drivers', 'roster', 'personnel', 'hires', 'compliance'],
    shortcut: 'G R',
    href: '/drivers',
    icon: 'Users',
  },
  {
    id: 'nav-customers',
    title: 'Customers',
    description: 'Customer accounts and relationships',
    category: 'navigate',
    keywords: ['customers', 'clients', 'accounts', 'crm'],
    href: '/customers',
    icon: 'Building2',
  },
  {
    id: 'nav-billing',
    title: 'Billing & Invoices',
    description: 'Invoice management and AR tracking',
    category: 'navigate',
    keywords: ['billing', 'invoices', 'ar', 'receivables', 'finance'],
    shortcut: 'G B',
    href: '/billing',
    icon: 'FileText',
  },
  {
    id: 'nav-tracking',
    title: 'Live Tracking',
    description: 'GPS tracking and shipment visibility',
    category: 'navigate',
    keywords: ['tracking', 'gps', 'live', 'location', 'visibility', 'map'],
    href: '/tracking',
    icon: 'Navigation',
  },
  {
    id: 'nav-analytics',
    title: 'Analytics',
    description: 'Business intelligence and performance metrics',
    category: 'navigate',
    keywords: ['analytics', 'reports', 'metrics', 'kpi', 'performance', 'data'],
    href: '/analytics/command-center',
    icon: 'BarChart3',
  },

  // ─── SYSTEM ────────────────────────────────────────────
  {
    id: 'toggle-theme-dark',
    title: 'Switch to Dark Mode',
    description: 'Apply the dark color scheme',
    category: 'system',
    keywords: ['dark', 'mode', 'theme', 'night', 'appearance'],
    action: 'SET_THEME_DARK',
    icon: 'Moon',
  },
  {
    id: 'toggle-theme-light',
    title: 'Switch to Light Mode',
    description: 'Apply the light color scheme',
    category: 'system',
    keywords: ['light', 'mode', 'theme', 'day', 'appearance'],
    action: 'SET_THEME_LIGHT',
    icon: 'Sun',
  },
  {
    id: 'toggle-theme-system',
    title: 'Use System Theme',
    description: 'Follow the OS appearance setting',
    category: 'system',
    keywords: ['system', 'auto', 'theme', 'os'],
    action: 'SET_THEME_SYSTEM',
    icon: 'Monitor',
  },
  {
    id: 'open-settings',
    title: 'Settings',
    description: 'Company, profile and workspace settings',
    category: 'system',
    keywords: ['settings', 'preferences', 'profile', 'company', 'configure'],
    href: '/settings',
    icon: 'Settings',
  },
];

export const CATEGORY_META: Record<CommandCategory, { label: string; color: string }> = {
  create: { label: 'Create', color: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300' },
  navigate: { label: 'Navigate', color: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  system: { label: 'System', color: 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400' },
  search: { label: 'Search', color: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300' },
};

// Recent commands — stored in localStorage
const RECENT_KEY = 'parilink-recent-commands';
const MAX_RECENT = 5;

export function getRecentCommandIds(): string[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? '[]');
  } catch {
    return [];
  }
}

export function recordRecentCommand(id: string) {
  if (typeof window === 'undefined') return;
  try {
    const existing = getRecentCommandIds().filter((i) => i !== id);
    const updated = [id, ...existing].slice(0, MAX_RECENT);
    localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
  } catch {
    // ignore
  }
}

export function getRecentCommands(): PariCommand[] {
  const ids = getRecentCommandIds();
  return ids
    .map((id) => COMMAND_REGISTRY.find((c) => c.id === id))
    .filter(Boolean) as PariCommand[];
}
