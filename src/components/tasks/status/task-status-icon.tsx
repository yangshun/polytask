import { cn } from '~/lib/utils';
import { Todo } from '~/types/todo';
import { taskStatusRecord } from './task-status-list';

interface TaskStatusIconProps {
  status: Todo['status'];
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
