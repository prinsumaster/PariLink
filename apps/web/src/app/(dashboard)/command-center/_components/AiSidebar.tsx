"use client";
import React, { useState } from 'react';
import { Send, Bot, User, Sparkles, BrainCircuit, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { AiInsights } from './AiInsights';
import { cn } from '@/lib/utils';

type SidebarTab = 'copilot' | 'insights';

export const AiSidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<SidebarTab>('insights');
  const [messages, setMessages] = useState([
    { id: 1, sender: 'AI', text: 'Good morning. I am your Operations Copilot. Fleet utilization is at 92%. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { id: Date.now(), sender: 'USER', text: input }]);
    setInput('');
    
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, { 
        id: Date.now() + 1, 
        sender: 'AI', 
        text: 'I have analyzed the current routing constraints. I recommend reassigning Driver D-201 to Trip T-102 to avoid HOS violations. Should I initiate the BPM approval process for this change?' 
      }]);
    }, 1200);
  };

  return (
    <div className="flex flex-col h-full bg-slate-900 border-l border-slate-800">
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Bot className="h-5 w-5 text-indigo-400" />
          <h2 className="font-bold text-white tracking-tight">AI Operations</h2>
        </div>
        <Sparkles className="h-4 w-4 text-amber-400" />
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-800">
        <button
          onClick={() => setActiveTab('insights')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors border-b-2",
            activeTab === 'insights' ? "border-indigo-500 text-indigo-400 bg-slate-800/50" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
          )}
        >
          <BrainCircuit className="h-4 w-4" />
          Live Insights
        </button>
        <button
          onClick={() => setActiveTab('copilot')}
          className={cn(
            "flex-1 flex items-center justify-center gap-2 py-2.5 text-xs font-medium transition-colors border-b-2",
            activeTab === 'copilot' ? "border-indigo-500 text-indigo-400 bg-slate-800/50" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
          )}
        >
          <MessageSquare className="h-4 w-4" />
          Copilot
        </button>
      </div>
      
      {activeTab === 'copilot' ? (
        <div className="flex flex-col flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-3 max-w-[90%] ${msg.sender === 'USER' ? 'ml-auto flex-row-reverse' : ''}`}>
                <div className={`h-8 w-8 rounded-full flex items-center justify-center shrink-0 ${msg.sender === 'USER' ? 'bg-blue-600' : 'bg-indigo-600'}`}>
                  {msg.sender === 'USER' ? <User className="h-4 w-4 text-white" /> : <Bot className="h-4 w-4 text-white" />}
                </div>
                <div className={`p-3 rounded-2xl text-sm ${msg.sender === 'USER' ? 'bg-blue-600 text-white rounded-tr-sm' : 'bg-slate-800 text-slate-200 rounded-tl-sm border border-slate-700'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          
          <div className="p-4 border-t border-slate-800 bg-slate-900/90">
            <form onSubmit={handleSend} className="relative">
              <Input 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask Copilot..." 
                className="w-full bg-slate-950 border-slate-700 text-slate-200 placeholder:text-slate-500 pr-10 focus-visible:ring-indigo-500 rounded-full h-10"
              />
              <Button type="submit" size="icon" variant="ghost" className="absolute right-1 top-1 h-8 w-8 text-indigo-400 hover:text-indigo-300 hover:bg-slate-800 rounded-full">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </div>
      ) : (
        <AiInsights />
      )}
    </div>
  );
};
