'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { api } from '@/services/api';
import { format } from 'date-fns';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface ChatSession {
  id: string;
  title: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt: string;
  citations?: any[];
}

const SUGGESTION_CHIPS = [
  { label: '🚛 Active trips',         message: 'How many active trips are in progress?' },
  { label: '💰 Revenue this month',   message: 'Show revenue this month' },
  { label: '🚌 Fleet status',         message: 'How many trucks are available?' },
  { label: '📄 Pending invoices',     message: 'Who has pending payments outstanding?' },
  { label: '👤 Driver availability',  message: 'How many drivers are available?' },
  { label: '📊 Lane P&L',             message: 'Which lane is losing money?' },
];

export default function CopilotPage() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (activeSession) {
      loadMessages(activeSession);
    }
  }, [activeSession]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  async function loadSessions() {
    try {
      const res = await api.get('/ai/copilot/sessions');
      setSessions(res.data);
      if (res.data.length > 0 && !activeSession) {
        setActiveSession(res.data[0].id);
      }
    } catch (e) {
      console.error(e);
    }
  }

  async function loadMessages(sessionId: string) {
    try {
      const res = await api.get(`/ai/copilot/sessions/${sessionId}/messages`);
      setMessages(res.data);
    } catch (e) {
      console.error(e);
    }
  }

  async function startNewSession() {
    try {
      const res = await api.post('/ai/copilot/sessions');
      setSessions([res.data, ...sessions]);
      setActiveSession(res.data.id);
      setMessages([]);
    } catch (e) {
      console.error(e);
    }
  }

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || !activeSession || isStreaming) return;

    setInput('');

    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: `user-${tempId}`,
      role: 'USER',
      content: trimmed,
      createdAt: new Date().toISOString()
    }]);

    setIsStreaming(true);

    // Add empty assistant placeholder
    setMessages(prev => [...prev, {
      id: `assistant-${tempId}`,
      role: 'ASSISTANT',
      content: '',
      createdAt: new Date().toISOString()
    }]);

    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL;
      if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL missing');
      const url = new URL(`${baseUrl}/ai/copilot/sessions/${activeSession}/chat/stream`);
      url.searchParams.append('message', trimmed);

      const eventSource = new EventSource(url.toString());

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.done) {
            eventSource.close();
            setIsStreaming(false);
            loadSessions();
          } else if (data.chunk) {
            setMessages(prev => {
              const newMessages = [...prev];
              const last = newMessages[newMessages.length - 1];
              if (last.role === 'ASSISTANT') {
                last.content += data.chunk;
              }
              return newMessages;
            });
          }
        } catch (e) {
          console.error(e);
        }
      };

      eventSource.onerror = () => {
        eventSource.close();
        setIsStreaming(false);
      };
    } catch (e) {
      setIsStreaming(false);
    }
  };

  const handleSend = () => sendMessage(input);

  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-xl overflow-hidden bg-white/50 backdrop-blur shadow-sm dark:bg-gray-900/50 dark:border-gray-800">
      {/* Sidebar */}
      <div className="w-64 border-r bg-slate-50/50 dark:bg-gray-800/50 dark:border-gray-700 p-4 flex flex-col gap-4">
        <Button onClick={startNewSession} className="w-full gap-2">
          <PlusCircleIcon /> New Chat
        </Button>
        <div className="flex-1 overflow-y-auto space-y-2">
          {sessions.map(s => (
            <button
              key={s.id}
              onClick={() => setActiveSession(s.id)}
              className={`w-full text-left p-3 rounded-lg text-sm transition-colors ${
                activeSession === s.id
                  ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium'
                  : 'hover:bg-slate-100 dark:hover:bg-gray-700/50 text-slate-600 dark:text-slate-400'
              }`}
            >
              <div className="truncate">{s.title}</div>
              <div className="text-xs opacity-50 mt-1">
                {format(new Date(s.updatedAt), 'MMM d, h:mm a')}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
        {/* Header */}
        <div className="h-14 border-b dark:border-gray-800 flex items-center px-6 bg-slate-50/30 dark:bg-gray-800/30">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" /> PariLink AI Copilot
            <span className="text-xs font-normal px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 rounded-full ml-2">
              Live Data
            </span>
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-6">
              <div className="text-center space-y-2">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/30 dark:to-indigo-900/30 flex items-center justify-center mx-auto">
                  <Bot className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                </div>
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">How can I assist you?</p>
                <p className="text-sm text-slate-400">I have access to real-time operations, finance, and fleet data.</p>
              </div>

              {/* Suggestion Chips */}
              <div className="flex flex-wrap gap-2 justify-center max-w-lg">
                {SUGGESTION_CHIPS.map((chip) => (
                  <button
                    key={chip.message}
                    onClick={() => {
                      if (!activeSession) {
                        startNewSession().then(() => sendMessage(chip.message));
                      } else {
                        sendMessage(chip.message);
                      }
                    }}
                    disabled={isStreaming || !activeSession}
                    className="px-4 py-2 bg-slate-50 dark:bg-gray-800 hover:bg-blue-50 dark:hover:bg-blue-900/30 border border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700 rounded-full text-sm text-slate-600 dark:text-slate-300 hover:text-blue-700 dark:hover:text-blue-300 transition-all duration-150 font-medium shadow-sm hover:shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'USER' ? 'bg-blue-600 text-white' : 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-400'
              }`}>
                {msg.role === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'USER'
                  ? 'bg-blue-600 text-white rounded-tr-none'
                  : 'bg-slate-100 dark:bg-gray-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
              }`}>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {msg.content}
                  </ReactMarkdown>
                </div>
                {msg.role === 'ASSISTANT' && isStreaming && i === messages.length - 1 && (
                  <span className="inline-block w-2 h-4 bg-slate-400 animate-pulse ml-1 align-middle" />
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="p-4 border-t dark:border-gray-800 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about active trips, financial metrics, or routing..."
              className="w-full pl-4 pr-12 py-4 bg-slate-50 dark:bg-gray-800 border dark:border-gray-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400"
              disabled={isStreaming || !activeSession}
            />
            <Button
              size="icon"
              onClick={handleSend}
              disabled={!input.trim() || isStreaming || !activeSession}
              className="absolute right-2 rounded-full w-10 h-10"
            >
              {isStreaming ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            </Button>
          </div>
          <div className="text-center mt-2 text-xs text-slate-400">
            AI Copilot is grounded in real PariLink data — no hallucinations.
          </div>
        </div>
      </div>
    </div>
  );
}

function PlusCircleIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/><path d="M8 12h8"/><path d="M12 8v8"/>
    </svg>
  );
}
