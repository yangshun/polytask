import { useEffect, useMemo, useState } from 'react';
import type { TaskPriority } from '~/components/tasks/types';
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
import { taskPriorityOpenCommandCreator } from '../task-commands';
import { useCommands } from '~/components/commands/commands-context';

type Props = Readonly<{
  commandScope?: string;
  value: TaskPriority;
  onChange: (p: TaskPriority) => void;
  className?: string;
}>;

export function TaskPrioritySelector({
  commandScope,
  value,
  onChange,
  className,
}: Props) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const openCommand = useMemo(
    () =>
      taskPriorityOpenCommandCreator(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    const unregisterPriority = registerCommand(openCommand, commandScope);

    return () => {
      unregisterPriority();
    };
  }, [registerCommand, openCommand, commandScope]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          tooltip={openCommand.name}
          shortcut={openCommand.shortcut}
          className={cn('flex items-center gap-1', className)}
          aria-label={openCommand.name}>
          <TaskPriorityIcon priority={value} />
          <span className="text-xs font-medium">
            {taskPriorityRecord[value].label}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-32">
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
