import { useState } from 'react';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '~/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '~/components/ui/command';
import { Button } from '~/components/ui/button';
import { RiArrowDownSLine } from 'react-icons/ri';

import { assignees } from '~/data/mock-tasks';
import type { TaskAssignee } from '~/types/task';

export type TaskAssigneeSelectorProps = {
  value?: TaskAssignee | null;
  onChange: (assignee: TaskAssignee) => void;
};

export function TaskAssigneeSelector({
  value,
  onChange,
}: TaskAssigneeSelectorProps) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="flex items-center gap-1"
          aria-label="Change assignee">
          {value ? (
            <img
              src={value.avatar}
              alt={value.name}
              className="size-5 rounded-full"
            />
          ) : (
            <span className="size-5 rounded-full bg-muted" />
          )}
          <span className="text-xs font-medium">
            {value ? value.name : 'Unassigned'}
          </span>
          <RiArrowDownSLine className="w-3 h-3 ml-1 opacity-60" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="p-0 w-56">
        <Command>
          <CommandInput placeholder="Change assignee..." className="h-9" />
          <CommandList>
            <CommandEmpty>No assignee found.</CommandEmpty>
            <CommandGroup>
              {assignees.map((assignee) => (
                <CommandItem
                  key={assignee.id}
                  value={assignee.name}
                  onSelect={() => {
                    onChange(assignee);
                    setOpen(false);
                  }}
                  className="flex items-center gap-2">
                  <img
                    src={assignee.avatar}
                    alt={assignee.name}
                    className="size-5 rounded-full"
                  />
                  <span>{assignee.name}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
