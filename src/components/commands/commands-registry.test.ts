import { describe, expect, it, beforeEach, vi } from 'vitest';
import { Command } from './types';
import { commandsRegistry } from './commands-registry';

function makeCommand(overrides: Partial<Command> = {}): Command {
  return {
    id: 'test-cmd',
    name: 'Test Command',
    icon: (() => null) as any,
    action: vi.fn(),
    commandPalette: true,
    ...overrides,
  };
}

describe('CommandsRegistry', () => {
  beforeEach(() => {
    commandsRegistry.clear();
    commandsRegistry.clearScope();
  });

  describe('register / unregister', () => {
    it('registers and retrieves a command', () => {
      const cmd = makeCommand();
      commandsRegistry.register(cmd, 'global');
      expect(commandsRegistry.getCommand('test-cmd', 'global')).toBe(cmd);
    });

    it('throws on duplicate registration', () => {
      const cmd = makeCommand();
      commandsRegistry.register(cmd, 'global');
      expect(() => commandsRegistry.register(cmd, 'global')).toThrow(
        /already exists/,
      );
    });

    it('unregisters a command', () => {
      commandsRegistry.register(makeCommand(), 'global');
      commandsRegistry.unregister('test-cmd', 'global');
      expect(commandsRegistry.getCommand('test-cmd', 'global')).toBeUndefined();
    });

    it('getAllCommands returns all registered commands', () => {
      commandsRegistry.register(makeCommand({ id: 'a' }), 'global');
      commandsRegistry.register(makeCommand({ id: 'b' }), 'global');
      expect(commandsRegistry.getAllCommands('global')).toHaveLength(2);
    });
  });

  describe('keyboard shortcuts', () => {
    it('finds a command by shortcut', () => {
      const cmd = makeCommand({ shortcut: 'cmd+k' });
      commandsRegistry.register(cmd, 'global');
      expect(commandsRegistry.getCommandByShortcut('cmd+k')).toBe(cmd);
    });

    it('shortcut lookup is case-insensitive', () => {
      const cmd = makeCommand({ shortcut: 'Cmd+K' });
      commandsRegistry.register(cmd, 'global');
      expect(commandsRegistry.getCommandByShortcut('cmd+k')).toBe(cmd);
    });

    it('removes shortcut on unregister', () => {
      commandsRegistry.register(makeCommand({ shortcut: 'cmd+k' }), 'global');
      commandsRegistry.unregister('test-cmd', 'global');
      expect(commandsRegistry.getCommandByShortcut('cmd+k')).toBeUndefined();
    });
  });

  describe('scoped commands', () => {
    it('looks up scoped commands first', () => {
      const globalCmd = makeCommand({ id: 'cmd', shortcut: 'cmd+k' });
      const scopedCmd = makeCommand({ id: 'cmd', shortcut: 'cmd+k' });
      commandsRegistry.register(globalCmd, 'global');
      commandsRegistry.register(scopedCmd, 'editor');

      commandsRegistry.setScope('editor');
      expect(commandsRegistry.getCommandByShortcut('cmd+k')).toBe(scopedCmd);
    });

    it('falls back to global when scope does not have the shortcut', () => {
      const globalCmd = makeCommand({ shortcut: 'cmd+k' });
      commandsRegistry.register(globalCmd, 'global');
      commandsRegistry.register(
        makeCommand({ id: 'other', shortcut: 'cmd+j' }),
        'editor',
      );

      commandsRegistry.setScope('editor');
      expect(commandsRegistry.getCommandByShortcut('cmd+k')).toBe(globalCmd);
    });

    it('does not fall back to global when allowGlobalKeybindings is false', () => {
      const globalCmd = makeCommand({ shortcut: 'cmd+k' });
      commandsRegistry.register(globalCmd, 'global');

      commandsRegistry.setScope({
        name: 'modal',
        allowGlobalKeybindings: false,
      });
      expect(commandsRegistry.getCommandByShortcut('cmd+k')).toBeUndefined();
    });
  });

  describe('scope management', () => {
    it('sets scope from string', () => {
      commandsRegistry.setScope('editor');
      expect(commandsRegistry.scope).toEqual({
        name: 'editor',
        allowGlobalKeybindings: true,
      });
    });

    it('sets scope from config object', () => {
      commandsRegistry.setScope({
        name: 'modal',
        allowGlobalKeybindings: false,
      });
      expect(commandsRegistry.scope?.name).toBe('modal');
      expect(commandsRegistry.scope?.allowGlobalKeybindings).toBe(false);
    });

    it('clears scope', () => {
      commandsRegistry.setScope('editor');
      commandsRegistry.clearScope();
      expect(commandsRegistry.scope).toBeNull();
    });
  });

  describe('listeners', () => {
    it('notifies listeners on register', () => {
      const listener = vi.fn();
      commandsRegistry.subscribe(listener);
      commandsRegistry.register(makeCommand(), 'global');
      expect(listener).toHaveBeenCalledOnce();
    });

    it('notifies listeners on unregister', () => {
      commandsRegistry.register(makeCommand(), 'global');
      const listener = vi.fn();
      commandsRegistry.subscribe(listener);
      commandsRegistry.unregister('test-cmd', 'global');
      expect(listener).toHaveBeenCalledOnce();
    });

    it('unsubscribes correctly', () => {
      const listener = vi.fn();
      const unsub = commandsRegistry.subscribe(listener);
      unsub();
      commandsRegistry.register(makeCommand(), 'global');
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
