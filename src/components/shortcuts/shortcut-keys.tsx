import { cn } from '~/lib/utils';
import { formatShortcut } from './format-shortcut';

export function ShortcutKeys({ shortcut }: { shortcut: string }) {
  return (
    <span className="inline-flex items-center gap-0.5 ml-1">
      {shortcut.split('+').map((key) => (
        <kbd
          key={key}
          className={cn(
            'flex items-center justify-center',
            'h-4 px-1',
            'border border-muted-foreground',
            'rounded',
            'text-xs',
          )}>
          {formatShortcut(key).toLocaleUpperCase()}
        </kbd>
      ))}
    </span>
  );
}
