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
import { commandsRegistry, ScopeConfig, ScopeParam } from './commands-registry';
import { useKeyboardShortcuts } from '~/components/shortcuts/use-keyboard-shortcuts';

interface CommandsContextValue {
  commands: Command[];
  registerCommand: (
    command: Command,
    scope?: ScopeConfig['name'],
  ) => () => void;
  unregisterCommand: (commandId: string, scope?: ScopeConfig['name']) => void;
  setScope: (scope: ScopeParam) => void;
  clearScope: () => void;
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

  const registerCommand = useCallback(
    (command: Command, scope?: ScopeConfig['name']) => {
      commandsRegistry.register(command, scope);
      return () => {
        commandsRegistry.unregister(command.id, scope);
      };
    },
    [],
  );

  const unregisterCommand = useCallback(
    (commandId: string, scope?: ScopeConfig['name']) => {
      commandsRegistry.unregister(commandId, scope);
    },
    [],
  );

  const setScope = useCallback((scope: ScopeParam) => {
    commandsRegistry.setScope(scope);
  }, []);

  const clearScope = useCallback(() => {
    commandsRegistry.clearScope();
  }, []);

  const contextValue = useMemo(
    () => ({
      commands,
      registerCommand,
      unregisterCommand,
      setScope,
      clearScope,
    }),
    [commands, registerCommand, unregisterCommand, setScope, clearScope],
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
