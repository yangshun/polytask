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
  setSortBy,
  toggleSortDirection,
  resetToDefault,
  TaskDisplayField,
  TaskSortField,
  taskSortFields,
} from '~/store/features/display/display-slice';
import {
  selectVisibleFields,
  selectFieldLabels,
  selectSortBy,
  selectSortDirection,
} from '~/store/features/display/display-selectors';
import { cn } from '~/lib/utils';
import { useCommands } from '~/components/commands/commands-context';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa';
import { taskDisplayPropertiesCommandCreator, taskDisplayResetCommandCreator } from '../task-commands';

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
        'text-xs text-left h-6 px-2',
        isSelected
          ? 'text-accent-foreground'
          : 'border border-transparent hover:bg-accent',
        isDisabled && 'opacity-50 cursor-not-allowed',
      )}
      onClick={onToggle}
      disabled={isDisabled}>
      {label}
    </Button>
  );
}

export function TaskDisplayDropdown() {
  const [open, setOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  const { registerCommand } = useCommands();

  const dispatch = useAppDispatch();
  const visibleFields = useAppSelector(selectVisibleFields);
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);
  const fieldLabels = selectFieldLabels();

  const openCommand = useMemo(
    () =>
      taskDisplayPropertiesCommandCreator(() => {
        setOpen(true);
      }),
    [setOpen],
  );

  const resetCommand = useMemo(
    () => taskDisplayResetCommandCreator(),
    [],
  );

  useEffect(() => {
    const unregisterDisplayProperties = registerCommand(openCommand);
    const unregisterDisplayReset = registerCommand(resetCommand);

    return () => {
      unregisterDisplayProperties();
      unregisterDisplayReset();
    };
  }, [registerCommand, openCommand, resetCommand]);

  function handleToggleFieldDisplay(field: TaskDisplayField) {
    dispatch(toggleField(field));
  }

  function handleSortBy(field: TaskSortField) {
    dispatch(setSortBy(field));
    setSortOpen(false);
  }

  function handleToggleSortDirection() {
    dispatch(toggleSortDirection());
  }

  function handleReset() {
    dispatch(resetToDefault());
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
        className="w-56 p-0"
        onEscapeKeyDown={() => setOpen(false)}>
        <div className="flex items-center gap-3 p-3">
          <div className="flex flex-1 items-center gap-1">
            <RiArrowUpDownLine className="size-4 text-muted-foreground" />
            <Label className="text-xs font-medium text-muted-foreground">
              Ordering
            </Label>
          </div>
          <div className="flex flex-1 items-center gap-1 justify-end">
            <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 px-1 text-xs w-16">
                  <span>{fieldLabels[sortBy]}</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-32">
                {taskSortFields.map((field) => (
                  <DropdownMenuItem
                    key={field}
                    onClick={() => handleSortBy(field)}
                    className={cn('text-xs', sortBy === field && 'bg-accent')}>
                    {fieldLabels[field]}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            <Button
              variant="outline"
              size="sm"
              icon={
                sortDirection === 'asc' ? FaSortAmountDown : FaSortAmountUpAlt
              }
              className="size-6 p-0 shrink-0"
              onClick={handleToggleSortDirection}
            />
          </div>
        </div>
        <div className="border-t border-border" />
        <div className="flex flex-col gap-2 p-3">
          <Label className="text-xs font-medium text-foreground">
            List options
          </Label>
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
                  onToggle={() => handleToggleFieldDisplay(field)}
                />
              ))}
            </div>
          </div>
        </div>
        <div className="border-t border-border mt-2" />
        <div className="p-3">
          <button
            className="text-xs text-foreground/70 hover:text-foreground cursor-pointer"
            onClick={handleReset}>
            Reset
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}
