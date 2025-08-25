import { commandsRegistry } from '../commands/commands-registry';

export function handleKeyboardEvent(event: KeyboardEvent) {
  // If another handler has already claimed this key, do nothing
  if (event.defaultPrevented) {
    return;
  }

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
    command.action();
  }
}
