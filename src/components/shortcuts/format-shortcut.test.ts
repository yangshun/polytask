import { describe, expect, it } from 'vitest';
import { formatShortcut } from './format-shortcut';

describe('formatShortcut', () => {
  it('replaces Cmd with ⌘', () => {
    expect(formatShortcut('Cmd+K')).toBe('⌘K');
  });

  it('replaces Shift with ⇧', () => {
    expect(formatShortcut('Shift+A')).toBe('⇧A');
  });

  it('replaces Alt with ⌥', () => {
    expect(formatShortcut('Alt+T')).toBe('⌥T');
  });

  it('replaces Ctrl with ⌃', () => {
    expect(formatShortcut('Ctrl+C')).toBe('⌃C');
  });

  it('replaces arrow keys', () => {
    expect(formatShortcut('ArrowUp')).toBe('↑');
    expect(formatShortcut('ArrowDown')).toBe('↓');
  });

  it('replaces Enter with ↵', () => {
    expect(formatShortcut('Enter')).toBe('↵');
  });

  it('replaces Backspace with ⌫', () => {
    expect(formatShortcut('Backspace')).toBe('⌫');
  });

  it('replaces Escape with Esc', () => {
    expect(formatShortcut('Escape')).toBe('Esc');
  });

  it('handles compound shortcuts', () => {
    expect(formatShortcut('Cmd+Shift+K')).toBe('⌘⇧K');
  });

  it('removes all + separators', () => {
    expect(formatShortcut('Cmd+Alt+Shift+Z')).toBe('⌘⌥⇧Z');
  });

  it('passes through plain keys', () => {
    expect(formatShortcut('K')).toBe('K');
  });
});
