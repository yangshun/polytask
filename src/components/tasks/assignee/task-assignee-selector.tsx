import { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';

import { Button } from '~/components/ui/button';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import { taskAssigneeOpenCommand } from '../task-commands';
import { TaskAssigneeCombobox } from './task-assignee-combobox';
import { assignees } from '~/data/mock-assignees';

export type TaskAssigneeSelectorProps = {
  value?: string | null;
  onChange: (assigneeId: string) => void;
};

export function TaskAssigneeSelector({
  value,
  onChange,
}: TaskAssigneeSelectorProps) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommandsRegistry();

  const openCommand = useMemo(
    () =>
      taskAssigneeOpenCommand(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    const unregisterAssignee = registerCommand(openCommand);

    return () => {
      unregisterAssignee();
    };
  }, [registerCommand, openCommand]);

  const assignee = assignees.find((a) => a.id === value) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          tooltip={openCommand.name}
          shortcut={openCommand.shortcut}
          className="flex items-center gap-1"
          aria-label={openCommand.name}>
          {assignee ? (
            <img
              src={assignee.avatar}
              alt={assignee.name}
              className="size-5 rounded-full"
            />
          ) : (
            <span className="size-5 rounded-full bg-muted" />
          )}
          <span className="text-xs font-medium">
            {assignee ? assignee.name : 'Unassigned'}
          </span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-56">
        <TaskAssigneeCombobox
          onSelect={(assignee) => {
            onChange(assignee);
            setOpen(false);
          }}
        />
      </PopoverContent>
    </Popover>
  );
}
