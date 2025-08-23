'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { Command } from '~/components/commands/types';
import { commandsRegistry } from './commands-registry';
import { useKeyboardShortcuts } from '~/components/shortcuts/use-keyboard-shortcuts';

interface CommandsContextValue {
  commands: Command[];
  registerCommand: (command: Command) => () => void;
  unregisterCommand: (commandId: string) => void;
}

const CommandsContext = createContext<CommandsContextValue | undefined>(
  undefined,
);

interface CommandsProviderProps {
  children: ReactNode;
}

export function CommandsProvider({ children }: CommandsProviderProps) {
  const [commands, setCommands] = useState<Command[]>([]);

  useKeyboardShortcuts();

  useEffect(() => {
    function updateCommands() {
      setCommands(commandsRegistry.getAllCommands());
    }

    // Initial load
    updateCommands();

    // Subscribe to changes
    return commandsRegistry.subscribe(updateCommands);
  }, []);

  const registerCommand = useCallback((command: Command) => {
    commandsRegistry.register(command);

    return () => {
      commandsRegistry.unregister(command.id);
    };
  }, []);

  const unregisterCommand = useCallback((commandId: string) => {
    commandsRegistry.unregister(commandId);
  }, []);

  const contextValue = useMemo(
    () => ({
      commands,
      registerCommand,
      unregisterCommand,
    }),
    [commands, registerCommand, unregisterCommand],
  );

  return (
    <CommandsContext.Provider value={contextValue}>
      {children}
    </CommandsContext.Provider>
  );
}

export function useCommands(): CommandsContextValue {
  const context = useContext(CommandsContext);

  if (context === undefined) {
    throw new Error(
      'useCommandsRegistry must be used within a CommandsProvider',
    );
  }

  return context;
}
