'use client';

import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setTheme } from '~/store/features/theme/theme-slice';
import {
  themeSetDarkCommand,
  themeSetLightCommand,
  themeToggleCommand,
} from './theme-commands';

export function ThemeToggle() {
  const dispatch = useAppDispatch();
  const theme = useAppSelector((state) => state.theme.mode);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  function handleThemeToggle() {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    dispatch(setTheme(newTheme));
  }

  const themeToggleCommandObject = themeToggleCommand();
  const themeSetDarkCommandObject = themeSetDarkCommand();
  const themeSetLightCommandObject = themeSetLightCommand();

  if (!mounted) {
    return (
      <Button
        icon={themeSetDarkCommandObject.icon}
        variant="outline"
        size="sm"
        disabled>
        <span className="sr-only">{themeToggleCommandObject.name}</span>
      </Button>
    );
  }

  return (
    <Button
      icon={
        theme === 'light'
          ? themeSetLightCommandObject.icon
          : themeSetDarkCommandObject.icon
      }
      shortcut={themeToggleCommandObject.shortcut}
      tooltip={themeToggleCommandObject.name}
      variant={theme === 'light' ? 'outline' : 'secondary'}
      size="sm"
      onClick={handleThemeToggle}>
      <span className="sr-only">{themeToggleCommandObject.name}</span>
    </Button>
  );
}
