import { AlertTriangle, Flame, ArrowRight } from 'lucide-react';
import { cn } from '~/lib/utils';
import { Todo } from '~/types/todo';

interface TaskPriorityIconProps {
  priority: Todo['priority'];
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
  size = 'sm',
  className,
}: TaskPriorityIconProps) {
  const iconSize = sizeClasses[size];

  switch (priority) {
    case 'urgent':
      return <Flame className={cn(iconSize, 'text-red-500', className)} />;
    case 'high':
      return (
        <AlertTriangle className={cn(iconSize, 'text-orange-500', className)} />
      );
    case 'medium':
      return (
        <ArrowRight className={cn(iconSize, 'text-yellow-500', className)} />
      );
    case 'low':
      return (
        <ArrowRight
          className={cn(iconSize, 'text-gray-400 rotate-90', className)}
        />
      );
    default:
      return null;
  }
}
