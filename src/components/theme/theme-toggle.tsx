'use client';

import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';

import { Button } from '~/components/ui/button';
import { useAppDispatch, useAppSelector } from '~/store/hooks';
import { setTheme } from '~/store/features/theme/theme-slice';
import { cn } from '~/lib/utils';

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
      <Button variant="outline" size="icon" disabled>
        <Sun className="size-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button variant="outline" size="icon" onClick={handleThemeToggle}>
      {theme === 'light' ? (
        <Sun className={cn('size-[1.2rem] transition-all duration-300')} />
      ) : (
        <Moon className={cn('size-[1.2rem] transition-all duration-300')} />
      )}
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
