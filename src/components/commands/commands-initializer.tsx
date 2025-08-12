'use client';

import { useEffect } from 'react';
import { useCommands } from '~/components/commands/commands-context';
import { useKeyboardShortcuts } from '~/components/shortcuts/use-keyboard-shortcuts';
import {
  themeToggleCommandCreator,
  themeSetLightCommandCreator,
  themeSetDarkCommandCreator,
} from '~/components/theme/theme-commands';

export function CommandsInitializer() {
  const { registerCommand } = useCommands();

  // Set up keyboard shortcuts
  useKeyboardShortcuts();

  useEffect(() => {
    // Register theme commands
    const unregisterToggle = registerCommand(themeToggleCommandCreator());
    const unregisterLight = registerCommand(themeSetLightCommandCreator());
    const unregisterDark = registerCommand(themeSetDarkCommandCreator());

    // Cleanup on unmount
    return () => {
      unregisterToggle();
      unregisterLight();
      unregisterDark();
    };
  }, [registerCommand]);

  return null; // This component doesn't render anything
}
