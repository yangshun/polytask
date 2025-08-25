import { useEffect } from 'react';
import { handleKeyboardEvent } from './handle-keyboard-event';

export function useKeyboardShortcuts() {
  useEffect(() => {
    document.addEventListener('keydown', handleKeyboardEvent);
    return () => document.removeEventListener('keydown', handleKeyboardEvent);
  }, []);
}
