import { RiMacbookLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import { CommandCreator } from '~/actions/types';
import { setTheme, toggleTheme } from '~/store/features/theme/theme-slice';
import { store } from '~/store/store';

export const themeToggleCommand: CommandCreator = () => ({
  id: 'theme.toggle',
  name: 'Toggle theme',
  icon: RiMacbookLine,
  shortcut: 't',
  group: 'theme',
  description: 'Switch between light and dark mode',
  action: () => store.dispatch(toggleTheme()),
  commandPalette: true,
});

export const themeSetDarkCommand: CommandCreator = () => ({
  id: 'theme.dark',
  name: 'Set dark theme',
  shortcut: 'd',
  icon: RiMoonLine,
  group: 'theme',
  description: 'Set to dark theme',
  action: () => store.dispatch(setTheme('dark')),
  commandPalette: true,
});

export const themeSetLightCommand: CommandCreator = () => ({
  id: 'theme.light',
  name: 'Set light theme',
  icon: RiSunLine,
  shortcut: 'l',
  group: 'theme',
  description: 'Set to light theme',
  action: () => store.dispatch(setTheme('light')),
  commandPalette: true,
});
