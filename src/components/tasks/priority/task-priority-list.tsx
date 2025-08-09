import {
  MdOutlineError,
  MdSignalCellular1Bar,
  MdSignalCellular2Bar,
  MdSignalCellular4Bar,
} from 'react-icons/md';
import { TbLineDashed } from 'react-icons/tb';
import type { TaskPriority } from '~/types/task';

export const taskPriorityRecord: Record<
  TaskPriority,
  Readonly<{
    icon: React.ElementType;
    label: string;
  }>
> = {
  0: {
    icon: TbLineDashed,
    label: 'No priority',
  },
  1: {
    icon: MdOutlineError,
    label: 'Urgent',
  },
  2: {
    icon: MdSignalCellular4Bar,
    label: 'High',
  },
  3: {
    icon: MdSignalCellular2Bar,
    label: 'Medium',
  },
  4: {
    icon: MdSignalCellular1Bar,
    label: 'Low',
  },
};

export const taskPriorityList = [0, 1, 2, 3, 4] as const;
