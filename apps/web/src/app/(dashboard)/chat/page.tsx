'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { api } from '@/services/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Hash, Plus, Send, Smile, Paperclip, 
  MessageSquare, ChevronDown, Check, X,
  Loader2, Search, AtSign, Circle
} from 'lucide-react';
import { format, isToday, isYesterday } from 'date-fns';
import { useAuthStore } from '@/store/auth';

interface Channel { id: string; name: string; description?: string; type: string; isMember: boolean; _count: { messages: number }; }
interface Message { id: string; content: string; createdAt: string; editedAt?: string; deletedAt?: string; sender: { id: string; firstName: string; lastName: string; avatar?: string }; reactions: { emoji: string; user: { id: string; firstName: string } }[]; }

const EMOJI_QUICK = ['👍', '❤️', '😂', '🎉', '🚀', '💯', '✅', '🔥'];

function dateLabel(dateStr: string) {
  const d = new Date(dateStr);
  if (isToday(d)) return 'Today';
  if (isYesterday(d)) return 'Yesterday';
  return format(d, 'MMMM d, yyyy');
}

function groupMessages(messages: Message[]) {
  const groups: { date: string; messages: Message[] }[] = [];
  messages.forEach(msg => {
    const label = dateLabel(msg.createdAt);
    const last = groups[groups.length - 1];
    if (last && last.date === label) last.messages.push(msg);
    else groups.push({ date: label, messages: [msg] });
  });
  return groups;
}

