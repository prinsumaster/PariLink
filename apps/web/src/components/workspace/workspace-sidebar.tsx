'use client';

import { useWorkspaceKernelStore } from '@/store/workspace-kernel';
import { navigationConfig } from '@/config/navigation';
import { cn } from '@/lib/utils';
import { ChevronLeft, ChevronRight, Settings, LogOut } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { useAuthStore } from '@/store/auth';
import { useRouter } from 'next/navigation';

export function WorkspaceSidebar() {
  const { sidebarCollapsed, openTab, activeTabId, setSidebarCollapsed } = useWorkspaceKernelStore();
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);
  const router = useRouter();

  const handleNavigation = (item: any) => {
    let componentType = 'Dashboard';
    if (item.href.startsWith('/loads'))           componentType = 'Loads';
    else if (item.href.startsWith('/trips'))       componentType = 'Trips';
    else if (item.href.startsWith('/dispatch-workspace')) componentType = 'DispatchWorkspace';
    else if (item.href.startsWith('/dispatch'))    componentType = 'Dispatch';
    else if (item.href.startsWith('/fleet'))       componentType = 'Fleet';
    else if (item.href.startsWith('/drivers'))     componentType = 'Drivers';
    else if (item.href.startsWith('/customers'))   componentType = 'Customers';
    else if (item.href.startsWith('/vendors'))     componentType = 'Vendors';
    else if (item.href.startsWith('/billing'))     componentType = 'Billing';
    else if (item.href.startsWith('/payments'))    componentType = 'Payments';
    else if (item.href.startsWith('/command-center')) componentType = 'CommandCenter';
    else if (item.href === '/ai')                  componentType = 'AiCopilot';
    else if (item.href === '/ai/knowledge')        componentType = 'AiKnowledge';
    else if (item.href === '/ai/agents')           componentType = 'AiAgents';
    else if (item.href === '/ai/prompt-studio')    componentType = 'AiPromptStudio';
    else if (item.href === '/ai/models')           componentType = 'AiModels';
    else if (item.href === '/ai/analytics')        componentType = 'AiAnalytics';
    else if (item.href === '/ai/cost')             componentType = 'AiCost';
    else if (item.href === '/ai/evaluations')      componentType = 'AiEvaluations';
    else if (item.href.startsWith('/ai'))          componentType = 'AiPlatform';
    else if (item.href.startsWith('/chat'))        componentType = 'Chat';
    else if (item.href.startsWith('/automation'))       componentType = 'Automation';
    else if (item.href === '/admin/marketplace')        componentType = 'AdminMarketplace';
    else if (item.href === '/admin/users')              componentType = 'AdminUsers';
    else if (item.href.startsWith('/admin'))            componentType = 'Admin';
    else if (item.href.startsWith('/documents'))        componentType = 'Documents';
    else if (item.href.startsWith('/downloads'))        componentType = 'Downloads';
    else if (item.href.startsWith('/ledger'))           componentType = 'Ledger';
    else if (item.href.startsWith('/tracking'))         componentType = 'Tracking';
    else if (item.href === '/operations/logs')          componentType = 'OperationsLogs';
    else if (item.href === '/operations/traces')        componentType = 'OperationsTraces';
    else if (item.href === '/operations/incidents')     componentType = 'OperationsIncidents';
    else if (item.href === '/operations/backup')        componentType = 'OperationsBackup';
    else if (item.href.startsWith('/operations'))       componentType = 'Operations';
    else if (item.href.startsWith('/analytics'))        componentType = 'Analytics';
    else if (item.href.startsWith('/notifications'))    componentType = 'Notifications';
    else if (item.href.startsWith('/inbox'))            componentType = 'Inbox';
    else if (item.href.startsWith('/integrations'))     componentType = 'Integrations';
    else if (item.href.startsWith('/settings'))         componentType = 'Settings';
    else if (item.href.startsWith('/dashboard'))        componentType = 'Dashboard';

    const tabId = item.id || componentType.toLowerCase();
    openTab({ id: tabId, title: item.title, type: componentType, url: item.href, icon: item.icon });
  };

  const handleLogout = () => { logout(); router.push('/login'); };

  const userInitials = `${user?.firstName?.charAt(0) ?? ''}${user?.lastName?.charAt(0) ?? ''}`.toUpperCase() || 'U';

  return (
    <TooltipProvider delay={150}>
      <div
        className={cn(
          'flex flex-col border-r border-border bg-sidebar text-sidebar-foreground',
          'transition-[width] duration-300 ease-in-out overflow-hidden shrink-0',
          sidebarCollapsed ? 'w-[60px]' : 'w-64',
        )}
      >
        {/* ── Logo / Brand ────────────────────────────────── */}
        <div className={cn(
          'h-14 flex items-center border-b border-sidebar-border shrink-0',
          sidebarCollapsed ? 'justify-center px-0' : 'px-4 gap-3',
        )}>
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center shrink-0">
            <span className="text-primary-foreground font-bold text-sm">P</span>
          </div>
          {!sidebarCollapsed && (
            <span className="font-semibold text-sm text-sidebar-foreground truncate">
              PariLink LogOS
            </span>
          )}
        </div>

        {/* ── Navigation ──────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto py-3 custom-scrollbar">
          <nav className={cn('flex flex-col gap-5', sidebarCollapsed ? 'px-2' : 'px-3')}>
            {navigationConfig.map((group) => (
              <div key={group.title} className="flex flex-col gap-0.5">
                {/* Group label */}
                {!sidebarCollapsed && (
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground px-2 mb-1">
                    {group.title}
                  </p>
                )}

                {group.items.map((item) => {
                  const Icon = item.icon;
                  const itemId = item.href.split('/')[1] || 'dashboard';
                  const isActive = activeTabId === itemId;

                  const navItem = (
                    <button
                      key={item.href}
                      onClick={() => handleNavigation(item)}
                      className={cn(
                        'group flex items-center rounded-lg transition-all duration-150 text-left w-full relative',
                        sidebarCollapsed ? 'h-9 w-9 justify-center' : 'gap-2.5 px-2.5 py-2',
                        isActive
                          ? 'bg-sidebar-accent text-sidebar-primary font-medium'
                          : 'text-sidebar-foreground/70 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground',
                      )}
                    >
                      {/* Active indicator */}
                      {isActive && !sidebarCollapsed && (
                        <span className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-0.5 rounded-r-full bg-primary" />
                      )}
                      <Icon className={cn(
                        'shrink-0 transition-colors',
                        sidebarCollapsed ? 'h-5 w-5' : 'h-4 w-4',
                        isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground',
                      )} />
                      {!sidebarCollapsed && (
                        <span className="truncate text-sm">{item.title}</span>
                      )}
                    </button>
                  );

                  if (sidebarCollapsed) {
                    return (
                      <Tooltip key={item.href}>
                        <TooltipTrigger>{navItem}</TooltipTrigger>
                        <TooltipContent side="right" className="font-medium">
                          {item.title}
                        </TooltipContent>
                      </Tooltip>
                    );
                  }

                  return navItem;
                })}
              </div>
            ))}
          </nav>
        </div>

        {/* ── Footer ──────────────────────────────────────── */}
        <div className={cn(
          'shrink-0 border-t border-sidebar-border',
          sidebarCollapsed ? 'p-2 flex flex-col items-center gap-1' : 'p-3 space-y-1',
        )}>
          {/* Settings */}
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger>
                <button className="h-9 w-9 flex items-center justify-center rounded-lg text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors">
                  <Settings className="h-4 w-4" />
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">Settings</TooltipContent>
            </Tooltip>
          ) : (
            <button className="flex items-center gap-2.5 w-full px-2.5 py-2 rounded-lg text-sm text-muted-foreground hover:bg-sidebar-accent hover:text-foreground transition-colors">
              <Settings className="h-4 w-4 shrink-0" />
              <span>Settings</span>
            </button>
          )}

          {/* User avatar */}
          {sidebarCollapsed ? (
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={handleLogout}
                  className="h-9 w-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0 hover:opacity-80 transition-opacity"
                >
                  {userInitials}
                </button>
              </TooltipTrigger>
              <TooltipContent side="right">
                {user?.firstName} {user?.lastName} — Logout
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-sidebar-accent transition-colors group">
              <div className="h-7 w-7 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-xs font-bold shrink-0">
                {userInitials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-foreground truncate">
                  {user?.firstName} {user?.lastName}
                </p>
                <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="opacity-0 group-hover:opacity-100 transition-opacity text-muted-foreground hover:text-destructive"
                title="Logout"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* ── Collapse Toggle ──────────────────────────────── */}
        <button
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className={cn(
            'absolute bottom-24 flex items-center justify-center',
            'h-5 w-5 rounded-full border border-border bg-background shadow-sm',
            'text-muted-foreground hover:text-foreground hover:border-primary/50 transition-all',
            'opacity-0 hover:opacity-100 focus:opacity-100',
            sidebarCollapsed ? 'left-[52px]' : 'left-[248px]',
          )}
          style={{ zIndex: 50 }}
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed
            ? <ChevronRight className="h-3 w-3" />
            : <ChevronLeft className="h-3 w-3" />}
        </button>
      </div>
    </TooltipProvider>
  );
}
