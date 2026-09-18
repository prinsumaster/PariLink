'use client';
import { TopClient } from '@/types/dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { money } from '@/lib/format';
import { Users } from 'lucide-react';

interface TopClientsProps {
  clients?: TopClient[];
  isLoading: boolean;
}

export function TopClients({ clients, isLoading }: TopClientsProps) {
  return (
    <Card className="glass elevation-1 border-slate-200/60 dark:border-slate-800/60 flex flex-col h-full">
      <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800/60 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="p-1.5 bg-blue-50 dark:bg-blue-900/20 text-blue-500 rounded-md">
              <Users className="h-4 w-4" />
            </div>
            <CardTitle className="text-base font-semibold text-slate-800 dark:text-slate-100">
              Top Clients
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-y-auto custom-scrollbar">
        {isLoading || !clients ? (
          <div className="p-4 space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="flex justify-between items-center animate-pulse">
                <div className="h-4 w-32 bg-slate-200 dark:bg-slate-800 rounded"></div>
                <div className="h-4 w-16 bg-slate-200 dark:bg-slate-800 rounded"></div>
              </div>
            ))}
          </div>
        ) : Array.isArray(clients) && clients.length > 0 ? (
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {clients.map((client) => (
              <div key={client.id} className="p-4 flex justify-between items-center hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                <span className="font-medium text-sm text-slate-700 dark:text-slate-300">
                  {client.name}
                </span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {money(client.amount)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="p-8 text-center text-sm text-slate-500">
            No clients found.
          </div>
        )}
      </CardContent>
    </Card>
  );
}
