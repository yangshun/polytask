import { useEffect } from 'react';
import { useAppDispatch } from '~/store/hooks';
import { commandsRegistry } from '../components/commands/commands-registry';

export function useKeyboardShortcuts() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
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

      // Check for command palette shortcut (Cmd/Ctrl + K)
      if (event.key === 'k' && (event.metaKey || event.ctrlKey)) {
        // Let the command palette component handle this
        return;
      }

      // Check for registered command shortcuts
      const modifiers = [];
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
      const shortcut =
        modifiers.length > 0
          ? `${modifiers.join('+')}+${event.key.toLowerCase()}`
          : event.key.toLowerCase();

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
