'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BellRing, Mail, Smartphone, MessageCircle, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function NotificationPreferencesPage() {
  const [prefs, setPrefs] = useState<any>({
    channels: { email: true, inApp: true, sms: false, slack: false },
    quietHoursStart: '22:00',
    quietHoursEnd: '08:00'
  });

  useEffect(() => {
    const fetchPrefs = async () => {
      try {
        const res = await api.get('/preferences/notifications');
        setPrefs(res.data);
      } catch (e) {
        console.error(e);
      }
    };

    fetchPrefs();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/preferences/notifications', prefs);
      toast.success('Preferences saved successfully');
    } catch (e) {
      toast.error('Failed to save preferences');
    }
  };

  const toggleChannel = (channel: string) => {
    setPrefs({ ...prefs, channels: { ...prefs.channels, [channel]: !prefs.channels[channel] } });
  };

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Notification Preferences</h1>
        <p className="text-sm text-slate-500 mt-1">Control how and when you receive alerts from PariLink.</p>
      </div>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Delivery Channels</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-indigo-100 dark:bg-indigo-900 rounded-md text-indigo-600 dark:text-indigo-400">
                <BellRing className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">In-App Notifications</p>
                <p className="text-xs text-slate-500">Receive alerts directly within the platform.</p>
              </div>
            </div>
            <Switch checked={prefs.channels?.inApp} onCheckedChange={() => toggleChannel('inApp')} />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-200 dark:bg-slate-800 rounded-md text-slate-600 dark:text-slate-400">
                <Mail className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Email Notifications</p>
                <p className="text-xs text-slate-500">Send high priority alerts to your inbox.</p>
              </div>
            </div>
            <Switch checked={prefs.channels?.email} onCheckedChange={() => toggleChannel('email')} />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 dark:bg-green-900 rounded-md text-green-600 dark:text-green-400">
                <Smartphone className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">SMS / Text Message</p>
                <p className="text-xs text-slate-500">For urgent operational anomalies (e.g. Truck Breakdown).</p>
              </div>
            </div>
            <Switch checked={prefs.channels?.sms} onCheckedChange={() => toggleChannel('sms')} />
          </div>

          <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-900 rounded-md text-purple-600 dark:text-purple-400">
                <MessageCircle className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-slate-900 dark:text-slate-100">Slack</p>
                <p className="text-xs text-slate-500">Route notifications to your Slack workspace.</p>
              </div>
            </div>
            <Switch checked={prefs.channels?.slack} onCheckedChange={() => toggleChannel('slack')} />
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 text-slate-900 dark:text-slate-100">Quiet Hours</h3>
        <p className="text-sm text-slate-500 mb-6">Mute non-urgent notifications during these hours.</p>
        
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Start Time</Label>
            <Input 
              type="time" 
              value={prefs.quietHoursStart || ''} 
              onChange={e => setPrefs({...prefs, quietHoursStart: e.target.value})} 
            />
          </div>
          <div className="space-y-2">
            <Label>End Time</Label>
            <Input 
              type="time" 
              value={prefs.quietHoursEnd || ''} 
              onChange={e => setPrefs({...prefs, quietHoursEnd: e.target.value})} 
            />
          </div>
        </div>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-2">
          <Save className="h-4 w-4" /> Save Preferences
        </Button>
      </div>
    </div>
  );
}
