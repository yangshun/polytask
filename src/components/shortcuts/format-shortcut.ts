export function formatShortcut(shortcut: string) {
  return shortcut
    .replace('Cmd', '⌘')
    .replace('Shift', '⇧')
    .replace('Alt', '⌥')
    .replace('Ctrl', '⌃')
    .replace('ArrowUp', '↑')
    .replace('ArrowDown', '↓')
    .replace('Enter', '↵')
    .replace('Backspace', '⌫')
    .replace('Escape', 'Esc')
    .replaceAll('+', '')
    .toUpperCase();
}
