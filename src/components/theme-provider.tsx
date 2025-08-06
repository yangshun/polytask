'use client';

import { useEffect } from 'react';
import { ThemeProvider as NextThemesProvider, useTheme } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

import { useAppSelector } from '~/lib/hooks';

// Internal component to sync Redux with next-themes
function ThemeSync() {
  const reduxTheme = useAppSelector((state) => state.theme.mode);
  const { theme, setTheme } = useTheme();

  // Sync Redux state to next-themes
  useEffect(() => {
    if (theme !== reduxTheme) {
      setTheme(reduxTheme);
    }
  }, [reduxTheme, theme, setTheme]);

  return null;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider {...props}>
      <ThemeSync />
      {children}
    </NextThemesProvider>
  );
}
