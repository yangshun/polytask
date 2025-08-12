import { useRef } from 'react';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '~/components/ui/command';
import type { TaskPriority } from '~/components/tasks/types';
import { taskPriorityList, taskPriorityRecord } from './task-priority-list';
import { TaskPriorityIcon } from './task-priority-icon';

export function TaskPriorityCombobox({
  onSelect,
}: {
  onSelect: (priority: TaskPriority) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  return (
    <Command onMouseOver={() => inputRef.current?.focus()}>
      <CommandInput
        ref={inputRef}
        autoFocus
        placeholder="Set priority..."
        className="h-9"
      />
      <CommandList>
        <CommandEmpty>No priority found.</CommandEmpty>
        <CommandGroup>
          {taskPriorityList.map((priority) => {
            const pr = taskPriorityRecord[priority];
            return (
              <CommandItem
                key={priority}
                value={pr.label}
                onSelect={() => onSelect(priority)}
                className="flex items-center gap-2">
                <span className="w-4 flex items-center justify-center">
                  <TaskPriorityIcon
                    priority={priority}
                    className="mr-2"
                    size="md"
                  />
                </span>
                <span className="mr-auto">{pr.label}</span>
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
