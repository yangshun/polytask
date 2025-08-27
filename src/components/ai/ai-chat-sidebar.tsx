'use client';

import { ScrollArea } from '~/components/ui/scroll-area';
import { Textarea } from '~/components/ui/textarea';
import { cn } from '~/lib/utils';

interface ChatMessage {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const mockMessages: ChatMessage[] = [
  {
    id: '1',
    type: 'assistant',
    content:
      "Hello! I'm your AI assistant. How can I help you manage your tasks today?",
    timestamp: '10:30 AM',
  },
  {
    id: '2',
    type: 'user',
    content: 'Can you help me prioritize my tasks for this week?',
    timestamp: '10:31 AM',
  },
  {
    id: '3',
    type: 'assistant',
    content:
      "Of course! I can see you have several tasks in your list. Based on their priorities and deadlines, I'd recommend focusing on the high-priority items first. Would you like me to create a prioritized schedule for you?",
    timestamp: '10:31 AM',
  },
  {
    id: '4',
    type: 'user',
    content: 'Yes, that would be great!',
    timestamp: '10:32 AM',
  },
  {
    id: '5',
    type: 'assistant',
    content:
      "Here's your prioritized task list:\n\n1. **Critical Priority Tasks**\n   - Complete project proposal review\n   - Submit quarterly report\n\n2. **High Priority Tasks**\n   - Team meeting preparation\n   - Code review for feature branch\n\n3. **Medium Priority Tasks**\n   - Update documentation\n   - Email client responses\n\nWould you like me to help you break down any of these tasks into smaller subtasks?",
    timestamp: '10:33 AM',
  },
];

export function AiChatSidebar() {
  return (
    <div
      className={cn(
        'flex flex-col gap-2 h-full',
        'rounded-sm',
        'bg-background',
      )}>
      {/* Chat Messages */}
      <ScrollArea className="h-0 flex-1 px-2">
        <div className="space-y-4">
          {mockMessages.map((message) => (
            <div
              key={message.id}
              className={cn(
                'flex gap-3',
                message.type === 'user' && 'flex-row-reverse',
              )}>
              <div
                className={cn(
                  'flex flex-col gap-1 max-w-[80%]',
                  message.type === 'user' && 'items-end',
                )}>
                <div
                  className={cn(
                    'text-sm',
                    message.type === 'user' && 'bg-muted px-3 py-2 rounded-sm',
                  )}>
                  <div className="whitespace-pre-wrap">{message.content}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
      {/* Input Area */}
      <div className={cn('flex items-center gap-2 h-24')}>
        <Textarea
          placeholder="Ask me anything about your tasks..."
          className="resize-none h-full"
        />
      </div>
    </div>
  );
}
