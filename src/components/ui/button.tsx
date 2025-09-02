import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '~/lib/utils';
import { Tooltip, TooltipTrigger, TooltipContent } from './tooltip';
import { ShortcutKeys } from '../shortcuts/shortcut-keys';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-sm font-medium ring-offset-background transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive:
          'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline:
          'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        secondary:
          'bg-secondary text-secondary-foreground hover:bg-secondary/80',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-4 py-2 text-sm',
        xs: 'h-6 px-2 text-xs',
        sm: 'h-8 px-2 text-sm',
        lg: 'h-10 px-2 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  icon?: React.ElementType;
  iconClassname?: string;
  tooltip?: string;
  shortcut?: string;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      children,
      variant,
      size,
      asChild = false,
      tooltip,
      shortcut,
      icon: Icon,
      iconClassname,
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button';

    const button = (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}>
        {Icon && (
          <Icon
            className={cn(
              'size-4 shrink-0',
              variant === 'ghost' && 'text-muted-foreground',
              iconClassname,
            )}
          />
        )}
        {children}
      </Comp>
    );

    if (tooltip) {
      return (
        <Tooltip>
          <TooltipTrigger asChild>{button}</TooltipTrigger>
          <TooltipContent>
            {tooltip} {shortcut && <ShortcutKeys shortcut={shortcut} />}
          </TooltipContent>
        </Tooltip>
      );
    }

    return button;
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
