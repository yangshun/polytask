import { cn } from '~/lib/utils';

import { taskStatusRecord } from './task-status-list';
import { TaskStatus } from '~/types/task';

interface TaskStatusIconProps {
  status: TaskStatus;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'size-3',
  md: 'size-4',
  lg: 'size-5',
};

export function TaskStatusIcon({
  status,
  size = 'md',
  className,
}: TaskStatusIconProps) {
  const iconSize = sizeClasses[size];
  const Icon = taskStatusRecord[status].icon;

  return (
    <Icon
      className={cn(iconSize, taskStatusRecord[status].className, className)}
    />
  );
}
