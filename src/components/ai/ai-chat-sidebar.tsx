'use client';

import { useChat } from '@ai-sdk/react';
import {
  getToolName,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithToolCalls,
} from 'ai';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ScrollArea } from '~/components/ui/scroll-area';
import { Textarea } from '~/components/ui/textarea';
import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  addTask,
  updateTask as reduxUpdateTask,
  deleteTask as reduxDeleteTask,
  assignTask as reduxAssignTask,
  addTaskLabel as reduxAddTaskLabel,
  removeTaskLabel as reduxRemoveTaskLabel,
} from '~/store/features/tasks/tasks-slice';
import { selectRawTasks } from '~/store/features/tasks/tasks-selectors';
import { assignees } from '~/data/mock-assignees';
import type {
  TaskRaw,
  TaskStatus,
  TaskPriority,
} from '~/components/tasks/types';

function generateTaskId(tasks: TaskRaw[]): string {
  const max = tasks.reduce((acc, task) => {
    const match = task.id.match(/^[A-Z]+-(\d+)$/);
    return match ? Math.max(acc, parseInt(match[1], 10)) : acc;
  }, 0);
  return `MUL-${max + 1}`;
}

function assigneeName(id: unknown): string {
  return assignees.find((a) => a.id === String(id))?.name ?? String(id);
}

function ToolInvocationBadge({
  toolName,
  input,
  state,
}: {
  toolName: string;
  input: Record<string, unknown>;
  state: string;
}) {
  const isPending = state === 'input-streaming' || state === 'input-available';
  const entityClassName = 'font-medium text-foreground';

  const label = (() => {
    switch (toolName) {
      case 'getTasks':
        return `${isPending ? 'Retrieving' : 'Retrieved'} tasks`;
      case 'createTask':
        return (
          <>
            {isPending ? 'Creating' : 'Created'} task:{' '}
            <strong className={entityClassName}>{input.title as string}</strong>
          </>
        );
      case 'updateTask':
        return (
          <>
            {isPending ? 'Updating' : 'Updated'} task{' '}
            <strong className={entityClassName}>{input.id as string}</strong>
          </>
        );
      case 'deleteTask':
        return (
          <>
            {isPending ? 'Deleting' : 'Deleted'} task{' '}
            <strong className={entityClassName}>{input.id as string}</strong>
          </>
        );
      case 'assignTask':
        return (
          <>
            {isPending ? 'Assigning' : 'Assigned'}{' '}
            <strong className={entityClassName}>{input.id as string}</strong> to{' '}
            <strong className={entityClassName}>
              {assigneeName(input.assigneeId)}
            </strong>
          </>
        );
      case 'unassignTask':
        return (
          <>
            {isPending ? 'Unassigning' : 'Unassigned'}{' '}
            <strong className={entityClassName}>{input.id as string}</strong>
          </>
        );
      case 'addTaskLabel':
        return (
          <>
            {isPending ? 'Adding' : 'Added'} label "
            <strong className={entityClassName}>{input.label as string}</strong>
            " to{' '}
            <strong className={entityClassName}>{input.id as string}</strong>
          </>
        );
      case 'removeTaskLabel':
        return (
          <>
            {isPending ? 'Removing' : 'Removed'} label "
            <strong className={entityClassName}>{input.label as string}</strong>
            " from{' '}
            <strong className={entityClassName}>{input.id as string}</strong>
          </>
        );
      default:
        return toolName;
    }
  })();

  return (
    <div
      className={cn(
        'inline-flex items-center gap-3',
        'text-muted-foreground my-1.5',
      )}>
      {isPending ? (
        <span className="size-2 animate-pulse rounded-full bg-muted" />
      ) : (
        <span className="size-2 rounded-full bg-green-500" />
      )}
      <span>{label}</span>
    </div>
  );
}

