export function formatShortcut(shortcut: string) {
  return shortcut
    .replace('cmd', '⌘')
    .replace('shift', '⇧')
    .replace('alt', '⌥')
    .replace('ctrl', '⌃')
    .replace('ArrowUp', '↑')
    .replace('ArrowDown', '↓')
    .replace('enter', '↵')
    .replace('+', '')
    .toUpperCase();
}
