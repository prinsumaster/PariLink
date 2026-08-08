'use client';

import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { MessageSquare, Send, Paperclip, MoreVertical, Search, CheckCheck } from 'lucide-react';
import { useAuthStore } from '@/store/auth';

export default function InboxPage() {
  const [threads, setThreads] = useState<any[]>([]);
  const [activeThread, setActiveThread] = useState<any>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const user = useAuthStore((state) => state.user);
  const currentUser = user || { id: '' };

  useEffect(() => {
    async function fetchThreads() {
      try {
        const res = await api.get('/inbox/threads');
        const data = res.data.data || res.data;
        setThreads(data);
        if (data.length > 0) {
          selectThread(data[0]);
        }
      } catch (e) {
        console.error(e);
      }
    };

    fetchThreads();
  }, []);

  async function selectThread(thread: any) {
    setActiveThread(thread);
    try {
      const res = await api.get(`/inbox/threads/${thread.id}/messages`);
      setMessages(res.data.data || res.data);
    } catch (e) {
      console.error(e);
      setMessages([]);
    }
  };

  const handleSend = async () => {
    if (!newMessage.trim() || !activeThread) return;
    try {
      const res = await api.post(`/inbox/threads/${activeThread.id}/messages`, { content: newMessage });
      const newMsg = res.data.data || res.data;
      setMessages([...messages, newMsg]);
      setNewMessage('');
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex overflow-hidden bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
      
      {/* Sidebar: Threads List */}
      <div className="w-80 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col">
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-indigo-600" /> Inbox
          </h2>
          <Button variant="ghost" size="icon"><MoreVertical className="h-4 w-4" /></Button>
        </div>
        <div className="p-2 border-b border-slate-200 dark:border-slate-800">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input placeholder="Search messages..." className="pl-8 bg-slate-50 dark:bg-slate-900 h-9" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {threads.map(thread => (
            <div 
              key={thread.id} 
              onClick={() => selectThread(thread)}
              className={`p-4 border-b border-slate-100 dark:border-slate-800 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors ${activeThread?.id === thread.id ? 'bg-indigo-50/50 dark:bg-indigo-900/20' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-semibold text-sm truncate">{thread.subject || 'Direct Message'}</span>
                <span className="text-xs text-slate-400">{new Date(thread.updatedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-xs text-slate-500 line-clamp-1">{thread.messages?.[0]?.content || 'Start a conversation'}</p>
            </div>
          ))}
          {threads.length === 0 && (
            <div className="p-8 text-center text-slate-500 text-sm">No messages found.</div>
          )}
        </div>
      </div>

      {/* Main Content: Chat View */}
      {activeThread ? (
        <div className="flex-1 flex flex-col bg-white dark:bg-slate-950 relative">
          <div className="h-14 border-b border-slate-200 dark:border-slate-800 flex items-center px-6 justify-between bg-white dark:bg-slate-950 z-10 shadow-sm">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100">{activeThread.subject || 'Direct Message'}</h3>
          </div>
          
          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-50/50 dark:bg-slate-900/20">
            {messages.map(msg => {
              const isMe = msg.senderId === currentUser.id;
              return (
                <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`max-w-[70%] px-4 py-2.5 rounded-2xl ${isMe ? 'bg-indigo-600 text-white rounded-br-sm' : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-bl-sm shadow-sm'}`}>
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <div className="flex items-center gap-1 mt-1 text-[10px] text-slate-400">
                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    {isMe && <CheckCheck className="h-3 w-3 text-emerald-500 ml-1" />}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-4 bg-white dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-center gap-2 max-w-4xl mx-auto">
              <Button variant="ghost" size="icon" className="text-slate-400 hover:text-slate-600">
                <Paperclip className="h-5 w-5" />
              </Button>
              <Input 
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a message..." 
                className="flex-1 bg-slate-50 dark:bg-slate-900"
              />
              <Button onClick={handleSend} size="icon" className="bg-indigo-600 hover:bg-indigo-700 text-white shrink-0">
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900">
          <MessageSquare className="h-12 w-12 text-slate-300 mb-4" />
          <h2 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Your Inbox</h2>
          <p className="text-sm text-slate-500">Select a thread to start messaging</p>
        </div>
      )}
    </div>
  );
}
