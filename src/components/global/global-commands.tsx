'use client';

import { useEffect } from 'react';
import { useCommands } from '~/components/commands/commands-context';
import {
  themeToggleCommandCreator,
  themeSetLightCommandCreator,
  themeSetDarkCommandCreator,
} from '~/components/theme/theme-commands';

// Technically it can just be a hook
export function GlobalCommands() {
  const { registerCommand } = useCommands();

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
