'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Building2, Shield, Bell, Palette, Webhook, Activity, Download } from 'lucide-react';

interface SettingsLayoutProps {
  children: React.ReactNode;
}

export function SettingsLayout({ children }: SettingsLayoutProps) {
  const pathname = usePathname();

  const navItems = [
    { href: '/settings/organization', label: 'Organization', icon: <Building2 className="h-4 w-4 mr-2" /> },
    { href: '/settings/security', label: 'Security & Access', icon: <Shield className="h-4 w-4 mr-2" /> },
    { href: '/settings/onboarding', label: 'Onboarding Kit', icon: <Download className="h-4 w-4 mr-2" /> },
    { href: '/notifications/preferences', label: 'Notifications', icon: <Bell className="h-4 w-4 mr-2" /> }, // Links out to existing module
    { href: '#', label: 'Appearance', icon: <Palette className="h-4 w-4 mr-2" /> },
    { href: '#', label: 'API & Webhooks', icon: <Webhook className="h-4 w-4 mr-2" /> },
    { href: '#', label: 'Audit Logs', icon: <Activity className="h-4 w-4 mr-2" /> },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-8 max-w-6xl mx-auto animate-in fade-in duration-500">
      
      <aside className="w-full md:w-64 shrink-0">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-white mb-6">Settings</h2>
        <nav className="flex flex-col space-y-1">
          {navItems.map((item) => {
            const isActive = pathname.startsWith(item.href) && item.href !== '#';
            return (
              <Link 
                key={item.label} 
                href={item.href}
                className={`flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
                  isActive 
                    ? 'bg-blue-600 shadow-sm text-white' 
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                }`}
              >
                <div className={`mr-3 ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500'}`}>
                  {item.icon}
                </div>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        {children}
      </main>

    </div>
  );
}
