import { useEffect } from 'react';
import { useAppDispatch } from '~/store/hooks';
import { commandsRegistry } from '../components/commands/commands-registry';

export function useKeyboardShortcuts() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    function isWithinInteractiveOverlay(el: HTMLElement | null): boolean {
      const roles = new Set([
        'menu',
        'listbox',
        'combobox',
        'dialog',
        'tree',
        'grid',
        'menuitem',
        'option',
      ]);
      let node: HTMLElement | null = el;
      while (node) {
        const role = node.getAttribute('role');
        if (role && roles.has(role)) return true;
        // cmdk / command palette markers
        if (node.dataset?.slot === 'command') return true;
        node = node.parentElement;
      }
      return false;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      // If another handler has already claimed this key, do nothing
      if (event.defaultPrevented) return;

      // Don't trigger shortcuts when user is typing in form elements
      const target = event.target as HTMLElement;
      if (
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'TEXTAREA' ||
          target.tagName === 'SELECT' ||
          target.contentEditable === 'true' ||
          target.isContentEditable)
      ) {
        return;
      }

      // If navigating inside interactive overlays (e.g., context menus, lists),
      // don't handle ArrowUp/ArrowDown globally
      if (
        (event.key === 'ArrowUp' || event.key === 'ArrowDown') &&
        isWithinInteractiveOverlay(target)
      ) {
        return;
      }

      // Check for command palette shortcut (Cmd/Ctrl + K)
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        // Let the command palette component handle this
        return;
      }

      // Check for registered command shortcuts
      const modifiers: string[] = [];
      if (event.metaKey || event.ctrlKey) {
        modifiers.push('cmd');
      }
      if (event.shiftKey) {
        modifiers.push('shift');
      }
      if (event.altKey) {
        modifiers.push('alt');
      }

      // Create shortcut string (e.g., "cmd+t", "cmd+shift+l")
      const base = modifiers.join('+');
      const shortcut = base ? `${base}+${event.key.toLowerCase()}` : event.key;

      const command = commandsRegistry.getCommandByShortcut(shortcut);

      if (command) {
        event.preventDefault();
        event.stopPropagation();
        dispatch(command.action());
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);
}