export default function ChatPage() {
  const [channels, setChannels] = useState<Channel[]>([]);
  const [activeChannel, setActiveChannel] = useState<Channel | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newChannelName, setNewChannelName] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollRef = useRef<NodeJS.Timeout | null>(null);
  const currentUser = useAuthStore(s => s.user);

  useEffect(() => {
    fetchChannels();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  useEffect(() => {
    if (activeChannel) {
      loadMessages(activeChannel.id, false);
      // Poll every 3 seconds
      pollRef.current = setInterval(() => loadMessages(activeChannel.id, true), 3000);
    }
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [activeChannel?.id]);

  async function fetchChannels() {
    try {
      const res = await api.get('/chat/channels');
      setChannels(res.data);
      if (res.data.length > 0 && !activeChannel) setActiveChannel(res.data[0]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  async function loadMessages(channelId: string, silent = false) {
    if (!silent) setLoadingMessages(true);
    try {
      const res = await api.get(`/chat/channels/${channelId}/messages`, { params: { limit: 100 } });
      setMessages(res.data);
    } catch (e) { console.error(e); }
    finally { if (!silent) setLoadingMessages(false); }
  };

  const handleSend = async () => {
    if (!input.trim() || !activeChannel) return;
    const text = input;
    setInput('');
    setSending(true);
    try {
      await api.post(`/chat/channels/${activeChannel.id}/messages`, { content: text });
      await loadMessages(activeChannel.id, true);
    } catch (e) { setInput(text); }
    finally { setSending(false); }
  };

  const handleReaction = async (messageId: string, emoji: string) => {
    try {
      await api.post(`/chat/messages/${messageId}/reactions`, { emoji });
      await loadMessages(activeChannel!.id, true);
    } catch (e) { console.error(e); }
  };

  const createChannel = async () => {
    if (!newChannelName.trim()) return;
    try {
      const res = await api.post('/chat/channels', { name: newChannelName.toLowerCase().replace(/\s+/g, '-'), type: 'CHANNEL' });
      setChannels(prev => [...prev, res.data]);
      setActiveChannel(res.data);
      setNewChannelName('');
      setShowNewChannel(false);
    } catch (e) { console.error(e); }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const publicChannels = channels.filter(c => c.type === 'CHANNEL');
  const dmChannels = channels.filter(c => c.type === 'DIRECT');
  const groups = groupMessages(messages);

  return (
    <div className="flex h-[calc(100vh-5rem)] overflow-hidden rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
      {/* Sidebar */}
      <div className="w-64 flex-shrink-0 bg-slate-900 dark:bg-slate-950 flex flex-col">
        {/* Workspace Header */}
        <div className="px-4 py-4 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-sm font-bold text-white">Workspace</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Circle className="h-2 w-2 text-emerald-400 fill-emerald-400" />
                <span className="text-[10px] text-slate-400">{currentUser?.firstName} {currentUser?.lastName}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto py-3">
          {/* Channels */}
          <div className="px-3 mb-2">
            <div className="flex items-center justify-between mb-1">
              <button className="flex items-center gap-1 text-[11px] font-semibold text-slate-400 uppercase tracking-wide hover:text-slate-200">
                <ChevronDown className="h-3 w-3" /> Channels
              </button>
              <button onClick={() => setShowNewChannel(!showNewChannel)} className="text-slate-500 hover:text-slate-200">
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>

            {showNewChannel && (
              <div className="mb-2 bg-slate-800 rounded-lg p-2">
                <input
                  autoFocus
                  value={newChannelName}
                  onChange={e => setNewChannelName(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && createChannel()}
                  placeholder="channel-name"
                  className="w-full text-xs bg-transparent text-slate-200 outline-none placeholder:text-slate-500"
                />
                <div className="flex gap-1 mt-2">
                  <button onClick={createChannel} className="flex-1 text-[10px] bg-indigo-600 text-white rounded px-2 py-1 flex items-center justify-center gap-1"><Check className="h-2.5 w-2.5" />Create</button>
                  <button onClick={() => setShowNewChannel(false)} className="flex-1 text-[10px] bg-slate-700 text-slate-300 rounded px-2 py-1 flex items-center justify-center"><X className="h-2.5 w-2.5" /></button>
                </div>
              </div>
            )}

            {publicChannels.map(ch => (
              <button
                key={ch.id}
                onClick={() => setActiveChannel(ch)}
                className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[13px] transition-colors ${
                  activeChannel?.id === ch.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                }`}
              >
                <Hash className="h-3.5 w-3.5 flex-shrink-0" />
                <span className="truncate">{ch.name}</span>
              </button>
            ))}
          </div>

          {/* DMs */}
          {dmChannels.length > 0 && (
            <div className="px-3">
              <div className="flex items-center gap-1 mb-1">
                <ChevronDown className="h-3 w-3 text-slate-400" />
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wide">Direct Messages</span>
              </div>
              {dmChannels.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => setActiveChannel(ch)}
                  className={`w-full flex items-center gap-2 px-2 py-1 rounded text-[13px] transition-colors ${
                    activeChannel?.id === ch.id ? 'bg-indigo-600 text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                  }`}
                >
                  <AtSign className="h-3.5 w-3.5 flex-shrink-0" />
                  <span className="truncate">{ch.name || 'DM'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Main */}
      {!activeChannel ? (
        <div className="flex-1 flex items-center justify-center">
          {loading ? <Loader2 className="h-6 w-6 animate-spin text-slate-400" /> : (
            <div className="text-center">
              <MessageSquare className="h-12 w-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 text-sm">Select a channel to start messaging</p>
              <Button onClick={() => setShowNewChannel(true)} className="mt-4 text-xs h-8" variant="outline">
                <Plus className="h-3.5 w-3.5 mr-1.5" /> Create First Channel
              </Button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Channel Header */}
          <div className="px-6 py-3 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3">
            <Hash className="h-5 w-5 text-slate-400" />
            <div>
              <h2 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{activeChannel.name}</h2>
              {activeChannel.description && <p className="text-[10px] text-slate-400">{activeChannel.description}</p>}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {loadingMessages ? (
              <div className="flex justify-center py-8"><Loader2 className="h-5 w-5 animate-spin text-slate-400" /></div>
            ) : groups.length === 0 ? (
              <div className="text-center py-12">
                <Hash className="h-10 w-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
                <p className="text-slate-500 text-sm font-medium">Welcome to #{activeChannel.name}!</p>
                <p className="text-slate-400 text-xs mt-1">This is the very beginning of this channel. Say hello!</p>
              </div>
            ) : groups.map(group => (
              <div key={group.date}>
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                  <span className="text-[11px] font-medium text-slate-400 bg-white dark:bg-slate-950 px-2">{group.date}</span>
                  <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800" />
                </div>
                <div className="space-y-1">
                  {group.messages.map((msg, i) => {
                    const isMine = msg.sender.id === currentUser?.id;
                    const showSender = i === 0 || group.messages[i - 1].sender.id !== msg.sender.id;
                    return (
                      <div key={msg.id} className={`group flex gap-3 rounded-lg px-3 py-1 -mx-3 hover:bg-slate-50 dark:hover:bg-slate-900/50 ${showSender ? 'mt-4' : ''}`}>
                        {showSender ? (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 flex items-center justify-center flex-shrink-0 text-white text-xs font-semibold">
                            {msg.sender.firstName[0]}{msg.sender.lastName[0]}
                          </div>
                        ) : <div className="w-8 flex-shrink-0" />}
                        <div className="flex-1 min-w-0">
                          {showSender && (
                            <div className="flex items-baseline gap-2 mb-0.5">
                              <span className={`text-sm font-semibold ${isMine ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-900 dark:text-slate-100'}`}>
                                {msg.sender.firstName} {msg.sender.lastName} {isMine && '(you)'}
                              </span>
                              <span className="text-[10px] text-slate-400">{format(new Date(msg.createdAt), 'h:mm a')}</span>
                            </div>
                          )}
                          <p className={`text-sm leading-relaxed ${msg.deletedAt ? 'italic text-slate-400' : 'text-slate-700 dark:text-slate-300'}`}>{msg.content}</p>
                          {msg.editedAt && !msg.deletedAt && <span className="text-[10px] text-slate-400">(edited)</span>}
                          {/* Reactions */}
                          {msg.reactions.length > 0 && (
                            <div className="flex gap-1 flex-wrap mt-1">
                              {Object.entries(
                                msg.reactions.reduce((acc, r) => { acc[r.emoji] = (acc[r.emoji] || 0) + 1; return acc; }, {} as Record<string, number>)
                              ).map(([emoji, count]) => (
                                <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="flex items-center gap-1 text-[11px] bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full px-2 py-0.5 transition-colors">
                                  {emoji} <span className="text-slate-500">{count}</span>
                                </button>
                              ))}
                            </div>
                          )}
                          {/* Quick reactions on hover */}
                          <div className="hidden group-hover:flex items-center gap-1 mt-1">
                            {EMOJI_QUICK.map(emoji => (
                              <button key={emoji} onClick={() => handleReaction(msg.id, emoji)} className="text-sm hover:scale-125 transition-transform">
                                {emoji}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-slate-200 dark:border-slate-800">
            <div className="flex items-end gap-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-4 py-3 focus-within:border-indigo-400 transition-colors">
              <textarea
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={`Message #${activeChannel.name}`}
                rows={1}
                className="flex-1 bg-transparent text-sm text-slate-900 dark:text-slate-100 resize-none outline-none placeholder:text-slate-400"
                style={{ minHeight: '24px', maxHeight: '120px' }}
              />
              <div className="flex items-center gap-2 flex-shrink-0">
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <Paperclip className="h-4 w-4" />
                </button>
                <button className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300">
                  <Smile className="h-4 w-4" />
                </button>
                <Button
                  onClick={handleSend}
                  disabled={!input.trim() || sending}
                  size="sm"
                  className="h-7 w-7 p-0 bg-indigo-600 hover:bg-indigo-700 rounded-lg"
                >
                  {sending ? <Loader2 className="h-3 w-3 animate-spin" /> : <Send className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
