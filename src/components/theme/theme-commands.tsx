import { Monitor, Moon, Sun } from 'lucide-react';
import { Command } from '~/actions/types';
import { setTheme, toggleTheme } from '~/store/features/theme/theme-slice';

export const themeToggleCommand: Command = {
  id: 'theme.toggle',
  name: 'Toggle theme',
  icon: Monitor,
  shortcut: 't',
  group: 'theme',
  description: 'Switch between light and dark mode',
  action: () => toggleTheme(),
};

export const themeSetDarkCommand: Command = {
  id: 'theme.dark',
  name: 'Set dark theme',
  shortcut: 'd',
  icon: Moon,
  group: 'theme',
  description: 'Set to dark theme',
  action: () => setTheme('dark'),
};

export const themeSetLightCommand: Command = {
  id: 'theme.light',
  name: 'Set light theme',
  icon: Sun,
  shortcut: 'l',
  group: 'theme',
  description: 'Set to light theme',
  action: () => setTheme('light'),
};
