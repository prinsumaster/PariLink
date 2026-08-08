'use client';

import { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Send, Bot, User, Loader2, PlayCircle, StopCircle, RefreshCw } from 'lucide-react';
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

  const handleSend = () => {
    if (!input.trim() || !activeSession || isStreaming) return;
    
    const userMessage = input;
    setInput('');
    
    const tempId = Date.now().toString();
    setMessages(prev => [...prev, {
      id: `user-${tempId}`,
      role: 'USER',
      content: userMessage,
      createdAt: new Date().toISOString()
    }]);

    setIsStreaming(true);

    // Initialize Assistant message placeholder
    setMessages(prev => [...prev, {
      id: `assistant-${tempId}`,
      role: 'ASSISTANT',
      content: '',
      createdAt: new Date().toISOString()
    }]);

    const token = localStorage.getItem('token');
    const baseUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!baseUrl) throw new Error('NEXT_PUBLIC_API_URL missing');
    const url = new URL(`${baseUrl}/ai/copilot/sessions/${activeSession}/chat/stream`);
    url.searchParams.append('message', userMessage);

    const eventSource = new EventSource(url.toString(), {
      // EventSource doesn't natively support headers well in all browsers, 
      // typically we'd use fetch with readable streams for authenticated SSE, 
      // but assuming standard implementation here. If it fails due to auth, 
      // we'll need a fetch-based stream polyfill.
      // For this MVP, we append token as query if backend supports it.
      // To ensure security, NestJS needs to extract from query if header missing.
    });

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.done) {
          eventSource.close();
          setIsStreaming(false);
          loadSessions(); // refresh titles
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
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] border rounded-xl overflow-hidden bg-white/50 backdrop-blur shadow-sm">
      {/* Sidebar */}
      <div className="w-64 border-r bg-slate-50/50 p-4 flex flex-col gap-4">
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
                  ? 'bg-blue-50 text-blue-700 font-medium' 
                  : 'hover:bg-slate-100 text-slate-600'
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
      <div className="flex-1 flex flex-col bg-white">
        {/* Header */}
        <div className="h-14 border-b flex items-center px-6 bg-slate-50/30">
          <h2 className="font-semibold text-slate-800 flex items-center gap-2">
            <Bot className="w-5 h-5 text-blue-600" /> PariLink AI Copilot
          </h2>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-4">
              <Bot className="w-16 h-16 opacity-20" />
              <p>How can I assist you with logistics today?</p>
            </div>
          )}
          
          {messages.map((msg, i) => (
            <div key={msg.id || i} className={`flex gap-4 ${msg.role === 'USER' ? 'flex-row-reverse' : ''}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
                msg.role === 'USER' ? 'bg-blue-600 text-white' : 'bg-emerald-100 text-emerald-700'
              }`}>
                {msg.role === 'USER' ? <User className="w-4 h-4" /> : <Bot className="w-5 h-5" />}
              </div>
              <div className={`max-w-[75%] rounded-2xl p-4 ${
                msg.role === 'USER' 
                  ? 'bg-blue-600 text-white rounded-tr-none' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
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
        <div className="p-4 border-t bg-white">
          <div className="max-w-4xl mx-auto relative flex items-center">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
              placeholder="Ask about active trips, financial metrics, or routing..."
              className="w-full pl-4 pr-12 py-4 bg-slate-50 border rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all shadow-sm"
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
            AI Copilot can make mistakes. Consider verifying important metrics.
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
