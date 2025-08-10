import { useRef } from 'react';

import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '~/components/ui/command';

import { assignees } from '~/data/mock-assignees';

type Props = {
  onSelect: (assigneeId: string) => void;
};

export function TaskAssigneeCombobox({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Command onMouseOver={() => inputRef.current?.focus()}>
      <CommandInput
        ref={inputRef}
        placeholder="Change assignee..."
        className="h-9"
      />
      <CommandList>
        <CommandEmpty>No assignee found.</CommandEmpty>
        <CommandGroup>
          {assignees.map((assignee) => (
            <CommandItem
              key={assignee.id}
              value={assignee.name}
              onSelect={() => {
                onSelect(assignee.id);
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
  );
}
