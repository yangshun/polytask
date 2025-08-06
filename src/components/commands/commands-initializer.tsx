'use client';

import { useEffect } from 'react';
import { useCommandsRegistry } from '~/components/commands/commands-context';
import { useKeyboardShortcuts } from '~/lib/use-keyboard-shortcuts';
import {
  themeToggleCommand,
  themeSetLightCommand,
  themeSetDarkCommand,
} from '~/components/theme/theme-commands';

export function CommandsInitializer() {
  const { registerCommand, unregisterCommand } = useCommandsRegistry();

  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Register theme commands
    registerCommand(themeToggleCommand);
    registerCommand(themeSetLightCommand);
    registerCommand(themeSetDarkCommand);

    // Cleanup on unmount
    return () => {
      unregisterCommand(themeToggleCommand.id);
      unregisterCommand(themeSetLightCommand.id);
      unregisterCommand(themeSetDarkCommand.id);
    };
  }, [registerCommand, unregisterCommand]);

  return null; // This component doesn't render anything
}
