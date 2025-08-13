import { RiMacbookLine, RiMoonLine, RiSunLine } from 'react-icons/ri';
import type { CommandCreator, CommandData } from '~/components/commands/types';
import { setTheme, toggleTheme } from '~/store/features/theme/theme-slice';
import { store } from '~/store/store';

// Toggle theme
export const themeToggleCommandData: CommandData = {
  id: 'theme.toggle',
  name: 'Toggle theme',
  icon: RiMacbookLine,
  shortcut: 'T',
  group: 'theme',
  description: 'Switch between light and dark mode',
};
export const themeToggleCommandCreator: CommandCreator = () => ({
  ...themeToggleCommandData,
  action: () => store.dispatch(toggleTheme()),
  commandPalette: true,
});

// Set dark theme
export const themeSetDarkCommandData: CommandData = {
  id: 'theme.dark',
  name: 'Set dark theme',
  shortcut: 'D',
  icon: RiMoonLine,
  group: 'theme',
  description: 'Set to dark theme',
};
export const themeSetDarkCommandCreator: CommandCreator = () => ({
  ...themeSetDarkCommandData,
  action: () => store.dispatch(setTheme('dark')),
  commandPalette: true,
});

// Set light theme
export const themeSetLightCommandData: CommandData = {
  id: 'theme.light',
  name: 'Set light theme',
  icon: RiSunLine,
  shortcut: 'L',
  group: 'theme',
  description: 'Set to light theme',
};
export const themeSetLightCommandCreator: CommandCreator = () => ({
  ...themeSetLightCommandData,
  action: () => store.dispatch(setTheme('light')),
  commandPalette: true,
});
