import { useState, useEffect } from 'react';
import { Textarea } from '~/components/ui/textarea';
import { Label } from '~/components/ui/label';

export type TaskDescriptionFieldProps = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  id?: string;
  placeholder?: string;
};

export function TaskDescriptionField({
  value,
  onChange,
  onBlur,
  id = 'description',
  placeholder = 'Add a description...',
}: TaskDescriptionFieldProps) {
  const [buffer, setBuffer] = useState(value);

  useEffect(() => {
    setBuffer(value);
  }, [value]);

  function handleBlur() {
    if (buffer !== value) {
      onChange(buffer);
    }

    onBlur?.();
  }

  return (
    <div className="grid w-full gap-3">
      <Label htmlFor={id}>Description</Label>
      <Textarea
        id={id}
        value={buffer}
        onChange={(e) => setBuffer(e.target.value)}
        onBlur={handleBlur}
        placeholder={placeholder}
      />
    </div>
  );
}