export function AiChatSidebar() {
  const rawTasks = useAppSelector(selectRawTasks);
  const dispatch = useAppDispatch();
  const [input, setInput] = useState('');

  const bottomRef = useRef<HTMLDivElement>(null);

  // Ref to break circular dep between useChat init and addToolOutput usage
  const addToolOutputRef = useRef<((...args: any[]) => Promise<void>) | null>(
    null,
  );

  const { messages, sendMessage, addToolOutput, status, error } = useChat({
    id: 'ai-chat',
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
    onError: (err) => {
      console.error('Chat error:', err);
    },
    onToolCall: async ({ toolCall }) => {
      const tc = toolCall;
      const i = (tc.input ?? {}) as Record<string, unknown>;
      let output: unknown = { success: false };

      if (tc.toolName === 'getTasks') {
        output = { tasks: rawTasks };
      } else if (tc.toolName === 'createTask') {
        const newTask: TaskRaw = {
          id: generateTaskId(rawTasks),
          title: i.title as string,
          description: i.description as string | undefined,
          status: (i.status as TaskStatus) ?? 'todo',
          priority: (i.priority as TaskPriority) ?? 1,
          labels: (i.labels as string[]) ?? [],
          assigneeId: i.assigneeId as string | undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        dispatch(addTask(newTask));
        output = { success: true, task: newTask };
      } else if (tc.toolName === 'updateTask') {
        const { id, ...updates } = i as { id: string } & Partial<
          Omit<TaskRaw, 'id'>
        >;
        dispatch(reduxUpdateTask({ id, updates }));
        output = { success: true };
      } else if (tc.toolName === 'deleteTask') {
        dispatch(reduxDeleteTask(i.id as string));
        output = { success: true };
      } else if (tc.toolName === 'assignTask') {
        dispatch(
          reduxAssignTask({
            id: i.id as string,
            assigneeId: i.assigneeId as string,
          }),
        );
        output = { success: true };
      } else if (tc.toolName === 'unassignTask') {
        dispatch(
          reduxUpdateTask({
            id: i.id as string,
            updates: { assigneeId: undefined },
          }),
        );
        output = { success: true };
      } else if (tc.toolName === 'addTaskLabel') {
        dispatch(
          reduxAddTaskLabel({ id: i.id as string, label: i.label as string }),
        );
        output = { success: true };
      } else if (tc.toolName === 'removeTaskLabel') {
        dispatch(
          reduxRemoveTaskLabel({
            id: i.id as string,
            label: i.label as string,
          }),
        );
        output = { success: true };
      }

      // Defer addToolOutput to avoid a deadlock with SerialJobExecutor.
      // onToolCall is invoked from within jobExecutor.run() (job A).
      // addToolOutput also enqueues via jobExecutor.run() (job B).
      // Since the executor is single-threaded, job B can't start until
      // job A finishes — but job A is awaiting job B → deadlock.
      // setTimeout(0) breaks out of job A's execution context first.
      setTimeout(() => {
        addToolOutputRef.current?.({
          tool: tc.toolName,
          toolCallId: tc.toolCallId,
          output,
        });
      }, 0);
    },
  });

  // Keep ref in sync (set during render, available before any streaming callback)
  addToolOutputRef.current = addToolOutput;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messages, status]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (input.trim() && status !== 'streaming') {
      sendMessage({ text: input.trim() });
      setInput('');
    }
  }

  function handleKeyPress(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      if (input.trim() && status !== 'streaming') {
        handleSubmit(event);
      }
    }
  }

  return (
    <div className={cn('flex flex-col h-full', 'rounded-sm', 'bg-background')}>
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
                    'text-sm',
                    message.role === 'user' &&
                      'px-2 py-1.5 border border-muted rounded-md',
                  )}>
                  {message.role === 'user' ? (
                    <div className="whitespace-pre-wrap">
                      {message.parts?.map((part, index) => {
                        if (part.type === 'text') {
                          return <span key={index}>{part.text}</span>;
                        }
                        return null;
                      })}
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      {message.parts?.map((part, index) => {
                        if (part.type === 'text') {
                          return (
                            <div
                              className="prose prose-invert prose-sm text-foreground"
                              key={index}>
                              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                {part.text}
                              </ReactMarkdown>
                            </div>
                          );
                        }

                        if (isToolUIPart(part)) {
                          const toolName = getToolName(part);
                          const toolPart = part as any;

                          return (
                            <ToolInvocationBadge
                              key={index}
                              toolName={toolName}
                              input={
                                (toolPart.input ?? {}) as Record<
                                  string,
                                  unknown
                                >
                              }
                              state={toolPart.state}
                            />
                          );
                        }
                        return null;
                      })}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
          {status === 'streaming' && (
            <div>
              <div className="flex items-center gap-1 w-fit text-sm px-2 py-2 rounded-full bg-muted">
                <div
                  className="size-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '0ms' }}
                />
                <div
                  className="size-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '150ms' }}
                />
                <div
                  className="size-1.5 bg-muted-foreground rounded-full animate-bounce"
                  style={{ animationDelay: '300ms' }}
                />
              </div>
            </div>
          )}
          <div ref={bottomRef} />
          {error && (
            <div className="text-red-500 text-sm p-3 bg-red-50 rounded-lg">
              Error: {error.message}
            </div>
          )}
        </div>
      </ScrollArea>
      {messages.length <= 2 && (
        <div className="flex flex-col gap-2 p-2">
          {[
            'Summarize the task statuses',
            "What are Mike's tasks?",
            'Assign Lisa a new task to update the README, with high priority',
            'Reassign all pending tasks to Jane',
          ].map((prompt) => (
            <button
              key={prompt}
              type="button"
              className="text-left text-sm px-3 py-2 rounded-md border border-muted hover:bg-muted/25 transition-colors cursor-pointer"
              onClick={() => {
                sendMessage({ text: prompt });
              }}>
              {prompt}
            </button>
          ))}
        </div>
      )}
      {/* Input Area */}
      <div className={cn('flex flex-col gap-2 px-2 pt-2')}>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <Textarea
            autoFocus={true}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder="Ask anything about your tasks or perform actions"
            className="resize-none max-h-30 flex-1 leading-tight"
          />
          <Button type="submit" disabled={!input.trim()} size="sm">
            Send
          </Button>
        </form>
      </div>
    </div>
  );
}
