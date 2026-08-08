'use client';

import { useState, useEffect, useRef } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { 
  Send, Plus, Sparkles, Bot, User, ChevronRight, 
  Loader2, BarChart3, Package, TruckIcon, Users, 
  AlertTriangle, Star, Copy, RefreshCw, Zap
} from 'lucide-react';
import { format } from 'date-fns';

interface AiSession { id: string; title: string; createdAt: string; updatedAt: string; }
interface AiMessage { id: string; role: 'USER' | 'ASSISTANT'; content: string; createdAt: string; }
interface DailyBrief { metrics: { activeLoads: number; tripsToday: number; overdueInvoices: number; activeAlerts: number; newCustomers: number }; summary: string; recommendations: string[]; }

const SUGGESTED_PROMPTS = [
  { icon: BarChart3, text: "Summarize today's operations" },
  { icon: Package, text: "Which loads are delayed or at risk?" },
  { icon: TruckIcon, text: "Show me fleet utilization this week" },
  { icon: Users, text: "Which customers have overdue invoices?" },
  { icon: AlertTriangle, text: "Are there any active alerts I should know about?" },
  { icon: Star, text: "What should I prioritize today?" },
];

function MessageContent({ content }: { content: string }) {
  const parts = content.split(/(\*\*[^*]+\*\*)/g);
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {parts.map((part, i) =>
        part.startsWith('**') && part.endsWith('**')
          ? <strong key={i} className="font-semibold">{part.slice(2, -2)}</strong>
          : <span key={i}>{part}</span>
      )}
    </div>
  );
}

