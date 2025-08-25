import { Command } from '~/components/commands/types';

type CommandId = string;
type ScopeName = string;
export type ScopeConfig = Readonly<{
  name: ScopeName;
  allowGlobalKeybindings: boolean;
}>;
export type ScopeParam = ScopeName | ScopeConfig;
type Registry = {
  commands: Map<CommandId, Command>;
  keyboardShortcuts: Map<string, CommandId>;
};

const GLOBAL_SCOPE: ScopeName = 'global';
class CommandsRegistry {
  scope: ScopeConfig | null = null;
  private scopedRegistry: Map<ScopeName, Registry> = new Map();

  private listeners: Set<() => void> = new Set();

  setScope(scope: ScopeName | ScopeConfig) {
    this.scope =
      typeof scope === 'string'
        ? { name: scope, allowGlobalKeybindings: true }
        : scope;
  }

  clearScope() {
    this.scope = null;
  }

  private getCurrentScopeRegistry(scopeParam?: ScopeName): Registry {
    const scope = scopeParam || this.scope?.name || GLOBAL_SCOPE;

    const registry = this.scopedRegistry.get(scope) ?? {
      commands: new Map(),
      keyboardShortcuts: new Map(),
    };
    this.scopedRegistry.set(scope, registry);

    return registry;
  }

  register(command: Command, scope?: ScopeName) {
    const registry = this.getCurrentScopeRegistry(scope);
    if (registry.commands.has(command.id)) {
      throw new Error(`Command "${command.id}" already exists in "${scope}"`);
    }

    registry.commands.set(command.id, command);

    if (command.shortcut) {
      registry.keyboardShortcuts.set(
        command.shortcut.toLowerCase(),
        command.id,
      );
    }

    this.notifyListeners();
  }

  unregister(commandId: string, scope?: ScopeName) {
    const registry = this.getCurrentScopeRegistry(scope);
    const command = registry.commands.get(commandId);

    if (command?.shortcut) {
      registry.keyboardShortcuts.delete(command.shortcut.toLowerCase());
    }

    registry.commands.delete(commandId);
    this.notifyListeners();
  }

  getCommand(commandId: string, scope?: ScopeName): Command | undefined {
    const registry = this.getCurrentScopeRegistry(scope);

    return registry.commands.get(commandId);
  }

  getAllCommands(scope?: ScopeName): Command[] {
    // TODO: Merge current + global commands.
    const registry = this.getCurrentScopeRegistry(scope);

    return Array.from(registry.commands.values());
  }

  /**
   * Get command corresponding to the current scope or global scope it does not exist in the current scope
   */
  getCommandByShortcut(shortcut: string): Command | undefined {
    // Try current scope first
    if (this.scope != null) {
      const registry = this.getCurrentScopeRegistry(this.scope.name);
      const commandId = registry.keyboardShortcuts.get(shortcut.toLowerCase());
      if (commandId) {
        return registry.commands.get(commandId);
      }

      if (!this.scope.allowGlobalKeybindings) {
        return;
      }
    }

    // Try global scope
    const registry = this.getCurrentScopeRegistry(GLOBAL_SCOPE);
    const commandId = registry.keyboardShortcuts.get(shortcut.toLowerCase());
    return commandId ? registry.commands.get(commandId) : undefined;
  }

  clear() {
    this.scopedRegistry.clear();
    this.notifyListeners();
  }

  // Subscribe to changes in the registry
  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((listener) => listener());
  }
}

// Global registry instance
export const commandsRegistry = new CommandsRegistry();
