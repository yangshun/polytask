import { cn } from '~/lib/utils';
import { taskPriorityRecord } from './task-priority-list';
import type { TaskPriority } from '~/components/tasks/types';

interface TaskPriorityIconProps {
  priority: TaskPriority;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
};

export function TaskPriorityIcon({
  priority,
  size = 'md',
  className,
}: TaskPriorityIconProps) {
  const iconSize = sizeClasses[size];
  const Icon = taskPriorityRecord[priority].icon;

  return <Icon className={cn(iconSize, 'text-muted-foreground', className)} />;
}
