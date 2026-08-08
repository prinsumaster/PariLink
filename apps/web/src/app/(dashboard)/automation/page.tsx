'use client';

import { useState, useEffect } from 'react';
import { PageHeader } from '@/components/ui/page-header';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { api } from '@/services/api';
import { 
  Zap, Plus, Play, Pause, ChevronRight, Clock, 
  ToggleLeft, ToggleRight, Workflow, Mail, MessageSquare,
  Bell, FileText, DollarSign, Truck, CheckCircle2,
  Loader2, ArrowRight, GitBranch, Settings
} from 'lucide-react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';

interface WorkflowDef {
  id: string;
  name: string;
  description?: string;
  status: string;
  trigger: any;
  steps: any[];
  createdAt: string;
  _count?: { executions: number };
}

const TRIGGER_ICONS: Record<string, any> = {
  LOAD_CREATED: Truck,
  INVOICE_OVERDUE: DollarSign,
  TRIP_COMPLETED: CheckCircle2,
  DRIVER_ASSIGNED: Workflow,
  DEFAULT: Zap,
};

const ACTION_ICONS: Record<string, any> = {
  SEND_EMAIL: Mail,
  SEND_WHATSAPP: MessageSquare,
  SEND_NOTIFICATION: Bell,
  GENERATE_DOCUMENT: FileText,
  DEFAULT: ArrowRight,
};

const TEMPLATES = [
  {
    name: 'Invoice Overdue Alert',
    description: 'Automatically send WhatsApp + email to customers when invoices exceed 30 days past due',
    trigger: 'INVOICE_OVERDUE',
    actions: ['SEND_WHATSAPP', 'SEND_EMAIL'],
    category: 'Finance',
  },
  {
    name: 'Load Completion Notification',
    description: 'Notify customers via email when their load is delivered and attach the POD document',
    trigger: 'TRIP_COMPLETED',
    actions: ['SEND_EMAIL', 'GENERATE_DOCUMENT'],
    category: 'Operations',
  },
  {
    name: 'Driver Assignment Alert',
    description: 'Send SMS to driver when they are assigned to a new load with pickup instructions',
    trigger: 'DRIVER_ASSIGNED',
    actions: ['SEND_WHATSAPP', 'SEND_NOTIFICATION'],
    category: 'Fleet',
  },
  {
    name: 'New Load Created',
    description: 'Alert the dispatch team when a new load is created that needs assignment',
    trigger: 'LOAD_CREATED',
    actions: ['SEND_NOTIFICATION'],
    category: 'Dispatch',
  },
  {
    name: 'Weekly Finance Report',
    description: 'Generate and email the weekly financial summary every Monday morning',
    trigger: 'SCHEDULE_WEEKLY',
    actions: ['GENERATE_DOCUMENT', 'SEND_EMAIL'],
    category: 'Finance',
  },
  {
    name: 'Maintenance Reminder',
    description: 'Alert fleet managers when vehicles are due for maintenance based on mileage',
    trigger: 'MAINTENANCE_DUE',
    actions: ['SEND_NOTIFICATION', 'SEND_EMAIL'],
    category: 'Fleet',
  },
];

const CATEGORY_COLORS: Record<string, string> = {
  Finance: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400',
  Operations: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-400',
  Fleet: 'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-400',
  Dispatch: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400',
};

