'use client';

import {
  CheckCircle2,
  Circle,
  Clock,
  AlertTriangle,
  Flame,
  MoreHorizontal,
  User,
  Calendar,
  ArrowRight,
} from 'lucide-react';
import { cn } from '~/lib/utils';
import { Badge } from '~/components/ui/badge';
import { Button } from '~/components/ui/button';
import { Todo } from '~/types/todo';

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
}

export function TaskItem({ task, onStatusChange }: TaskItemProps) {
  function handleStatusClick() {
    onStatusChange(task.id);
  }

  return (
    <div className="group flex items-center gap-3 px-3 py-2 hover:bg-accent/50 rounded-md transition-colors">
      <button
        onClick={handleStatusClick}
        className="flex-shrink-0 hover:scale-110 transition-transform">
        {getStatusIcon(task.status)}
      </button>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-xs text-muted-foreground font-mono">
          {task.id}
        </span>
        {getPriorityIcon(task.priority)}
      </div>
      <div className="flex-1 min-w-0">
        <span
          className={cn(
            'text-sm',
            task.status === 'done' && 'line-through text-muted-foreground',
          )}>
          {task.title}
        </span>
      </div>

      <div className="flex items-center gap-2">
        {task.labels?.slice(0, 2).map((label) => (
          <Badge key={label} variant="outline" className="text-xs px-1.5 py-0">
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
        <Button
          variant="ghost"
          size="icon"
          className="size-6 opacity-0 group-hover:opacity-100">
          <MoreHorizontal className="size-3" />
        </Button>
      </div>
    </div>
  );
}
