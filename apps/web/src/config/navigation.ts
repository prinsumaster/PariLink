import {
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Truck,
  CreditCard,
  FileText,
  Settings,
  Building2,
  Users2,
  Briefcase,
  Activity,
  FileSpreadsheet,
  Sparkles,
  MessageSquare,
  Zap,
  Store,
  Download,
  GitBranch,
  Server,
  ShieldCheck,
  FolderOpen,
  Monitor,
  AlertTriangle,
  DatabaseBackup,
  Bot,
  Brain,
  FileCode2,
  DollarSign,
  LineChart,
  Crown,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: any;
  badge?: string;
  permissions?: string[];
  children?: NavItem[];
}

export interface NavGroup {
  title: string;
  items: NavItem[];
}

export const navigationConfig: NavGroup[] = [
  {
    title: 'LogOS Workspace',
    items: [
      {
        title: 'Command Center',
        href: '/command-center',
        icon: LayoutDashboard,
      },

      {
        title: 'Messaging',
        href: '/chat',
        icon: MessageSquare,
      },
      {
        title: 'AI Copilot',
        href: '/ai/copilot',
        icon: Bot,
      },
      {
        title: 'Documents',
        href: '/documents',
        icon: FolderOpen,
      },
      {
        title: 'Downloads',
        href: '/downloads',
        icon: Download,
      },
      {
        title: 'Automation',
        href: '/automation',
        icon: Zap,
      },
    ],
  },
  {
    title: 'Enterprise AI Platform',
    items: [
      {
        title: 'Knowledge Hub',
        href: '/ai/knowledge',
        icon: Brain,
      },
      {
        title: 'Agent Console',
        href: '/ai/agents',
        icon: Bot,
      },
      {
        title: 'Prompt Studio',
        href: '/ai/prompt-studio',
        icon: FileCode2,
      },
      {
        title: 'Model Registry',
        href: '/ai/models',
        icon: Server,
      },
      {
        title: 'AI Analytics',
        href: '/ai/analytics',
        icon: LineChart,
      },
      {
        title: 'Cost & Optimization',
        href: '/ai/cost',
        icon: DollarSign,
      },
      {
        title: 'AI Governance',
        href: '/ai/evaluations',
        icon: ShieldCheck,
      },
    ],
  },
  {
    title: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Loads',
        href: '/loads',
        icon: Package,
      },
      {
        title: 'Trips',
        href: '/trips',
        icon: MapPin,
      },
      {
        title: 'Dispatch',
        href: '/dispatch',
        icon: Truck,
      },
      {
        title: 'Tracking',
        href: '/tracking',
        icon: Activity,
      },
    ],
  },
  {
    title: 'Fleet & Personnel',
    items: [
      {
        title: 'Fleet',
        href: '/fleet',
        icon: Truck,
      },
      {
        title: 'Drivers',
        href: '/drivers',
        icon: Users,
      },
    ],
  },
  {
    title: 'Financials',
    items: [
      {
        title: 'Billing',
        href: '/billing',
        icon: FileText,
      },
      {
        title: 'Payments',
        href: '/payments',
        icon: CreditCard,
      },
      {
        title: 'Ledger',
        href: '/ledger',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: 'Relationships',
    items: [
      {
        title: 'Customers',
        href: '/customers',
        icon: Briefcase,
      },
      {
        title: 'Vendors',
        href: '/vendors',
        icon: Building2,
      },
    ],
  },
  {
    title: 'Platform',
    items: [
      {
        title: 'App Marketplace',
        href: '/admin/marketplace',
        icon: Store,
      },
      {
        title: 'Admin Console',
        href: '/admin',
        icon: ShieldCheck,
        children: [
          { title: 'Subscription Center', href: '/admin/subscriptions', icon: Crown },
          { title: 'Users', href: '/admin/users', icon: Users2 },
          { title: 'Roles', href: '/admin/roles', icon: Settings },
          { title: 'Branches', href: '/admin/branches', icon: Building2 },
          { title: 'Company Settings', href: '/admin/settings', icon: Settings },
        ],
      },
    ],
  },
  {
    title: 'SRE & Observability',
    items: [
      {
        title: 'Operations',
        href: '/operations',
        icon: Monitor,
        badge: 'SRE',
      },
      {
        title: 'Log Explorer',
        href: '/operations/logs',
        icon: FileText,
      },
      {
        title: 'Trace Explorer',
        href: '/operations/traces',
        icon: GitBranch,
      },
      {
        title: 'Incidents',
        href: '/operations/incidents',
        icon: AlertTriangle,
      },
      {
        title: 'Backup & DR',
        href: '/operations/backup',
        icon: DatabaseBackup,
      },
    ],
  },
];
