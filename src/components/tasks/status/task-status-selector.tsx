import { TaskStatus } from '~/components/tasks/types';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';

import { TaskStatusIcon } from './task-status-icon';
import { cn } from '~/lib/utils';
import { useEffect, useMemo, useState } from 'react';
import { TaskStatusCombobox } from './task-status-combobox';
import { taskStatusRecord } from './task-status-list';
import { taskStatusOpenCommandCreator } from '../task-commands';
import { useCommands } from '~/components/commands/commands-context';

export type TaskStatusSelectorProps = {
  commandScope?: string;
  value: TaskStatus;
  onChange: (status: TaskStatus) => void;
  className?: string;
};

export function TaskStatusSelector({
  commandScope,
  value,
  onChange,
  className,
}: TaskStatusSelectorProps) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const openCommand = useMemo(
    () =>
      taskStatusOpenCommandCreator(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    const unregisterStatus = registerCommand(openCommand, commandScope);

    return () => {
      unregisterStatus();
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
          <TaskStatusIcon status={value} />
          <span className="text-xs font-medium">
            {taskStatusRecord[value].label}
          </span>
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
