'use client';

import { useEffect, useMemo, useState } from 'react';
import { Button } from '~/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '~/components/ui/popover';
import { Label } from '~/components/ui/label';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import {
  toggleField,
  TaskDisplayField,
} from '~/store/features/display/display-slice';
import {
  selectVisibleFields,
  selectFieldLabels,
} from '~/store/features/display/display-selectors';
import { cn } from '~/lib/utils';
import { useCommands } from '~/components/commands/commands-context';
import { taskDisplayPropertiesCommandCreator } from '../task-commands';

const allFields: TaskDisplayField[] = [
  'priority',
  'id',
  'status',
  'labels',
  'assignee',
  'createdAt',
  'updatedAt',
];

interface ToggleFieldButtonProps {
  label: string;
  isSelected: boolean;
  isDisabled?: boolean;
  onToggle: () => void;
}

function ToggleFieldButton({
  label,
  isSelected,
  isDisabled = false,
  onToggle,
}: ToggleFieldButtonProps) {
  return (
    <Button
      variant={isSelected ? 'outline' : 'ghost'}
      size="sm"
      className={cn(
        'justify-between text-left h-6 px-2 font-normal',
        isSelected
          ? 'bg-accent text-accent-foreground'
          : 'border border-transparent hover:bg-accent/25',
        isDisabled && 'opacity-50 cursor-not-allowed',
      )}
      onClick={onToggle}
      disabled={isDisabled}>
      <span className="text-xs">{label}</span>
    </Button>
  );
}

export function TaskDisplayDropdown() {
  const [open, setOpen] = useState(false);
  const { registerCommand } = useCommands();

  const dispatch = useAppDispatch();
  const visibleFields = useAppSelector(selectVisibleFields);
  const fieldLabels = selectFieldLabels();

  const openCommand = useMemo(
    () =>
      taskDisplayPropertiesCommandCreator(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  useEffect(() => {
    const unregisterDisplayProperties = registerCommand(openCommand);

    return () => {
      unregisterDisplayProperties();
    };
  }, [registerCommand, openCommand]);

  function handleToggleField(field: TaskDisplayField) {
    dispatch(toggleField(field));
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          shortcut={openCommand.shortcut}
          icon={openCommand.icon}
          tooltip="Show display options"
          aria-label="Show display options">
          Display
        </Button>
      </PopoverTrigger>
      <PopoverContent
        align="end"
        className="w-48 p-3"
        onEscapeKeyDown={() => setOpen(false)}>
        <div>
          <Label className="text-xs font-medium text-muted-foreground">
            Display properties
          </Label>
          <div className="mt-3 flex flex-wrap gap-1">
            {allFields.map((field) => (
              <ToggleFieldButton
                key={field}
                label={fieldLabels[field]}
                isSelected={visibleFields.includes(field)}
                onToggle={() => handleToggleField(field)}
              />
            ))}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
