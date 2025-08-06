import { Monitor, Moon, Sun } from 'lucide-react';
import { CommandCreator } from '~/actions/types';
import { setTheme, toggleTheme } from '~/store/features/theme/theme-slice';

export const themeToggleCommand: CommandCreator = () => ({
  id: 'theme.toggle',
  name: 'Toggle theme',
  icon: Monitor,
  shortcut: 't',
  group: 'theme',
  description: 'Switch between light and dark mode',
  action: () => toggleTheme(),
});

export const themeSetDarkCommand: CommandCreator = () => ({
  id: 'theme.dark',
  name: 'Set dark theme',
  shortcut: 'd',
  icon: Moon,
  group: 'theme',
  description: 'Set to dark theme',
  action: () => setTheme('dark'),
});

export const themeSetLightCommand: CommandCreator = () => ({
  id: 'theme.light',
  name: 'Set light theme',
  icon: Sun,
  shortcut: 'l',
  group: 'theme',
  description: 'Set to light theme',
  action: () => setTheme('light'),
});
