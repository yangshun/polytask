import {
  RiCheckboxBlankCircleLine,
  RiCheckboxCircleFill,
  RiCloseCircleFill,
  RiProgress4Line,
  RiProgress6Line,
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
    label: 'Todo',
  },
  'in-progress': {
    icon: RiProgress4Line,
    className: 'text-yellow-500',
    label: 'In Progress',
  },
  'in-review': {
    icon: RiProgress6Line,
    className: 'text-green-500',
    label: 'In Review',
  },
  done: {
    icon: RiCheckboxCircleFill,
    className: 'text-indigo-400',
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
  'in-review',
  'done',
  'cancelled',
] as const;
