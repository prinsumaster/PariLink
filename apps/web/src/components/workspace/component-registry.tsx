import dynamic from 'next/dynamic';
import { Loader2 } from 'lucide-react';

const Fallback = () => <div className="flex h-full items-center justify-center"><Loader2 className="h-6 w-6 animate-spin text-indigo-500" /></div>;

// Lazily load all major pages to avoid massive initial bundle
export const ComponentRegistry: Record<string, React.ComponentType<any>> = {
  'Dashboard': dynamic(() => import('@/app/(dashboard)/dashboard/page'), { loading: Fallback }),
  'Loads': dynamic(() => import('@/app/(dashboard)/loads/page'), { loading: Fallback }),
  'Trips': dynamic(() => import('@/app/(dashboard)/trips/page'), { loading: Fallback }),
  'Dispatch': dynamic(() => import('@/app/(dashboard)/dispatch/page'), { loading: Fallback }),
  'DispatchWorkspace': dynamic(() => import('@/app/(dashboard)/dispatch-workspace/page'), { loading: Fallback }),
  'Fleet': dynamic(() => import('@/app/(dashboard)/fleet/page'), { loading: Fallback }),
  'Drivers': dynamic(() => import('@/app/(dashboard)/drivers/page'), { loading: Fallback }),
  'Customers': dynamic(() => import('@/app/(dashboard)/customers/page'), { loading: Fallback }),
  'Vendors': dynamic(() => import('@/app/(dashboard)/vendors/page'), { loading: Fallback }),
  'Billing': dynamic(() => import('@/app/(dashboard)/billing/page'), { loading: Fallback }),
  'Payments': dynamic(() => import('@/app/(dashboard)/payments/page'), { loading: Fallback }),
  'CommandCenter': dynamic(() => import('@/app/(dashboard)/command-center/page'), { loading: Fallback }),
  'AiCopilot': dynamic(() => import('@/app/(dashboard)/ai/page'), { loading: Fallback }),
  'AiPlatform': dynamic(() => import('@/app/(dashboard)/ai/page'), { loading: Fallback }),
  'AiKnowledge': dynamic(() => import('@/app/(dashboard)/ai/knowledge/page'), { loading: Fallback }),
  'AiAgents': dynamic(() => import('@/app/(dashboard)/ai/agents/page'), { loading: Fallback }),
  'AiPromptStudio': dynamic(() => import('@/app/(dashboard)/ai/prompt-studio/page'), { loading: Fallback }),
  'AiModels': dynamic(() => import('@/app/(dashboard)/ai/models/page'), { loading: Fallback }),
  'AiAnalytics': dynamic(() => import('@/app/(dashboard)/ai/analytics/page'), { loading: Fallback }),
  'AiCost': dynamic(() => import('@/app/(dashboard)/ai/cost/page'), { loading: Fallback }),
  'AiEvaluations': dynamic(() => import('@/app/(dashboard)/ai/evaluations/page'), { loading: Fallback }),
  'Chat': dynamic(() => import('@/app/(dashboard)/chat/page'), { loading: Fallback }),
  'Automation': dynamic(() => import('@/app/(dashboard)/automation/page'), { loading: Fallback }),
  'Admin': dynamic(() => import('@/app/(dashboard)/admin/page'), { loading: Fallback }),
  'AdminMarketplace': dynamic(() => import('@/app/(dashboard)/admin/marketplace/page'), { loading: Fallback }),
  'AdminUsers': dynamic(() => import('@/app/(dashboard)/admin/users/page'), { loading: Fallback }),
  'Operations': dynamic(() => import('@/app/(dashboard)/operations/page'), { loading: Fallback }),
  'OperationsLogs': dynamic(() => import('@/app/(dashboard)/operations/logs/page'), { loading: Fallback }),
  'OperationsTraces': dynamic(() => import('@/app/(dashboard)/operations/traces/page'), { loading: Fallback }),
  'OperationsIncidents': dynamic(() => import('@/app/(dashboard)/operations/incidents/page'), { loading: Fallback }),
  'OperationsBackup': dynamic(() => import('@/app/(dashboard)/operations/backup/page'), { loading: Fallback }),
  'Documents': dynamic(() => import('@/app/(dashboard)/documents/page'), { loading: Fallback }),
  'Downloads': dynamic(() => import('@/app/(dashboard)/downloads/page'), { loading: Fallback }),
  'Ledger': dynamic(() => import('@/app/(dashboard)/ledger/page'), { loading: Fallback }),
  'Tracking': dynamic(() => import('@/app/(dashboard)/tracking/page'), { loading: Fallback }),
  'Analytics': dynamic(() => import('@/app/(dashboard)/analytics/command-center/page'), { loading: Fallback }),
  'Notifications': dynamic(() => import('@/app/(dashboard)/notifications/page'), { loading: Fallback }),
  'Inbox': dynamic(() => import('@/app/(dashboard)/inbox/page'), { loading: Fallback }),
  'Integrations': dynamic(() => import('@/app/(dashboard)/integrations/page'), { loading: Fallback }),
  'Settings': dynamic(() => import('@/app/(dashboard)/settings/notifications/page'), { loading: Fallback }),
};

export const getComponentForPath = (path: string) => {
  if (path.startsWith('/loads')) return 'Loads';
  if (path.startsWith('/trips')) return 'Trips';
  if (path.startsWith('/dispatch')) return 'Dispatch';
  if (path.startsWith('/fleet')) return 'Fleet';
  if (path.startsWith('/drivers')) return 'Drivers';
  if (path.startsWith('/customers')) return 'Customers';
  if (path.startsWith('/vendors')) return 'Vendors';
  if (path.startsWith('/billing')) return 'Billing';
  if (path.startsWith('/payments')) return 'Payments';
  if (path.startsWith('/command-center')) return 'CommandCenter';
  if (path.startsWith('/ai')) return 'AiCopilot';
  if (path.startsWith('/chat')) return 'Chat';
  if (path.startsWith('/automation')) return 'Automation';
  if (path.startsWith('/admin')) return 'Admin';
  if (path.startsWith('/operations/traces')) return 'OperationsTraces';
  if (path.startsWith('/operations/logs')) return 'OperationsLogs';
  if (path.startsWith('/operations/incidents')) return 'OperationsIncidents';
  if (path.startsWith('/operations/backup')) return 'OperationsBackup';
  if (path.startsWith('/operations')) return 'Operations';
  if (path.startsWith('/documents')) return 'Documents';
  if (path.startsWith('/ledger')) return 'Ledger';
  if (path.startsWith('/tracking')) return 'Tracking';
  if (path.startsWith('/ai/knowledge')) return 'AiKnowledge';
  if (path.startsWith('/ai/agents')) return 'AiAgents';
  if (path.startsWith('/ai/prompt-studio')) return 'AiPromptStudio';
  if (path.startsWith('/ai/models')) return 'AiModels';
  if (path.startsWith('/ai/analytics')) return 'AiAnalytics';
  if (path.startsWith('/ai/cost')) return 'AiCost';
  if (path.startsWith('/ai/evaluations')) return 'AiEvaluations';
  if (path.startsWith('/ai')) return 'AiCopilot';
  return 'Dashboard';
};
