import { useCallback, useEffect, useState } from 'react';

function getMatches(q: string, defaultValue: boolean): boolean {
  if (typeof window !== 'undefined') {
    return window.matchMedia(q).matches;
  }

  return defaultValue;
}

export function useMediaQuery(query: string, defaultValue: boolean): boolean {
  const [matches, setMatches] = useState<boolean>(
    getMatches(query, defaultValue),
  );

  const handleChange = useCallback(() => {
    setMatches(getMatches(query, defaultValue));
  }, [query, defaultValue]);

  useEffect(() => {
    const matchMedia = window.matchMedia(query);
    handleChange();
    matchMedia.addEventListener('change', handleChange);

    return () => {
      matchMedia.removeEventListener('change', handleChange);
    };
  }, [handleChange, query]);

  return matches;
}