export default function AiCopilotPage() {
  const [sessions, setSessions] = useState<AiSession[]>([]);
  const [activeSession, setActiveSession] = useState<AiSession | null>(null);
  const [messages, setMessages] = useState<AiMessage[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [dailyBrief, setDailyBrief] = useState<DailyBrief | null>(null);
  const [briefLoading, setBriefLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchSessions = async () => {
    try {
      const res = await api.get('/ai/copilot/sessions');
      setSessions(res.data);
    } catch (e) { console.error(e); }
  };

  const fetchDailyBrief = async () => {
    try {
      const res = await api.get('/ai/copilot/daily-brief');
      setDailyBrief(res.data);
    } catch (e) { console.error(e); }
    finally { setBriefLoading(false); }
  };

  useEffect(() => {
    fetchSessions();
    fetchDailyBrief();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const createSession = async (initialMessage?: string) => {
    try {
      const res = await api.post('/ai/copilot/sessions', { title: initialMessage?.substring(0, 60) || 'New Conversation' });
      const session = res.data;
      setSessions(prev => [session, ...prev]);
      setActiveSession(session);
      setMessages([]);
      if (initialMessage) {
        await sendMessage(session.id, initialMessage);
      }
    } catch (e) { console.error(e); }
  };

  const loadSession = async (session: AiSession) => {
    setActiveSession(session);
    setLoadingMessages(true);
    try {
      const res = await api.get(`/ai/copilot/sessions/${session.id}/messages`);
      setMessages(res.data);
    } catch (e) { console.error(e); }
    finally { setLoadingMessages(false); }
  };

  const sendMessage = async (sessionId: string, text: string) => {
    if (!text.trim()) return;
    const userMsg: AiMessage = { id: Date.now().toString(), role: 'USER', content: text, createdAt: new Date().toISOString() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setSending(true);
    try {
      const res = await api.post(`/ai/copilot/sessions/${sessionId}/chat`, { message: text });
      setMessages(prev => [...prev, res.data]);
      await fetchSessions();
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now().toString(), role: 'ASSISTANT', content: 'I encountered an error. Please try again.', createdAt: new Date().toISOString() }]);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    if (!activeSession) {
      await createSession(input);
    } else {
      await sendMessage(activeSession.id, input);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden rounded-xl border border-slate-200/60 dark:border-slate-800/60 glass elevation-2 bg-white/50 dark:bg-slate-900/30 backdrop-blur-md">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 border-r border-slate-200/60 dark:border-slate-800/60 flex flex-col bg-white/30 dark:bg-slate-900/30">
        <div className="p-4 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-white" />
            </div>
            <div>
              <h1 className="text-sm font-bold text-slate-900 dark:text-slate-100">LogOS Copilot</h1>
              <p className="text-[10px] text-slate-400">Powered by Gemini</p>
            </div>
          </div>
          <Button onClick={() => createSession()} size="sm" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white text-xs h-8">
            <Plus className="h-3 w-3 mr-1.5" /> New Conversation
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-2 space-y-1">
          {sessions.length === 0 && (
            <p className="text-xs text-slate-400 text-center py-4">No conversations yet</p>
          )}
          {sessions.map(session => (
            <button
              key={session.id}
              onClick={() => loadSession(session)}
              className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors truncate ${
                activeSession?.id === session.id
                  ? 'glass elevation-1 bg-indigo-50/80 dark:bg-indigo-900/40 text-indigo-700 dark:text-indigo-400 border border-indigo-100/50 dark:border-indigo-800/50'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100/50 dark:hover:bg-slate-800/50 hover:elevation-1 border border-transparent'
              }`}
            >
              <div className="font-medium truncate">{session.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">{format(new Date(session.updatedAt), 'MMM d, h:mm a')}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {!activeSession ? (
          /* Welcome Screen */
          <div className="flex-1 flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="h-16 w-16 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mb-6 shadow-xl shadow-indigo-500/20">
              <Sparkles className="h-8 w-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">LogOS Copilot</h2>
            <p className="text-slate-500 text-center max-w-md mb-8">Your enterprise AI assistant with full access to your operations, fleet, finance, and customer data.</p>

            {/* Daily Brief */}
            {!briefLoading && dailyBrief && (
              <div className="w-full max-w-2xl bg-gradient-to-br from-indigo-50 to-violet-50 dark:from-indigo-950/30 dark:to-violet-950/30 rounded-xl p-5 mb-8 border border-indigo-100 dark:border-indigo-900/50">
                <div className="flex items-center gap-2 mb-3">
                  <Zap className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
                  <span className="text-sm font-semibold text-indigo-700 dark:text-indigo-300">Today&apos;s Operational Brief</span>
                </div>
                <p className="text-sm text-slate-700 dark:text-slate-300 mb-3">{dailyBrief.summary}</p>
                <div className="grid grid-cols-5 gap-3">
                  {[
                    { label: 'Active Loads', value: dailyBrief.metrics.activeLoads, color: 'text-indigo-600' },
                    { label: 'Trips Today', value: dailyBrief.metrics.tripsToday, color: 'text-emerald-600' },
                    { label: 'Overdue Invoices', value: dailyBrief.metrics.overdueInvoices, color: 'text-red-600' },
                    { label: 'Active Alerts', value: dailyBrief.metrics.activeAlerts, color: 'text-amber-600' },
                    { label: 'New Customers', value: dailyBrief.metrics.newCustomers, color: 'text-violet-600' },
                  ].map(({ label, value, color }) => (
                    <div key={label} className="text-center">
                      <div className={`text-2xl font-bold ${color}`}>{value}</div>
                      <div className="text-[10px] text-slate-500 leading-tight">{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Suggested prompts */}
            <div className="w-full max-w-2xl grid grid-cols-2 gap-2">
              {SUGGESTED_PROMPTS.map(({ icon: Icon, text }) => (
                <button
                  key={text}
                  onClick={() => createSession(text)}
                  className="flex items-center gap-2.5 p-3 text-left text-xs bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-lg hover:border-indigo-300 dark:hover:border-indigo-700 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/30 transition-colors group"
                >
                  <Icon className="h-4 w-4 text-slate-400 group-hover:text-indigo-500 flex-shrink-0 transition-colors" />
                  <span className="text-slate-600 dark:text-slate-400">{text}</span>
                  <ChevronRight className="h-3 w-3 text-slate-300 group-hover:text-indigo-400 ml-auto flex-shrink-0" />
                </button>
              ))}
            </div>
          </div>
        ) : (
          /* Active Chat */
          <div className="flex flex-col flex-1 overflow-hidden">
            {/* Chat Header */}
            <div className="px-6 py-3 border-b border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Bot className="h-4 w-4 text-indigo-600" />
                <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate max-w-xs">{activeSession.title}</h2>
              </div>
              <Button variant="ghost" size="sm" onClick={fetchDailyBrief} className="h-7 text-xs gap-1.5">
                <RefreshCw className="h-3 w-3" /> Refresh Brief
              </Button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {loadingMessages && <div className="flex justify-center"><Loader2 className="h-5 w-5 animate-spin text-indigo-500" /></div>}
              {messages.map(msg => (
                <div key={msg.id} className={`flex gap-3 ${msg.role === 'USER' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`h-7 w-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                    msg.role === 'USER' ? 'bg-indigo-600' : 'bg-gradient-to-br from-indigo-500 to-violet-600'
                  }`}>
                    {msg.role === 'USER' ? <User className="h-3.5 w-3.5 text-white" /> : <Sparkles className="h-3.5 w-3.5 text-white" />}
                  </div>
                  <div className={`max-w-[75%] rounded-2xl px-4 py-3 ${
                    msg.role === 'USER'
                      ? 'bg-indigo-600 text-white rounded-tr-sm'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-tl-sm'
                  }`}>
                    <MessageContent content={msg.content} />
                    <div className={`text-[10px] mt-1.5 ${msg.role === 'USER' ? 'text-indigo-200' : 'text-slate-400'}`}>
                      {format(new Date(msg.createdAt), 'h:mm a')}
                    </div>
                  </div>
                </div>
              ))}
              {sending && (
                <div className="flex gap-3">
                  <div className="h-7 w-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-3.5 w-3.5 text-white" />
                  </div>
                  <div className="bg-slate-100 dark:bg-slate-800 rounded-2xl rounded-tl-sm px-4 py-3">
                    <div className="flex gap-1">
                      <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <div className="h-2 w-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 border-t border-slate-200/60 dark:border-slate-800/60 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm">
              <div className="flex gap-3 items-end bg-slate-50/50 dark:bg-slate-900/50 border border-slate-200/60 dark:border-slate-800/60 rounded-xl p-3 focus-within:border-indigo-400 focus-within:elevation-1 transition-all">
                <textarea
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Ask anything about your operations..."
                  rows={1}
                  className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 resize-none outline-none placeholder:text-slate-400"
                  style={{ minHeight: '24px', maxHeight: '120px' }}
                />
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  size="sm"
                  className="h-8 w-8 p-0 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg flex-shrink-0"
                >
                  {sending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Send className="h-3.5 w-3.5" />}
                </Button>
              </div>
              <p className="text-[10px] text-center text-slate-400 mt-2">LogOS AI has access to your real-time company data</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
