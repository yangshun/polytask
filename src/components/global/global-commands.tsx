'use client';

import { useEffect } from 'react';
import { useCommands } from '~/components/commands/commands-context';
import {
  themeToggleCommandCreator,
  themeSetLightCommandCreator,
  themeSetDarkCommandCreator,
} from '~/components/theme/theme-commands';
import { aiChatToggleCommandCreator } from '~/components/ai/ai-chat-commands';

// Technically it can just be a hook
export function GlobalCommands() {
  const { registerCommand } = useCommands();

  useEffect(() => {
    // Register theme commands
    const unregisterToggle = registerCommand(themeToggleCommandCreator());
    const unregisterLight = registerCommand(themeSetLightCommandCreator());
    const unregisterDark = registerCommand(themeSetDarkCommandCreator());
    const unregisterAiChat = registerCommand(aiChatToggleCommandCreator());

    // Cleanup on unmount
    return () => {
      unregisterToggle();
      unregisterLight();
      unregisterDark();
      unregisterAiChat();
    };
  }, [registerCommand]);

  return null; // This component doesn't render anything
}
