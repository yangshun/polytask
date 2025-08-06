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
  const { registerCommand } = useCommandsRegistry();

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
