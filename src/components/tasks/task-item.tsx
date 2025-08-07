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
import { TaskObject, TaskStatus } from '~/types/task';
import { useAppDispatch } from '~/store/hooks';
import { setSelectedTask } from '~/store/features/tasks/tasks-slice';
import { TaskStatusIcon } from './status/task-status-icon';
import { useEffect, useRef, useState } from 'react';
import { taskDeleteCommand } from './task-commands';
import { TaskStatusCombobox } from './status/task-status-combobox';
import { RiProgress4Line } from 'react-icons/ri';

interface TaskItemProps {
  task: TaskObject;
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
  const [open, setOpen] = useState(false);

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
            {task.assignee && (
              <img
                src={task.assignee?.avatar}
                alt={task.assignee?.name}
                className="size-6 rounded-full"
              />
            )}
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-52">
        <ContextMenuSub open={open} onOpenChange={setOpen}>
          <ContextMenuSubTrigger>
            <RiProgress4Line className="size-4 text-muted-foreground" />
            <span className="ml-2">Status</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="p-0 w-48">
            <TaskStatusCombobox
              onSelect={(status) => {
                handleStatusUpdate(status);
                setOpen(false);
              }}
            />
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleDelete}>
          <DeleteIcon className="size-4 text-muted-foreground" />
          <span className="ml-2">Delete...</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
