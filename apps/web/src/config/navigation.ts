import {
  LayoutDashboard,
  Package,
  MapPin,
  Users,
  Truck,
  CreditCard,
  FileText,
  Settings,
  Users2,
  Briefcase,
  Activity,
  FileSpreadsheet,
  ShieldCheck,
  FolderOpen,
  CheckCircle,
  MessageSquare,
  Bot,
  Download,
  Zap,
  Brain,
  FileCode2,
  Server,
  LineChart,
  DollarSign,
  Store,
  Crown,
  Building2,
  Monitor,
  GitBranch,
  AlertTriangle,
  DatabaseBackup,
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
  */
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
        title: 'Booking',
        href: '/loads',
        icon: Package,
      },
      {
        title: 'Bilty (LR)',
        href: '/bilty',
        icon: FileText,
      },
      {
        title: 'Dispatch',
        href: '/dispatch',
        icon: Truck,
      },
      {
        title: 'Trips',
        href: '/trips',
        icon: MapPin,
      },
      {
        title: 'Tracking',
        href: '/tracking',
        icon: Activity,
      },
      {
        title: 'POD',
        href: '/pod',
        icon: CheckCircle,
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
    title: 'Relationships',
    items: [
      {
        title: 'Customers',
        href: '/customers',
        icon: Briefcase,
      },
      /*
      {
        title: 'Vendors',
        href: '/vendors',
        icon: Building2,
      },
      */
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
        title: 'Accounts',
        href: '/ledger',
        icon: FileSpreadsheet,
      },
    ],
  },
  {
    title: 'Files & Data',
    items: [
      {
        title: 'Documents',
        href: '/documents',
        icon: FolderOpen,
      },
      {
        title: 'Reports',
        href: '/reports',
        icon: FileText,
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
          /* HIDING Subscription Center
          { title: 'Subscription Center', href: '/admin/subscriptions', icon: Crown },
          */
          { title: 'Users', href: '/admin/users', icon: Users2 },
          { title: 'Roles', href: '/admin/roles', icon: Settings },
          /* HIDING Branches 
          { title: 'Branches', href: '/branches', icon: Building2 },
          */
          { title: 'Settings', href: '/settings', icon: Settings },
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
