import { TaskStatus } from '~/types/task';
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
import { taskStatusOpenCommand } from '../task-commands';
import { useCommandsRegistry } from '~/components/commands/commands-context';

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
  const { registerCommand } = useCommandsRegistry();

  const openCommand = useMemo(
    () =>
      taskStatusOpenCommand(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    const unregisterStatus = registerCommand(openCommand);

    return () => {
      unregisterStatus();
    };
  }, [registerCommand, openCommand]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
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
