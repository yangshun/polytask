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

interface CommandsContextValue {
  commands: Command[];
  getCommandsByGroup: (group: string) => Command[];
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

  useEffect(() => {
    const updateCommands = () => {
      setCommands(commandsRegistry.getAllCommands());
    };

    // Initial load
    updateCommands();

    // Subscribe to changes
    const unsubscribe = commandsRegistry.subscribe(updateCommands);

    return unsubscribe;
  }, []);

  const getCommandsByGroup = useCallback(
    (group: string) => commands.filter((command) => command.group === group),
    [commands],
  );

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
      getCommandsByGroup,
      registerCommand,
      unregisterCommand,
    }),
    [commands, getCommandsByGroup, registerCommand, unregisterCommand],
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
