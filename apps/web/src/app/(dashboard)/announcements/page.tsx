'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Megaphone, Calendar, Users, Eye } from 'lucide-react';

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<any[]>([]);

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements');
      setAnnouncements(res.data);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-indigo-600 rounded-2xl p-8 text-white shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <h1 className="text-3xl font-bold mb-2 flex items-center gap-3">
            <Megaphone className="h-8 w-8" /> Company Announcements
          </h1>
          <p className="text-indigo-100">Stay up to date with the latest company news, policy updates, and broadcast messages from leadership.</p>
        </div>
        <div className="absolute right-0 top-0 opacity-10 pointer-events-none">
          <Megaphone className="h-64 w-64 -mt-10 -mr-10" />
        </div>
      </div>

      <div className="grid gap-6 mt-8">
        {announcements.length === 0 ? (
          <div className="text-center p-12 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800">
            <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">No active announcements</h3>
          </div>
        ) : (
          announcements.map(ann => (
            <Card key={ann.id} className="overflow-hidden border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow bg-white dark:bg-slate-950">
              <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-1 text-xs font-semibold rounded-md ${
                    ann.priority === 'HIGH' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                    'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
                  }`}>
                    {ann.priority}
                  </span>
                  <span className="text-xs text-slate-500 flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> {new Date(ann.createdAt).toLocaleDateString()}
                  </span>
                </div>
                {ann.requireAck && (
                  <Button size="sm" variant="outline" className="h-7 text-xs font-semibold text-indigo-600 border-indigo-200 hover:bg-indigo-50">
                    Acknowledge
                  </Button>
                )}
              </div>
              <div className="p-6">
                <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-4">{ann.title}</h2>
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-300">
                  {ann.content}
                </div>
              </div>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
