'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';

import { Button } from '~/components/ui/button';
import { cn } from '~/lib/utils';

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled>
        <Sun className="h-[1.2rem] w-[1.2rem]" />
        <span className="sr-only">Toggle theme</span>
      </Button>
    );
  }

  return (
    <Button
      variant="outline"
      size="icon"
      onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
      <Sun className={cn(
        "h-[1.2rem] w-[1.2rem] transition-all duration-300",
        theme === 'dark' ? 'rotate-90 scale-0' : 'rotate-0 scale-100'
      )} />
      <Moon className={cn(
        "absolute h-[1.2rem] w-[1.2rem] transition-all duration-300",
        theme === 'dark' ? 'rotate-0 scale-100' : '-rotate-90 scale-0'
      )} />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}