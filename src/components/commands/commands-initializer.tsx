'use client';

import { useEffect } from 'react';
import { useCommands } from '~/components/commands/commands-context';
import { useKeyboardShortcuts } from '~/components/shortcuts/use-keyboard-shortcuts';
import {
  themeToggleCommand,
  themeSetLightCommand,
  themeSetDarkCommand,
} from '~/components/theme/theme-commands';

export function CommandsInitializer() {
  const { registerCommand } = useCommands();

  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Register theme commands
    const unregisterToggle = registerCommand(themeToggleCommand());
    const unregisterLight = registerCommand(themeSetLightCommand());
    const unregisterDark = registerCommand(themeSetDarkCommand());

    // Cleanup on unmount
    return () => {
      unregisterToggle();
      unregisterLight();
      unregisterDark();
    };
  }, [registerCommand]);

  return null; // This component doesn't render anything
}
