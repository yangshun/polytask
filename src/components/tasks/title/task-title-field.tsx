import { useRef, useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export type TaskTitleFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
} & Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>;

export function TaskTitleField({
  value,
  onChange,
  onBlur,
  ...props
}: TaskTitleFieldProps) {
  const titleRef = useRef<HTMLDivElement | null>(null);
  const [buffer, setBuffer] = useState(value);
  const [prevValue, setPrevValue] = useState(value);

  // Sync buffer with prop value if it changes from outside
  if (value !== prevValue) {
    setPrevValue(value);
    setBuffer(value);
  }

  // Keep DOM in sync with buffer
  useEffect(() => {
    if (titleRef.current && titleRef.current.textContent !== buffer) {
      titleRef.current.textContent = buffer;
    }
  }, [buffer]);

  function handleInput(e: React.FormEvent<HTMLDivElement>) {
    setBuffer(e.currentTarget.textContent ?? '');
  }

  function handleBlur() {
    if (buffer === '') {
      setBuffer(value);
    } else if (buffer !== value) {
      onChange(buffer);
    }

    onBlur?.();
  }

  return (
    <div className="relative w-full text-xl font-bold">
      {buffer.length === 0 && (
        <div
          className="pointer-events-none absolute top-0 py-1 text-muted-foreground"
          aria-hidden={true}>
          Enter task title...
        </div>
      )}
      <div
        tabIndex={0}
        contentEditable={true}
        role="textbox"
        aria-multiline={false}
        suppressContentEditableWarning
        ref={titleRef}
        className={cn(
          'w-full py-1',
          'whitespace-nowrap',
          'focus-visible:border-none focus-visible:ring-transparent focus-visible:outline-0',
          'selection:bg-primary selection:text-primary-foreground',
        )}
        onInput={handleInput}
        onBlur={handleBlur}
        {...props}
      />
    </div>
  );
}
