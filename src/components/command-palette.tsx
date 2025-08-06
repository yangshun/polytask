'use client';

import * as React from 'react';
import { Moon, Sun, Monitor } from 'lucide-react';

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from '~/components/ui/command';
import { useAppDispatch } from '~/lib/hooks';
import { setThemeMode, toggleTheme } from '~/lib/features/theme/theme-slice';

export function CommandPalette() {
  const [open, setOpen] = React.useState(false);
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }

      // Theme shortcuts
      if (e.key === 't' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        dispatch(toggleTheme());
      }

      if (e.key === 'l' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        dispatch(setThemeMode('light'));
      }

      if (e.key === 'd' && (e.metaKey || e.ctrlKey) && e.shiftKey) {
        e.preventDefault();
        dispatch(setThemeMode('dark'));
      }
    };

    document.addEventListener('keydown', down);
    return () => document.removeEventListener('keydown', down);
  }, [dispatch]);

  const handleToggleTheme = () => {
    dispatch(toggleTheme());
    setOpen(false);
  };

  const handleSetLightTheme = () => {
    dispatch(setThemeMode('light'));
    setOpen(false);
  };

  const handleSetDarkTheme = () => {
    dispatch(setThemeMode('dark'));
    setOpen(false);
  };

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
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Theme">
            <CommandItem onSelect={handleToggleTheme}>
              <Monitor className="mr-2 h-4 w-4" />
              <span>Toggle Theme</span>
              <CommandShortcut>⌘T</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleSetLightTheme}>
              <Sun className="mr-2 h-4 w-4" />
              <span>Set Light Theme</span>
              <CommandShortcut>⌘⇧L</CommandShortcut>
            </CommandItem>
            <CommandItem onSelect={handleSetDarkTheme}>
              <Moon className="mr-2 h-4 w-4" />
              <span>Set Dark Theme</span>
              <CommandShortcut>⌘⇧D</CommandShortcut>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}
