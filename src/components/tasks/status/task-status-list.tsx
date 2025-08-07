import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiTimeLine,
} from 'react-icons/ri';
import { TaskStatus } from '~/types/task';

export const taskStatusRecord: Record<
  TaskStatus,
  Readonly<{
    icon: React.ElementType;
    className: string;
    label: string;
  }>
> = {
  todo: {
    icon: RiCheckboxBlankCircleLine,
    className: 'text-gray-400',
    label: 'To Do',
  },
  'in-progress': {
    icon: RiTimeLine,
    className: 'text-yellow-500',
    label: 'In Progress',
  },
  done: {
    icon: RiCheckboxCircleFill,
    className: 'text-green-600',
    label: 'Done',
  },
  cancelled: {
    icon: RiCloseCircleFill,
    className: 'text-gray-400',
    label: 'Cancelled',
  },
};

export const taskStatusList = [
  'todo',
  'in-progress',
  'done',
  'cancelled',
] as const;
