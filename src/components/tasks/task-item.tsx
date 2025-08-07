'use client';

import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from '~/components/ui/context-menu';
import { Task, TaskStatus } from '~/types/task';
import { useAppDispatch } from '~/store/hooks';
import { setSelectedTask } from '~/store/features/tasks/tasks-slice';
import { TaskStatusIcon } from './status/task-status-icon';
import { useEffect, useRef } from 'react';
import { RiTimeLine, RiUserLine } from 'react-icons/ri';
import { taskDeleteCommand } from './task-commands';

interface TaskItemProps {
  task: Task;
  onStatusChange: (id: string) => void;
  onStatusUpdate: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
  isSelected?: boolean;
}

export function TaskItem({
  task,
  onStatusChange,
  onStatusUpdate,
  onDelete,
  isSelected = false,
}: TaskItemProps) {
  const rootRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  function handleStatusClick(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent the main div click from firing
    onStatusChange(task.id);
  }

  function handleDelete() {
    onDelete(task.id);
  }

  function handleStatusUpdate(status: TaskStatus) {
    onStatusUpdate(task.id, status);
  }

  function getStatusText(status: TaskStatus) {
    switch (status) {
      case 'todo':
        return 'To Do';
      case 'in-progress':
        return 'In Progress';
      case 'done':
        return 'Done';
      case 'cancelled':
        return 'Cancelled';
      default:
        return 'To Do';
    }
  }

  const allStatuses: TaskStatus[] = [
    'todo',
    'in-progress',
    'done',
    'cancelled',
  ];

  useEffect(() => {
    if (isSelected && rootRef.current) {
      rootRef.current.scrollIntoView({
        block: 'nearest',
      });
    }
  }, [isSelected]);

  const DeleteIcon = taskDeleteCommand(task.id).icon!;

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div ref={rootRef}>
          <div
            className={cn(
              'group flex items-center gap-3 px-3 py-2 rounded transition-colors',
              isSelected ? 'bg-indigo-300/25' : 'hover:bg-accent/50',
            )}
            onClick={() => {
              dispatch(setSelectedTask(task.id));
            }}>
            <button
              onClick={handleStatusClick}
              className="shrink-0 hover:scale-110 transition-transform">
              <TaskStatusIcon status={task.status} size="lg" />
            </button>
            <span className="text-xs text-muted-foreground font-mono font-medium w-14">
              {task.id}
            </span>
            <div className="flex-1 min-w-0">
              <span
                className={cn(
                  'text-sm',
                  task.status === 'done' &&
                    'line-through text-muted-foreground',
                )}>
                {task.title}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {task.labels?.slice(0, 2).map((label) => (
                <Badge
                  key={label}
                  variant="outline"
                  className="text-xs px-1.5 py-0">
                  {label}
                </Badge>
              ))}
              {task.labels && task.labels.length > 2 && (
                <Badge variant="outline" className="text-xs px-1.5 py-0">
                  +{task.labels.length - 2}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3 transition-opacity">
              {task.assignee && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RiUserLine className="h-3 w-3" />
                  <span>{task.assignee.name.split(' ')[0]}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <RiTimeLine className="h-3 w-3" />
                  <span>
                    {new Date(task.dueDate).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuSub>
          <ContextMenuSubTrigger>
            <TaskStatusIcon status={task.status} />
            <span className="ml-2">Status</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {allStatuses.map((status) => (
              <ContextMenuItem
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={cn('flex items-center')}>
                <TaskStatusIcon status={status} />
                <span className="ml-2">{getStatusText(status)}</span>
                {task.status === status && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    Current
                  </span>
                )}
              </ContextMenuItem>
            ))}
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete}>
          <DeleteIcon className="size-4" />
          <span className="ml-2">Delete...</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
