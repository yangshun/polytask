import { useState } from 'react';
import type { TaskPriority } from '~/types/task';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { cn } from '~/lib/utils';
import { TaskPriorityIcon } from './task-priority-icon';
import { TaskPriorityCombobox } from './task-priority-combobox';
import { taskPriorityRecord } from './task-priority-list';

export function TaskPrioritySelector({
  value,
  onChange,
  className,
}: {
  value: TaskPriority;
  onChange: (p: TaskPriority) => void;
  className?: string;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className={cn('flex items-center gap-1', className)}
          aria-label="Change priority">
          <TaskPriorityIcon priority={value} />
          <span className="text-xs font-medium">
            {taskPriorityRecord[value].label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-56">
        <TaskPriorityCombobox
          onSelect={(priority) => {
            onChange(priority);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
