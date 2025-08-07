import {
  RiCheckboxCircleFill,
  RiCheckboxBlankCircleLine,
  RiTimeLine,
} from 'react-icons/ri';
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
        <RiCheckboxCircleFill
          className={cn(iconSize, 'text-green-600', className)}
        />
      );
    case 'in-progress':
      return (
        <RiTimeLine className={cn(iconSize, 'text-yellow-500', className)} />
      );
    case 'cancelled':
      return (
        <RiCheckboxBlankCircleLine
          className={cn(iconSize, 'text-gray-400', className)}
        />
      );
    default:
      return (
        <RiCheckboxBlankCircleLine
          className={cn(iconSize, 'text-gray-400', className)}
        />
      );
  }
}
