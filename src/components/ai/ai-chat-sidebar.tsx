'use client';

import { useChat } from '@ai-sdk/react';
import { KeyboardEvent, useState } from 'react';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { useAiChatContext } from './ai-chat-context';

export function AiChatSidebar() {
  const { tasks } = useAiChatContext();
  const [input, setInput] = useState('');
  
  const { messages, sendMessage, status, error } = useChat({
    id: 'ai-chat',
    onError: (error) => {
      console.error('Chat error:', error);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && status !== 'streaming') {
      sendMessage(
        { text: input.trim() },
        {
          body: {
            tasks,
          },
        }
      );
      setInput('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim() && status !== 'streaming') {
        handleSubmit(e);
      }
    }
  };

  const formatTimestamp = (date: Date) => {
    return date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div
      className={cn(
        'flex flex-col gap-2 h-full',
        'rounded-sm',
        'bg-background',
      )}>
      {/* Chat Messages */}
      <ScrollArea className="h-0 flex-1 px-2">
        <div className="space-y-4 py-2">
          {messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.role === 'user' && 'flex-row-reverse',
              )}>
              <div
                className={cn(
                  'flex flex-col gap-1 max-w-[80%]',
                  message.role === 'user' && 'items-end',
                )}>
                <div
                  className={cn(
                    'text-sm px-3 py-2 rounded-lg',
                    message.role === 'user' 
                      ? 'bg-primary text-primary-foreground' 
                      : 'bg-muted',
                  )}>
                  <div className="whitespace-pre-wrap">
                    {message.parts?.map((part, index) => {
                       if (part.type === 'text') {
                         return <span key={index}>{part.text}</span>;
                       }
                       return null;
                     })
                    }
                  </div>
                </div>
                <div className="text-xs text-muted-foreground px-1">
                  {formatTimestamp(new Date())}
                </div>
              </div>
            </div>
          ))}
          {status === 'streaming' && (
            <div className="flex gap-3">
              <div className="flex flex-col gap-1 max-w-[80%]">
                <div className="text-sm px-3 py-2 rounded-lg bg-muted">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" 
                         style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" 
                         style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" 
                         style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            </div>
          )}
          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
              Error: {error.message}
            </div>
          )}
        </div>
      </ScrollArea>
      {/* Input Area */}
      <div className={cn('flex flex-col gap-2 p-2')}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask me anything about your tasks..."
            className="resize-none min-h-[60px] max-h-[120px] flex-1"
            disabled={status === 'streaming'}
          />
          <Button 
            type="submit" 
            disabled={!input.trim() || status === 'streaming'}
            size="sm"
            className="self-end">
            Send
          </Button>
        </form>
        <div className="text-xs text-muted-foreground px-1">
          Press Enter to send, Shift+Enter for new line
        </div>
      </div>
    </div>
  );
}