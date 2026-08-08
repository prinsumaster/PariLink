import * as React from 'react';
import { cn } from '@/lib/utils';
import { Send, Loader2, Sparkles, User, Bot } from 'lucide-react';
import { Button } from './button';
import { Avatar, AvatarFallback, AvatarImage } from './avatar';
import { Textarea } from './textarea';

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  createdAt: Date;
}

interface ChatBubbleProps extends React.HTMLAttributes<HTMLDivElement> {
  message: ChatMessage;
  isTyping?: boolean;
}

export function ChatBubble({ message, isTyping, className, ...props }: ChatBubbleProps) {
  const isUser = message.role === 'user';
  
  return (
    <div
      className={cn(
        'flex w-full gap-4 py-4',
        isUser ? 'justify-end' : 'justify-start',
        className
      )}
      {...props}
    >
      {!isUser && (
        <Avatar className="h-8 w-8 shrink-0 bg-primary/10 text-primary border border-primary/20">
          <AvatarFallback><Bot className="h-4 w-4" /></AvatarFallback>
        </Avatar>
      )}
      <div
        className={cn(
          'flex flex-col gap-1 max-w-[80%]',
          isUser ? 'items-end' : 'items-start'
        )}
      >
        <div
          className={cn(
            'px-4 py-3 rounded-2xl text-sm whitespace-pre-wrap shadow-sm',
            isUser 
              ? 'bg-primary text-primary-foreground rounded-tr-sm' 
              : 'bg-card text-card-foreground border border-border rounded-tl-sm'
          )}
        >
          {isTyping ? (
            <div className="flex gap-1 items-center h-5">
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]" />
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]" />
              <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" />
            </div>
          ) : (
            message.content
          )}
        </div>
        <span className="text-[10px] text-muted-foreground font-medium px-1">
          {message.createdAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      {isUser && (
        <Avatar className="h-8 w-8 shrink-0">
          <AvatarFallback><User className="h-4 w-4" /></AvatarFallback>
        </Avatar>
      )}
    </div>
  );
}

interface ChatInputProps extends React.FormHTMLAttributes<HTMLFormElement> {
  onSend: (message: string) => void;
  isLoading?: boolean;
}

export function ChatInput({ onSend, isLoading, className, ...props }: ChatInputProps) {
  const [input, setInput] = React.useState('');
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    onSend(input);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={cn('relative flex items-end gap-2 p-4 bg-background/50 backdrop-blur-md border-t border-border', className)}
      {...props}
    >
      <div className="relative flex-1 rounded-2xl border border-input bg-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 transition-shadow">
        <Textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Ask Copilot anything..."
          className="min-h-[52px] w-full resize-none bg-transparent px-4 py-3.5 text-sm focus-visible:ring-0 focus-visible:ring-offset-0 border-0 scrollbar-hide"
          rows={1}
        />
        <div className="absolute right-2 bottom-2">
          <Button
            type="submit"
            size="icon"
            disabled={!input.trim() || isLoading}
            className="h-9 w-9 rounded-xl transition-all"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            <span className="sr-only">Send message</span>
          </Button>
        </div>
      </div>
    </form>
  );
}
