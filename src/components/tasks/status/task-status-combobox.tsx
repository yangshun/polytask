import {
  Command,
  CommandInput,
  CommandList,
  CommandItem,
  CommandEmpty,
  CommandGroup,
} from '~/components/ui/command';
import { TaskStatus } from '~/components/tasks/types';
import { taskStatusList, taskStatusRecord } from './task-status-list';
import { TaskStatusIcon } from './task-status-icon';
import { useRef } from 'react';

type Props = {
  onSelect: (status: TaskStatus) => void;
};

export function TaskStatusCombobox({ onSelect }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <Command onMouseOver={() => inputRef.current?.focus()}>
      <CommandInput
        ref={inputRef}
        autoFocus={true}
        placeholder="Change status..."
        className="h-9"
      />
      <CommandList>
        <CommandEmpty>No status found.</CommandEmpty>
        <CommandGroup>
          {taskStatusList.map((status) => {
            const taskStatus = taskStatusRecord[status];
            return (
              <CommandItem
                key={status}
                value={taskStatus.label}
                onSelect={() => {
                  onSelect(status);
                }}
                className="flex items-center gap-2">
                <TaskStatusIcon status={status} className="mr-2" size="md" />
                {taskStatus.label}
              </CommandItem>
            );
          })}
        </CommandGroup>
      </CommandList>
    </Command>
  );
}
