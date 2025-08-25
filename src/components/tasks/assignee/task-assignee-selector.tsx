import { useEffect, useMemo, useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';

import { Button } from '~/components/ui/button';
import { useCommands } from '~/components/commands/commands-context';
import { taskAssigneeOpenCommandCreator } from '../task-commands';
import { TaskAssigneeCombobox } from './task-assignee-combobox';
import { assignees } from '~/data/mock-assignees';

export type TaskAssigneeSelectorProps = {
  commandScope?: string;
  value?: string | null;
  onChange: (assigneeId: string) => void;
};

export function TaskAssigneeSelector({
  commandScope,
  value,
  onChange,
}: TaskAssigneeSelectorProps) {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const taskAssigneeOpenCommandObj = taskAssigneeOpenCommandCreator(() => {});

  const openCommand = useMemo(
    () =>
      taskAssigneeOpenCommandCreator(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    const unregisterAssignee = registerCommand(openCommand, commandScope);

    return () => {
      unregisterAssignee();
    };
  }, [registerCommand, openCommand, commandScope]);

  const assignee = assignees.find((a) => a.id === value) || null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
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
            <taskAssigneeOpenCommandObj.icon className="size-5 rounded-full bg-muted" />
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
