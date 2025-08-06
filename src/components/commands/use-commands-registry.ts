import { useEffect, useState } from 'react';
import { Command } from '~/actions/types';
import { commandsRegistry } from './commands-registry';

export function useCommandsRegistry() {
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

  return {
    commands,
    getCommandsByGroup: (group: string) =>
      commands.filter((command) => command.group === group),
    registerCommand: (command: Command) => commandsRegistry.register(command),
    unregisterCommand: (commandId: string) =>
      commandsRegistry.unregister(commandId),
  };
}
