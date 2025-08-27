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
  TaskDisplayField,
} from '~/store/features/display/display-slice';
import {
  selectVisibleFields,
  selectFieldLabels,
  selectSortBy,
  selectSortDirection,
  selectSortableFields,
} from '~/store/features/display/display-selectors';
import { cn } from '~/lib/utils';
import { useCommands } from '~/components/commands/commands-context';
import { taskDisplayPropertiesCommandCreator } from '../task-commands';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';
import { RiArrowUpDownLine } from 'react-icons/ri';
import { FaSortAmountDown, FaSortAmountUpAlt } from 'react-icons/fa';

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
  const [sortOpen, setSortOpen] = useState(false);
  const { registerCommand } = useCommands();

  const dispatch = useAppDispatch();
  const visibleFields = useAppSelector(selectVisibleFields);
  const sortBy = useAppSelector(selectSortBy);
  const sortDirection = useAppSelector(selectSortDirection);
  const sortableFields = useAppSelector(selectSortableFields);
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

  function handleSortBy(field: TaskDisplayField) {
    dispatch(setSortBy(field));
    setSortOpen(false);
  }

  function handleToggleSortDirection() {
    dispatch(toggleSortDirection());
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
        className="w-56 p-3"
        onEscapeKeyDown={() => setOpen(false)}>
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <RiArrowUpDownLine className="h-3 w-3 text-muted-foreground" />
                <Label className="text-xs font-medium text-muted-foreground">
                  Ordering
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <DropdownMenu open={sortOpen} onOpenChange={setSortOpen}>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-6 px-2 text-xs min-w-[80px]">
                      <span>{fieldLabels[sortBy]}</span>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-32">
                    {sortableFields.map((field) => (
                      <DropdownMenuItem
                        key={field}
                        onClick={() => handleSortBy(field)}
                        className={cn(
                          'text-xs',
                          sortBy === field && 'bg-accent'
                        )}>
                        {fieldLabels[field]}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-6 w-6 p-0 shrink-0"
                  onClick={handleToggleSortDirection}>
                  {sortDirection === 'asc' ? (
                    <FaSortAmountDown className="h-3 w-3" />
                  ) : (
                    <FaSortAmountUpAlt className="h-3 w-3" />
                  )}
                </Button>
              </div>
            </div>
          </div>

          <div className="border-t border-border" />

          <div>
            <Label className="text-xs font-bold text-foreground mb-3">
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
                    onToggle={() => handleToggleField(field)}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
