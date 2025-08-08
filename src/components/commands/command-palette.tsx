'use client';

import { useEffect, useState } from 'react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '~/components/ui/command';
import { useAppDispatch } from '~/store/hooks';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import { formatShortcut } from '../shortcuts/format-shortcut';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const dispatch = useAppDispatch();
  const { commands } = useCommandsRegistry();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, []);

  // Group commands by their group property
  const groupedCommands = commands.reduce((acc, command) => {
    const group = command.group || 'general';
    if (!acc[group]) {
      acc[group] = [];
    }
    acc[group].push(command);
    return acc;
  }, {} as Record<string, typeof commands>);

  return (
    <>
      <p className="text-sm text-muted-foreground">
        Press{' '}
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </p>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found</CommandEmpty>
          {Object.entries(groupedCommands).map(([groupName, groupCommands]) => (
            <CommandGroup
              key={groupName}
              heading={groupName.charAt(0).toUpperCase() + groupName.slice(1)}>
              {groupCommands.map((command) => (
                <CommandItem
                  key={command.id}
                  onSelect={() => {
                    dispatch(command.action());
                    setOpen(false);
                  }}>
                  {command.icon && <command.icon className="mr-2 h-4 w-4" />}
                  <span>{command.name}</span>
                  {command.shortcut && (
                    <CommandShortcut>
                      {formatShortcut(command.shortcut)}
                    </CommandShortcut>
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          ))}
        </CommandList>
      </CommandDialog>
    </>
  );
}
