import { TaskStatus } from '~/types/task';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';

import { RiArrowDownSLine } from 'react-icons/ri';
import { TaskStatusIcon } from './task-status-icon';
import { cn } from '~/lib/utils';
import { useState } from 'react';
import { TaskStatusCombobox } from './task-status-combobox';

export type TaskStatusSelectorProps = {
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  className?: string;
};

export function TaskStatusSelector({
  value,
  onChange,
  className,
}: TaskStatusSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-1', className)}
          aria-label="Change status">
          <TaskStatusIcon status={value} />
          <span className="capitalize text-xs font-medium">
            {value.replace('-', ' ')}
          </span>
          <RiArrowDownSLine className="w-3 h-3 ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-48">
        <TaskStatusCombobox
          onSelect={(status) => {
            onChange(status);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
