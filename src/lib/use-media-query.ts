import { useSyncExternalStore } from 'react';

export function useMediaQuery(query: string, defaultValue: boolean): boolean {
  return useSyncExternalStore(
    (callback) => {
      const matchMedia = window.matchMedia(query);
      matchMedia.addEventListener('change', callback);
      return () => {
        matchMedia.removeEventListener('change', callback);
      };
    },
    () => window.matchMedia(query).matches,
    () => defaultValue,
  );
}