export default function AutomationPage() {
  const [workflows, setWorkflows] = useState<WorkflowDef[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'automations' | 'templates'>('automations');
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => { fetchWorkflows(); }, []);

  async function fetchWorkflows() {
    try {
      const res = await api.get('/workflow/v2/definitions').catch(() => api.get('/workflow/rules'));
      setWorkflows(Array.isArray(res.data) ? res.data : res.data.data || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const publishWorkflow = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/workflow/v2/definitions/${id}/publish`);
      await fetchWorkflows();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const archiveWorkflow = async (id: string) => {
    setActionLoading(id);
    try {
      await api.post(`/workflow/v2/definitions/${id}/archive`);
      await fetchWorkflows();
    } catch (e) { console.error(e); }
    finally { setActionLoading(null); }
  };

  const createFromTemplate = async (template: typeof TEMPLATES[0]) => {
    setActionLoading(template.name);
    try {
      await api.post('/workflow/v2/definitions', {
        name: template.name,
        description: template.description,
        trigger: { type: template.trigger },
        steps: template.actions.map((action, i) => ({ id: `step_${i}`, type: action, config: {} })),
      });
      setActiveTab('automations');
      await fetchWorkflows();
    } catch (e) {
      // Fallback to rules API if definitions not available
      await api.post('/workflow/rules', {
        name: template.name,
        description: template.description,
        triggerEvent: template.trigger,
        conditions: [],
        actions: template.actions.map(a => ({ type: a, config: {} })),
        isActive: true,
      });
      setActiveTab('automations');
      await fetchWorkflows();
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PUBLISHED': case 'ACTIVE': return 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400';
      case 'DRAFT': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400';
      case 'ARCHIVED': return 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-500';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const activeCount = workflows.filter(w => w.status === 'PUBLISHED' || w.status === 'ACTIVE').length;

  return (
    <div className="space-y-6">
      <PageHeader title="Workflow Automation" description="Automate repetitive operations with trigger-based workflows">
        <div className="flex items-center gap-3">
          <span className="text-sm text-emerald-600 dark:text-emerald-400 font-medium">{activeCount} active</span>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white text-sm h-9" onClick={() => setActiveTab('templates')}>
            <Plus className="h-4 w-4 mr-1.5" /> New Automation
          </Button>
        </div>
      </PageHeader>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-lg w-fit">
        {['automations', 'templates'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab as any)}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors capitalize ${
              activeTab === tab ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
            }`}
          >
            {tab === 'automations' ? 'My Automations' : 'Template Library'}
          </button>
        ))}
      </div>

      {activeTab === 'automations' && (
        loading ? (
          <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-indigo-600" /></div>
        ) : workflows.length === 0 ? (
          <div className="text-center py-24">
            <div className="h-16 w-16 rounded-2xl bg-slate-100 dark:bg-slate-900 flex items-center justify-center mx-auto mb-4">
              <Zap className="h-8 w-8 text-slate-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">No automations yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">Build workflows that automatically send notifications, generate documents, and update records based on business triggers.</p>
            <Button onClick={() => setActiveTab('templates')} className="bg-indigo-600 hover:bg-indigo-700 text-white">
              <Plus className="h-4 w-4 mr-1.5" /> Browse Templates
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {workflows.map(wf => {
              const TriggerIcon = TRIGGER_ICONS[wf.trigger?.type] || TRIGGER_ICONS.DEFAULT;
              const isActive = wf.status === 'PUBLISHED' || wf.status === 'ACTIVE';
              return (
                <Card key={wf.id} className="p-5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-indigo-100 dark:bg-indigo-900/30' : 'bg-slate-100 dark:bg-slate-900'}`}>
                        <TriggerIcon className={`h-5 w-5 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-slate-900 dark:text-slate-100">{wf.name}</h3>
                        {wf.description && <p className="text-sm text-slate-500 mt-0.5">{wf.description}</p>}
                        <div className="flex items-center gap-3 mt-2">
                          <Badge className={`text-[10px] border-0 ${getStatusColor(wf.status)}`}>{wf.status}</Badge>
                          {wf.trigger?.type && (
                            <span className="text-xs text-slate-400 flex items-center gap-1">
                              <GitBranch className="h-3 w-3" /> {wf.trigger.type.replace(/_/g, ' ')}
                            </span>
                          )}
                          <span className="text-xs text-slate-400 flex items-center gap-1">
                            <Clock className="h-3 w-3" /> {format(new Date(wf.createdAt), 'MMM d, yyyy')}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {isActive ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="h-8 text-xs gap-1.5"
                          onClick={() => archiveWorkflow(wf.id)}
                          disabled={actionLoading === wf.id}
                        >
                          {actionLoading === wf.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Pause className="h-3 w-3" />}
                          Pause
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          className="h-8 text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                          onClick={() => publishWorkflow(wf.id)}
                          disabled={actionLoading === wf.id}
                        >
                          {actionLoading === wf.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Play className="h-3 w-3" />}
                          Activate
                        </Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0" onClick={() => router.push(`/automation/builder/${wf.id}`)}>
                        <Settings className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )
      )}

      {activeTab === 'templates' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TEMPLATES.map(template => {
            const TriggerIcon = TRIGGER_ICONS[template.trigger] || TRIGGER_ICONS.DEFAULT;
            return (
              <Card key={template.name} className="p-5 bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 hover:shadow-md transition-shadow group">
                <div className="flex items-start justify-between mb-3">
                  <div className="h-10 w-10 rounded-xl bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                    <TriggerIcon className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <Badge className={`text-[10px] border-0 ${CATEGORY_COLORS[template.category] || ''}`}>{template.category}</Badge>
                </div>
                <h3 className="font-semibold text-sm text-slate-900 dark:text-slate-100 mb-1">{template.name}</h3>
                <p className="text-xs text-slate-500 leading-relaxed mb-4">{template.description}</p>
                
                {/* Actions preview */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                  <span className="text-[10px] text-slate-400 font-medium">Actions:</span>
                  {template.actions.map(action => {
                    const Icon = ACTION_ICONS[action] || ACTION_ICONS.DEFAULT;
                    return (
                      <div key={action} className="flex items-center gap-1 text-[10px] bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 rounded px-1.5 py-0.5">
                        <Icon className="h-2.5 w-2.5" /> {action.replace(/_/g, ' ')}
                      </div>
                    );
                  })}
                </div>

                <Button
                  size="sm"
                  className="w-full h-8 text-xs bg-indigo-600 hover:bg-indigo-700 text-white"
                  onClick={() => createFromTemplate(template)}
                  disabled={actionLoading === template.name}
                >
                  {actionLoading === template.name ? <Loader2 className="h-3 w-3 animate-spin mr-1" /> : null}
                  Use Template <ChevronRight className="h-3 w-3 ml-auto" />
                </Button>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
