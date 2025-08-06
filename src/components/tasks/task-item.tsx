'use client';

import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Flame,
  User,
  Calendar,
  ArrowRight,
  Trash2,
} from 'lucide-react';
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
import { Todo } from '~/types/todo';
import { useAppDispatch } from '~/store/hooks';
import { setSelectedTask } from '~/store/features/tasks/tasks-slice';

function getStatusIcon(status: Todo['status']) {
  switch (status) {
    case 'done':
      return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    case 'in-progress':
      return <Clock className="h-4 w-4 text-blue-600" />;
    case 'cancelled':
      return <Circle className="h-4 w-4 text-gray-400" />;
    default:
      return <Circle className="h-4 w-4 text-gray-400" />;
  }
}

function getPriorityIcon(priority: Todo['priority']) {
  switch (priority) {
    case 'urgent':
      return <Flame className="h-3 w-3 text-red-500" />;
    case 'high':
      return <AlertTriangle className="h-3 w-3 text-orange-500" />;
    case 'medium':
      return <ArrowRight className="h-3 w-3 text-yellow-500" />;
    case 'low':
      return <ArrowRight className="h-3 w-3 text-gray-400 rotate-90" />;
    default:
      return null;
  }
}

interface TaskItemProps {
  task: Todo;
  onStatusChange: (id: string) => void;
  onStatusUpdate: (id: string, status: Todo['status']) => void;
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
  const dispatch = useAppDispatch();

  function handleStatusClick(e: React.MouseEvent) {
    e.stopPropagation(); // Prevent the main div click from firing
    onStatusChange(task.id);
  }

  function handleDelete() {
    onDelete(task.id);
  }

  function handleStatusUpdate(status: Todo['status']) {
    onStatusUpdate(task.id, status);
  }

  function getStatusText(status: Todo['status']) {
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

  const allStatuses: Todo['status'][] = [
    'todo',
    'in-progress',
    'done',
    'cancelled',
  ];

  return (
    <ContextMenu>
      <ContextMenuTrigger asChild>
        <div>
          <div
            className={cn(
              'group flex items-center gap-3 px-3 py-2 rounded-md transition-colors',
              isSelected ? 'bg-indigo-300/25' : 'hover:bg-accent/50',
            )}
            onClick={() => {
              dispatch(setSelectedTask(task.id));
            }}>
            <button
              onClick={handleStatusClick}
              className="shrink-0 hover:scale-110 transition-transform">
              {getStatusIcon(task.status)}
            </button>
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs text-muted-foreground font-mono font-medium w-14">
                {task.id}
              </span>
              {getPriorityIcon(task.priority)}
            </div>
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
                  <User className="h-3 w-3" />
                  <span>{task.assignee.name.split(' ')[0]}</span>
                </div>
              )}
              {task.dueDate && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <Calendar className="h-3 w-3" />
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
            {getStatusIcon(task.status)}
            <span className="ml-2">Status</span>
          </ContextMenuSubTrigger>
          <ContextMenuSubContent className="w-48">
            {allStatuses.map((status) => (
              <ContextMenuItem
                key={status}
                onClick={() => handleStatusUpdate(status)}
                className={cn('flex items-center')}>
                {getStatusIcon(status)}
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
          <Trash2 className="h-4 w-4" />
          <span className="ml-2">Delete...</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  );
}
