import { CheckCircle2, Circle, Clock } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Todo } from '~/types/todo';

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

  switch (status) {
    case 'done':
      return (
        <CheckCircle2 className={cn(iconSize, 'text-green-600', className)} />
      );
    case 'in-progress':
      return <Clock className={cn(iconSize, 'text-yellow-400', className)} />;
    case 'cancelled':
      return <Circle className={cn(iconSize, 'text-gray-400', className)} />;
    default:
      return <Circle className={cn(iconSize, 'text-gray-400', className)} />;
  }
}
