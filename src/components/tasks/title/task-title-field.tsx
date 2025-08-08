import { useRef, useEffect, useState } from 'react';
import { cn } from '~/lib/utils';

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
  const lastPropValue = useRef(value);

  // Sync buffer with prop value if it changes from outside
  useEffect(() => {
    if (value !== lastPropValue.current) {
      setBuffer(value);
      if (titleRef.current && titleRef.current.textContent !== value) {
        titleRef.current.textContent = value;
      }

      lastPropValue.current = value;
    }
  }, [value]);

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
    if (buffer !== value) {
      onChange(buffer);
    }

    onBlur?.();
  }

  return (
    <div
      tabIndex={0}
      contentEditable
      role="textbox"
      aria-multiline={false}
      suppressContentEditableWarning
      ref={titleRef}
      className={cn(
        'flex w-full min-w-0 rounded-md py-1 text-base font-medium',
        'focus-visible:border-none focus-visible:ring-transparent focus-visible:outline-0',
        'selection:bg-primary selection:text-primary-foreground',
      )}
      onInput={handleInput}
      onBlur={handleBlur}
      {...props}
    />
  );
}
