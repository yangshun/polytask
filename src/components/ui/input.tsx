import * as React from 'react';

import { cn } from '~/lib/utils';

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        // Layout and sizing
        'flex h-9 w-full min-w-0 rounded-md px-3 py-1 text-base md:text-sm',
        // Border and background
        'border bg-transparent border-input dark:bg-input/30',
        // Text and placeholder
        'placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground',
        // File input styles
        'file:text-foreground file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium',
        // State and transition
        'shadow-xs transition-[color,box-shadow] outline-none',
        // Focus and accessibility
        'focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]',
        // Disabled state
        'disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        // Validation state
        'aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive',
        className,
      )}
      {...props}
    />
  );
}

export { Input };
