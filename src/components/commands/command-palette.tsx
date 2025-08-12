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
import { useCommands } from '~/components/commands/commands-context';
import { formatShortcut } from '../shortcuts/format-shortcut';
import { cn } from '~/lib/utils';

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const { commands } = useCommands();

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
  const groupedCommands = commands
    .filter((command) => command.commandPalette)
    .reduce((acc, command) => {
      const group = command.group || 'general';
      if (!acc[group]) {
        acc[group] = [];
      }
      acc[group].push(command);
      return acc;
    }, {} as Record<string, typeof commands>);

  // TODO: Implement group ranking
  const groups = Object.entries(groupedCommands).sort(([a], [b]) =>
    a.localeCompare(b),
  );

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
        <CommandList className="min-h-[300px]">
          <CommandEmpty>No results found</CommandEmpty>
          {groups.map(([groupName, groupCommands]) => (
            <CommandGroup
              key={groupName}
              heading={groupName.charAt(0).toUpperCase() + groupName.slice(1)}>
              {groupCommands.map((command) => (
                <CommandItem
                  key={command.id}
                  value={`${command.shortcut} ${command.name}`}
                  onSelect={() => {
                    command.action();
                    setOpen(false);
                  }}>
                  {command.icon && (
                    <command.icon className={cn('mr-1 size-4')} />
                  )}
                  <span className="font-medium">{command.name}</span>
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
