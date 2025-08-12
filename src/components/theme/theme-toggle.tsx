'use client';

import { useEffect, useState } from 'react';

import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setTheme } from '~/store/features/theme/theme-slice';
import {
  themeSetDarkCommandData,
  themeSetLightCommandData,
  themeToggleCommandData,
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

  if (!mounted) {
    return (
      <Button
        icon={themeSetDarkCommandData.icon}
        variant="outline"
        size="sm"
        disabled>
        <span className="sr-only">{themeToggleCommandData.name}</span>
      </Button>
    );
  }

  return (
    <Button
      icon={
        theme === 'light'
          ? themeSetLightCommandData.icon
          : themeSetDarkCommandData.icon
      }
      shortcut={themeToggleCommandData.shortcut}
      tooltip={themeToggleCommandData.name}
      variant={theme === 'light' ? 'outline' : 'secondary'}
      size="sm"
      onClick={handleThemeToggle}>
      <span className="sr-only">{themeToggleCommandData.name}</span>
    </Button>
  );
}
